import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { YUELU_CENTER } from '../lib/amap/config';
import { sortRestaurants } from '../lib/restaurants/display';
import { useAmapLoader } from './useAmapLoader';
import { useMapInstance } from './useMapInstance';
import { useMarkers } from './useMarkers';
import { usePlaceSearch } from './usePlaceSearch';

export const useAmapRestaurants = ({ searchTerm, activeCategory, sortBy, mapEnabled = true }) => {
  const restaurantsRef = useRef([]);
  const uiStateRef = useRef(new Map());
  const hasMountedSearchRef = useRef(false);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const { loadAmap, amapRef } = useAmapLoader();
  const { mapRef, mapInstanceRef, pendingFocusRef, mapLoading, mapError, mapLoadAttempts, initMap, destroyMap, retryMapLoad, locateCenter } = useMapInstance({ loadAmap, markEnabled: mapEnabled });
  const { clearMarkers, createMarkers, updateMarkerContent } = useMarkers({ mapInstanceRef, amapRef, restaurantsRef, setSelectedRestaurant, pendingFocusRef });
  const { poiLoading, searchRestaurants: searchFn, scheduleSearch, searchTermRef, activeCategoryRef } = usePlaceSearch({ loadAmap, mapInstanceRef });

  const applyUiState = useCallback((restaurant) => {
    const savedState = uiStateRef.current.get(restaurant.id);
    if (!savedState) return restaurant;
    return { ...restaurant, ...savedState };
  }, []);

  const replaceRestaurants = useCallback((nextRestaurants) => {
    const nextWithUiState = nextRestaurants.map(applyUiState);
    restaurantsRef.current = nextWithUiState;
    setRestaurants(nextWithUiState);
    setSelectedRestaurant(prev => {
      if (!prev) return prev;
      return nextWithUiState.find(restaurant => restaurant.id === prev.id) || prev;
    });
  }, [applyUiState]);

  const wrappedSearchRestaurants = useCallback(async (forcedCenter = null) => {
    return searchFn(forcedCenter, clearMarkers, replaceRestaurants, createMarkers, applyUiState);
  }, [searchFn, clearMarkers, replaceRestaurants, createMarkers, applyUiState]);

  const wrappedInitMap = useCallback(async () => {
    return initMap(createMarkers, restaurantsRef);
  }, [initMap, createMarkers]);

  const wrappedDestroyMap = useCallback(() => {
    destroyMap(clearMarkers);
  }, [destroyMap, clearMarkers]);

  const wrappedRetryMapLoad = useCallback(() => {
    return retryMapLoad(createMarkers, restaurantsRef);
  }, [retryMapLoad, createMarkers]);

  const wrappedLocateCenter = useCallback(() => {
    locateCenter(wrappedSearchRestaurants);
  }, [locateCenter, wrappedSearchRestaurants]);

  useEffect(() => {
    wrappedSearchRestaurants(YUELU_CENTER);
  }, [wrappedSearchRestaurants]);

  useEffect(() => {
    if (!mapEnabled) {
      wrappedDestroyMap();
      return undefined;
    }
    wrappedInitMap();
    return wrappedDestroyMap;
  }, [wrappedDestroyMap, wrappedInitMap, mapEnabled]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm, searchTermRef]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory, activeCategoryRef]);

  useEffect(() => {
    if (!hasMountedSearchRef.current) {
      hasMountedSearchRef.current = true;
      return;
    }
    scheduleSearch(wrappedSearchRestaurants);
  }, [searchTerm, activeCategory, scheduleSearch, wrappedSearchRestaurants]);

  const displayRestaurants = useMemo(
    () => sortRestaurants(restaurants, sortBy),
    [restaurants, sortBy]
  );

  const focusRestaurant = useCallback((restaurant) => {
    pendingFocusRef.current = restaurant;
    setSelectedRestaurant(restaurant);
    const mapInstance = mapInstanceRef.current;
    if (mapInstance && restaurant?.coordinates) {
      mapInstance.setCenter(restaurant.coordinates);
      mapInstance.setZoom(17);
    }
  }, [pendingFocusRef, mapInstanceRef]);

  const patchRestaurant = useCallback((restaurantId, patcher) => {
    const updateRestaurant = (restaurant) => {
      if (restaurant.id !== restaurantId) return restaurant;
      const nextRestaurant = patcher(restaurant);
      uiStateRef.current.set(restaurantId, {
        isFavorite: nextRestaurant.isFavorite,
        isLiked: nextRestaurant.isLiked,
        likes: nextRestaurant.likes
      });

      updateMarkerContent(restaurantId, nextRestaurant);

      return nextRestaurant;
    };

    setRestaurants(prev => {
      const nextRestaurants = prev.map(updateRestaurant);
      restaurantsRef.current = nextRestaurants;
      return nextRestaurants;
    });
    setSelectedRestaurant(prev => (prev?.id === restaurantId ? updateRestaurant(prev) : prev));
  }, [updateMarkerContent]);

  const toggleFavorite = useCallback((restaurantId) => {
    patchRestaurant(restaurantId, restaurant => ({
      ...restaurant,
      isFavorite: !restaurant.isFavorite
    }));
  }, [patchRestaurant]);

  const toggleLike = useCallback((restaurantId) => {
    patchRestaurant(restaurantId, restaurant => {
      const isLiked = !restaurant.isLiked;
      const currentLikes = restaurant.likes || 0;
      return {
        ...restaurant,
        isLiked,
        likes: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
      };
    });
  }, [patchRestaurant]);

  return {
    mapRef,
    restaurants: displayRestaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    focusRestaurant,
    toggleFavorite,
    toggleLike,
    locateCenter: wrappedLocateCenter,
    retryMapLoad: wrappedRetryMapLoad,
    mapLoading,
    poiLoading,
    mapError,
    mapLoadAttempts
  };
};
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { YUELU_CENTER } from '../lib/amap/config';
import { sortRestaurants } from '../lib/restaurants/display';
import { useAmapLoader } from './useAmapLoader';
import { useMapInstance } from './useMapInstance';
import { useMarkers } from './useMarkers';
import { usePlaceSearch } from './usePlaceSearch';

const MAX_BUBBLE_MARKERS = 3;

const toCenterCoords = (center) => {
  if (Array.isArray(center) && center.length === 2) return center;
  if (center && typeof center.lng === 'number' && typeof center.lat === 'number') {
    return [center.lng, center.lat];
  }
  if (center && typeof center.getLng === 'function' && typeof center.getLat === 'function') {
    return [center.getLng(), center.getLat()];
  }
  return YUELU_CENTER;
};

const getDistanceMeters = (from, to) => {
  if (!Array.isArray(from) || !Array.isArray(to)) return Number.POSITIVE_INFINITY;
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getFocusedRestaurant = (sourceRestaurants, centerCoords) => {
  return sourceRestaurants
    .filter((restaurant) => Array.isArray(restaurant.coordinates))
    .map((restaurant) => ({
      restaurant,
      distance: getDistanceMeters(centerCoords, restaurant.coordinates),
    }))
    .sort((left, right) => left.distance - right.distance)[0]?.restaurant || null;
};

export const useAmapRestaurants = ({ searchTerm, activeCategory, sortBy, mapEnabled = true }) => {
  const restaurantsRef = useRef([]);
  const uiStateRef = useRef(new Map());
  const hasMountedSearchRef = useRef(false);
  const selectedRestaurantRef = useRef(null);
  const mapEnabledRef = useRef(mapEnabled);
  const markerPresentationRef = useRef(() => {});
  const searchHandlerRef = useRef(() => {});

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    selectedRestaurantRef.current = selectedRestaurant;
  }, [selectedRestaurant]);

  useEffect(() => {
    mapEnabledRef.current = mapEnabled;
  }, [mapEnabled]);

  const { loadAmap, amapRef } = useAmapLoader();
  const handleMapMoveEnd = useCallback((centerCoords) => {
    markerPresentationRef.current(restaurantsRef.current, centerCoords);
    searchHandlerRef.current(centerCoords);
  }, []);
  const { mapRef, mapInstanceRef, pendingFocusRef, mapLoading, mapError, mapLoadAttempts, initMap, destroyMap, retryMapLoad, locateCenter } = useMapInstance({
    loadAmap,
    onMoveEnd: handleMapMoveEnd,
    markEnabled: mapEnabled,
  });
  const { clearMarkers, createMarkers, updateMarkerPresentation } = useMarkers({ mapInstanceRef, amapRef, restaurantsRef, setSelectedRestaurant, pendingFocusRef });
  const { poiLoading, searchRestaurants: searchFn, scheduleSearch, searchTermRef, activeCategoryRef } = usePlaceSearch({ loadAmap, mapInstanceRef });

  const applyUiState = useCallback((restaurant) => {
    const savedState = uiStateRef.current.get(restaurant.id);
    if (!savedState) return restaurant;
    return { ...restaurant, ...savedState };
  }, []);

  const syncMarkerPresentation = useCallback((sourceRestaurants = restaurantsRef.current, center = null, forcedSelectedId = null) => {
    if (!sourceRestaurants.length) return;

    const centerCoords = toCenterCoords(center || mapInstanceRef.current?.getCenter?.() || YUELU_CENTER);
    const selectedId = forcedSelectedId || selectedRestaurantRef.current?.id || pendingFocusRef.current?.id || null;
    const rankedRestaurants = sourceRestaurants
      .filter((restaurant) => Array.isArray(restaurant.coordinates))
      .map((restaurant) => ({
        id: restaurant.id,
        distance: getDistanceMeters(centerCoords, restaurant.coordinates),
      }))
      .sort((left, right) => left.distance - right.distance);

    const featuredIds = [];
    if (selectedId && rankedRestaurants.some((restaurant) => restaurant.id === selectedId)) {
      featuredIds.push(selectedId);
    }

    const focusedId = rankedRestaurants[0]?.id || null;
    if (focusedId && !featuredIds.includes(focusedId)) {
      featuredIds.push(focusedId);
    }

    rankedRestaurants.forEach((restaurant) => {
      if (featuredIds.length >= MAX_BUBBLE_MARKERS) return;
      if (!featuredIds.includes(restaurant.id)) {
        featuredIds.push(restaurant.id);
      }
    });

    updateMarkerPresentation(sourceRestaurants, {
      featuredIds,
      focusedId,
      selectedId,
    });
  }, [mapInstanceRef, pendingFocusRef, updateMarkerPresentation]);

  markerPresentationRef.current = syncMarkerPresentation;

  const replaceRestaurants = useCallback((nextRestaurants) => {
    const nextWithUiState = nextRestaurants.map(applyUiState);
    restaurantsRef.current = nextWithUiState;
    setRestaurants(nextWithUiState);
    setSelectedRestaurant((prev) => {
      if (!prev) return prev;
      return nextWithUiState.find((restaurant) => restaurant.id === prev.id) || prev;
    });
  }, [applyUiState]);

  const wrappedSearchRestaurants = useCallback(async (forcedCenter = null) => {
    return searchFn(
      forcedCenter,
      clearMarkers,
      replaceRestaurants,
      createMarkers,
      applyUiState,
      (nextRestaurants, centerCoords) => {
        if (!mapEnabledRef.current) return;
        const focusedRestaurant = getFocusedRestaurant(nextRestaurants, centerCoords);
        pendingFocusRef.current = focusedRestaurant;
        setSelectedRestaurant(focusedRestaurant);
        syncMarkerPresentation(nextRestaurants, centerCoords, focusedRestaurant?.id || null);
      },
    );
  }, [applyUiState, clearMarkers, createMarkers, pendingFocusRef, replaceRestaurants, searchFn, syncMarkerPresentation]);

  searchHandlerRef.current = wrappedSearchRestaurants;

  const wrappedInitMap = useCallback(async () => {
    return initMap(createMarkers, restaurantsRef);
  }, [createMarkers, initMap]);

  const wrappedDestroyMap = useCallback(() => {
    destroyMap(clearMarkers);
  }, [clearMarkers, destroyMap]);

  const wrappedRetryMapLoad = useCallback(() => {
    return retryMapLoad(createMarkers, restaurantsRef);
  }, [createMarkers, retryMapLoad]);

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
  }, [mapEnabled, wrappedDestroyMap, wrappedInitMap]);

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
  }, [activeCategory, scheduleSearch, searchTerm, wrappedSearchRestaurants]);

  useEffect(() => {
    syncMarkerPresentation(restaurantsRef.current);
  }, [restaurants, selectedRestaurant, syncMarkerPresentation]);

  const displayRestaurants = useMemo(() => sortRestaurants(restaurants, sortBy), [restaurants, sortBy]);

  const focusRestaurant = useCallback((restaurant) => {
    pendingFocusRef.current = restaurant;
    setSelectedRestaurant(restaurant);
    const mapInstance = mapInstanceRef.current;
    if (mapInstance && restaurant?.coordinates) {
      mapInstance.setCenter(restaurant.coordinates);
      mapInstance.setZoom(17);
      syncMarkerPresentation(restaurantsRef.current, restaurant.coordinates, restaurant.id);
    }
  }, [mapInstanceRef, pendingFocusRef, syncMarkerPresentation]);

  const patchRestaurant = useCallback((restaurantId, patcher) => {
    const updateRestaurant = (restaurant) => {
      if (restaurant.id !== restaurantId) return restaurant;
      const nextRestaurant = patcher(restaurant);
      uiStateRef.current.set(restaurantId, {
        isFavorite: nextRestaurant.isFavorite,
        isLiked: nextRestaurant.isLiked,
        likes: nextRestaurant.likes,
      });
      return nextRestaurant;
    };

    setRestaurants((prev) => {
      const nextRestaurants = prev.map(updateRestaurant);
      restaurantsRef.current = nextRestaurants;
      syncMarkerPresentation(nextRestaurants);
      return nextRestaurants;
    });
    setSelectedRestaurant((prev) => (prev?.id === restaurantId ? updateRestaurant(prev) : prev));
  }, [syncMarkerPresentation]);

  const toggleFavorite = useCallback((restaurantId) => {
    patchRestaurant(restaurantId, (restaurant) => ({
      ...restaurant,
      isFavorite: !restaurant.isFavorite,
    }));
  }, [patchRestaurant]);

  const toggleLike = useCallback((restaurantId) => {
    patchRestaurant(restaurantId, (restaurant) => {
      const isLiked = !restaurant.isLiked;
      const currentLikes = restaurant.likes || 0;
      return {
        ...restaurant,
        isLiked,
        likes: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
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
    mapLoadAttempts,
  };
};

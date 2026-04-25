import AMapLoader from '@amap/amap-jsapi-loader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AMAP_KEY,
  AMAP_PLUGINS,
  AMAP_SECURITY_CODE,
  CATEGORY_KEYWORDS,
  MAP_OPTIONS,
  PLACE_SEARCH_OPTIONS,
  SEARCH_RADIUS,
  YUELU_CENTER
} from '../lib/amap/config';
import { normalizePois } from '../lib/amap/poiAdapter';
import { sortRestaurants } from '../lib/restaurants/display';

const SEARCH_DEBOUNCE_MS = 350;
const MOVE_SEARCH_DEBOUNCE_MS = 450;

const getCenterCoords = (center) => (
  Array.isArray(center) ? center : [center.lng, center.lat]
);

const createMarkerContent = (restaurant) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative flex items-center';

  const bubble = document.createElement('div');
  bubble.className = 'bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center space-x-1 whitespace-nowrap';

  const label = document.createElement('span');
  label.textContent = restaurant.name.length > 6 ? `${restaurant.name.substring(0, 6)}...` : restaurant.name;

  const pointer = document.createElement('div');
  pointer.className = 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brand-primary';

  bubble.appendChild(label);
  bubble.appendChild(pointer);
  wrapper.appendChild(bubble);
  return wrapper;
};

export const useAmapRestaurants = ({ searchTerm, activeCategory, sortBy }) => {
  const mapRef = useRef(null);
  const amapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const restaurantsRef = useRef([]);
  const uiStateRef = useRef(new Map());
  const searchTimerRef = useRef(null);
  const moveTimerRef = useRef(null);
  const searchTermRef = useRef(searchTerm);
  const activeCategoryRef = useRef(activeCategory);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [poiLoading, setPoiLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

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

  const createMarkers = useCallback((restaurantList) => {
    const mapInstance = mapInstanceRef.current;
    const AMap = amapRef.current;
    if (!mapInstance || !AMap) return;

    clearMarkers();

    const newMarkers = restaurantList.map(restaurant => {
      const marker = new AMap.Marker({
        position: restaurant.coordinates,
        title: restaurant.name,
        content: createMarkerContent(restaurant),
        offset: new AMap.Pixel(0, -20)
      });

      marker.on('click', () => {
        const latestRestaurant = restaurantsRef.current.find(item => item.id === restaurant.id) || restaurant;
        setSelectedRestaurant(latestRestaurant);
        mapInstance.setCenter(latestRestaurant.coordinates);
        mapInstance.setZoom(17);
      });

      marker.setMap(mapInstance);
      return marker;
    });

    markersRef.current = newMarkers;
  }, [clearMarkers]);

  const searchRestaurants = useCallback((forcedCenter = null) => {
    const mapInstance = mapInstanceRef.current;
    const AMap = amapRef.current;
    if (!mapInstance || !AMap) return;

    const center = forcedCenter || mapInstance.getCenter();
    const centerCoords = getCenterCoords(center);
    const keyword = searchTermRef.current.trim() || CATEGORY_KEYWORDS[activeCategoryRef.current] || '餐饮';

    setPoiLoading(true);

    const placeSearch = new AMap.PlaceSearch(PLACE_SEARCH_OPTIONS);
    placeSearch.searchNearBy(keyword, centerCoords, SEARCH_RADIUS, (status, result) => {
      setPoiLoading(false);

      if (status !== 'complete' || !result?.poiList?.pois?.length) {
        clearMarkers();
        replaceRestaurants([]);
        return;
      }

      const nextRestaurants = normalizePois(result.poiList.pois, AMap, centerCoords);
      replaceRestaurants(nextRestaurants);
      createMarkers(nextRestaurants.map(applyUiState));
    });
  }, [applyUiState, clearMarkers, createMarkers, replaceRestaurants]);

  const scheduleSearch = useCallback((delay = SEARCH_DEBOUNCE_MS) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      searchRestaurants();
    }, delay);
  }, [searchRestaurants]);

  const initMap = useCallback(async () => {
    try {
      setMapLoading(true);
      setMapError(false);

      window._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY_CODE
      };

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('地图加载超时，请检查网络连接')), 15000);
      });

      const AMap = await Promise.race([
        AMapLoader.load({
          key: AMAP_KEY,
          version: '2.0',
          plugins: AMAP_PLUGINS
        }),
        timeoutPromise
      ]);

      amapRef.current = AMap;

      const mapInstance = new AMap.Map(mapRef.current, MAP_OPTIONS);
      mapInstance.addControl(new AMap.Scale());
      mapInstance.addControl(new AMap.ToolBar({ position: 'RB' }));
      mapInstance.on('moveend', () => {
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        moveTimerRef.current = setTimeout(() => {
          searchRestaurants();
        }, MOVE_SEARCH_DEBOUNCE_MS);
      });

      mapInstanceRef.current = mapInstance;
      setMapLoading(false);
      searchRestaurants(YUELU_CENTER);
    } catch (error) {
      console.error('地图加载失败:', error);
      setMapError(true);
      setMapLoading(false);
    }
  }, [searchRestaurants]);

  useEffect(() => {
    initMap();

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      clearMarkers();
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
    };
  }, [clearMarkers, initMap]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    if (!mapInstanceRef.current || !amapRef.current) return;
    scheduleSearch();
  }, [searchTerm, activeCategory, scheduleSearch]);

  const displayRestaurants = useMemo(
    () => sortRestaurants(restaurants, sortBy),
    [restaurants, sortBy]
  );

  const retryMapLoad = useCallback(() => {
    if (mapLoadAttempts >= 3) return;
    setMapLoadAttempts(prev => prev + 1);
    initMap();
  }, [initMap, mapLoadAttempts]);

  const locateCenter = useCallback(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance) return;
    mapInstance.panTo(YUELU_CENTER);
    mapInstance.setZoom(15);
    searchRestaurants(YUELU_CENTER);
  }, [searchRestaurants]);

  const focusRestaurant = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    const mapInstance = mapInstanceRef.current;
    if (mapInstance && restaurant?.coordinates) {
      mapInstance.setCenter(restaurant.coordinates);
      mapInstance.setZoom(17);
    }
  }, []);

  const patchRestaurant = useCallback((restaurantId, patcher) => {
    const updateRestaurant = (restaurant) => {
      if (restaurant.id !== restaurantId) return restaurant;
      const nextRestaurant = patcher(restaurant);
      uiStateRef.current.set(restaurantId, {
        isFavorite: nextRestaurant.isFavorite,
        isLiked: nextRestaurant.isLiked,
        likes: nextRestaurant.likes
      });
      return nextRestaurant;
    };

    setRestaurants(prev => {
      const nextRestaurants = prev.map(updateRestaurant);
      restaurantsRef.current = nextRestaurants;
      return nextRestaurants;
    });
    setSelectedRestaurant(prev => (prev?.id === restaurantId ? updateRestaurant(prev) : prev));
  }, []);

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
    locateCenter,
    retryMapLoad,
    mapLoading,
    poiLoading,
    mapError,
    mapLoadAttempts
  };
};

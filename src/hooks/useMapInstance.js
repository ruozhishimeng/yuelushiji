import { useCallback, useRef, useState } from 'react';
import { MAP_OPTIONS, YUELU_CENTER } from '../lib/amap/config';

const MOVE_SEARCH_DEBOUNCE_MS = 450;

export const useMapInstance = ({ loadAmap, onSearchRestaurants, markEnabled = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const moveTimerRef = useRef(null);
  const pendingFocusRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0);

  const clearMoveTimer = useCallback(() => {
    if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
  }, []);

  const focusPendingRestaurant = useCallback(() => {
    const restaurant = pendingFocusRef.current;
    const mapInstance = mapInstanceRef.current;
    if (!restaurant || !mapInstance || !restaurant.coordinates) return;
    mapInstance.setCenter(restaurant.coordinates);
    mapInstance.setZoom(17);
  }, []);

  const initMap = useCallback(async (createMarkers, restaurantsRef) => {
    if (!markEnabled || !mapRef.current || mapInstanceRef.current) return;

    try {
      setMapLoading(true);
      setMapError(false);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('地图加载超时，请检查网络连接')), 15000);
      });

      const AMap = await Promise.race([loadAmap(), timeoutPromise]);
      if (!mapRef.current) return;

      const mapInstance = new AMap.Map(mapRef.current, MAP_OPTIONS);
      mapInstance.addControl(new AMap.Scale());
      mapInstance.addControl(new AMap.ToolBar({ position: 'RB' }));
      mapInstance.on('moveend', () => {
        clearMoveTimer();
        moveTimerRef.current = setTimeout(() => {
          onSearchRestaurants();
        }, MOVE_SEARCH_DEBOUNCE_MS);
      });

      mapInstanceRef.current = mapInstance;
      setMapLoading(false);

      if (restaurantsRef.current.length > 0) {
        createMarkers(restaurantsRef.current);
        focusPendingRestaurant();
      } else {
        onSearchRestaurants(YUELU_CENTER);
      }
    } catch (error) {
      console.error('地图加载失败:', error);
      setMapError(true);
      setMapLoading(false);
    }
  }, [clearMoveTimer, focusPendingRestaurant, loadAmap, markEnabled, onSearchRestaurants]);

  const destroyMap = useCallback((clearMarkers) => {
    clearMoveTimer();
    clearMarkers();
    mapInstanceRef.current?.destroy?.();
    mapInstanceRef.current = null;
    setMapLoading(false);
  }, [clearMoveTimer]);

  const retryMapLoad = useCallback((createMarkers, restaurantsRef) => {
    if (mapLoadAttempts >= 3) return;
    setMapLoadAttempts(prev => prev + 1);
    initMap(createMarkers, restaurantsRef);
  }, [initMap, mapLoadAttempts]);

  const locateCenter = useCallback((searchFn) => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance) return;
    mapInstance.panTo(YUELU_CENTER);
    mapInstance.setZoom(15);
    searchFn(YUELU_CENTER);
  }, []);

  return {
    mapRef,
    mapInstanceRef,
    pendingFocusRef,
    mapLoading,
    mapError,
    mapLoadAttempts,
    setMapError,
    initMap,
    destroyMap,
    retryMapLoad,
    locateCenter,
    focusPendingRestaurant
  };
};
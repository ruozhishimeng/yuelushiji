import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORY_KEYWORDS, PLACE_SEARCH_OPTIONS, SEARCH_RADIUS, YUELU_CENTER } from '../lib/amap/config';
import { normalizePois } from '../lib/amap/poiAdapter';

const SEARCH_DEBOUNCE_MS = 350;

export const usePlaceSearch = ({ loadAmap, mapInstanceRef }) => {
  const [poiLoading, setPoiLoading] = useState(false);
  const searchTimerRef = useRef(null);
  const hasMountedSearchRef = useRef(false);
  const searchTermRef = useRef('');
  const activeCategoryRef = useRef('all');

  const getCenterCoords = (center) => (
    Array.isArray(center) ? center : [center.lng, center.lat]
  );

  const searchRestaurants = useCallback(async (forcedCenter = null, clearMarkers, replaceRestaurants, createMarkers, applyUiState, onResults) => {
    setPoiLoading(true);

    try {
      const AMap = await loadAmap();
      const mapInstance = mapInstanceRef.current;
      const center = forcedCenter || mapInstance?.getCenter?.() || YUELU_CENTER;
      const centerCoords = getCenterCoords(center);
      const keyword = searchTermRef.current.trim() || CATEGORY_KEYWORDS[activeCategoryRef.current] || '餐饮';

      const placeSearch = new AMap.PlaceSearch(PLACE_SEARCH_OPTIONS);

      placeSearch.searchNearBy(keyword, centerCoords, SEARCH_RADIUS, (status, result) => {
        setPoiLoading(false);

        if (status !== 'complete' || !result?.poiList?.pois?.length) {
          clearMarkers();
          replaceRestaurants([]);
          onResults?.([], centerCoords);
          return;
        }

        const nextRestaurants = normalizePois(result.poiList.pois, AMap, centerCoords);
        const nextWithUiState = nextRestaurants.map(applyUiState);
        replaceRestaurants(nextRestaurants);
        createMarkers(nextWithUiState);
        onResults?.(nextWithUiState, centerCoords);
      });
    } catch (error) {
      console.error('商家数据加载失败:', error);
      setPoiLoading(false);
    }
  }, [loadAmap, mapInstanceRef]);

  const scheduleSearch = useCallback((searchFn) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      searchFn();
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  return {
    poiLoading,
    searchRestaurants,
    scheduleSearch,
    searchTimerRef,
    hasMountedSearchRef,
    searchTermRef,
    activeCategoryRef
  };
};
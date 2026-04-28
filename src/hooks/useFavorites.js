import { useState, useCallback } from 'react';
import { favoriteApi } from '../lib/api/favoriteApi';
import { getAuthToken } from '../lib/api/client';

export function useFavorites() {
  const [favoritesMap, setFavoritesMap] = useState({});
  const toggleFavorite = useCallback(async (restaurantId) => {
    const token = getAuthToken();
    if (!token) return false;

    const isFavorited = favoritesMap[restaurantId];

    // 乐观更新
    setFavoritesMap(prev => ({ ...prev, [restaurantId]: !isFavorited }));

    try {
      if (isFavorited) {
        await favoriteApi.remove(restaurantId);
        return false;
      } else {
        await favoriteApi.add(restaurantId);
        return true;
      }
    } catch (err) {
      // 回滚
      setFavoritesMap(prev => ({ ...prev, [restaurantId]: isFavorited }));
      console.error('收藏操作失败:', err.message);
      return isFavorited;
    }
  }, [favoritesMap]);

  const setFavorite = useCallback((restaurantId, isFavorited) => {
    setFavoritesMap(prev => ({ ...prev, [restaurantId]: isFavorited }));
  }, []);

  const isFavorited = useCallback((restaurantId) => {
    return !!favoritesMap[restaurantId];
  }, [favoritesMap]);

  const syncFromRestaurants = useCallback((restaurants) => {
    const map = {};
    restaurants.forEach(r => {
      if (r.isFavorite) map[r.id] = true;
    });
    setFavoritesMap(prev => ({ ...prev, ...map }));
  }, []);

  return { toggleFavorite, setFavorite, isFavorited, syncFromRestaurants };
}
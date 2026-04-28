import { api, getAuthToken } from "./client";
import { LOCAL_DEMO_FAVORITES, LOCAL_DEMO_TOKEN } from "./demoFallback";

const cloneFavorites = () => LOCAL_DEMO_FAVORITES.map((restaurant) => ({
  ...restaurant,
  tags: [...(restaurant.tags || [])],
  photos: [...(restaurant.photos || [])],
}));

export const favoriteApi = {
  list: async () => {
    const token = getAuthToken();
    if (token === LOCAL_DEMO_TOKEN) {
      return { favorites: cloneFavorites() };
    }
    try {
      return await api.get("/users/me/favorites");
    } catch (error) {
      console.warn("[favoriteApi] fallback to local demo favorites:", error.message);
      return { favorites: cloneFavorites() };
    }
  },
  add: async (restaurantId) => {
    const token = getAuthToken();
    if (token === LOCAL_DEMO_TOKEN) {
      return { ok: true, restaurantId };
    }
    return api.post("/users/me/favorites/" + restaurantId);
  },
  remove: async (restaurantId) => {
    const token = getAuthToken();
    if (token === LOCAL_DEMO_TOKEN) {
      return { ok: true, restaurantId };
    }
    return api.delete("/users/me/favorites/" + restaurantId);
  },
};

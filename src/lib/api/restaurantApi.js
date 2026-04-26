import { api } from './client';

export const restaurantApi = {
  getRestaurants: (params) => api.get(`/restaurants?${new URLSearchParams(params)}`),
  getRestaurant: (id) => api.get(`/restaurants/${id}`),
};
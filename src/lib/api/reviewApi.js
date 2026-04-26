import { api } from './client';

export const reviewApi = {
  getReviews: (restaurantId, params) => api.get(`/restaurants/${restaurantId}/reviews?${new URLSearchParams(params)}`),
  createReview: (restaurantId, data) => api.post(`/restaurants/${restaurantId}/reviews`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
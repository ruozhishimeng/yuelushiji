import { api } from './client';

export const checkinApi = {
  createCheckin: (data) => api.post('/checkins', data),
  getCheckin: (id) => api.get(`/checkins/${id}`),
};
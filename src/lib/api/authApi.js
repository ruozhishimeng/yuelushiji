import { api } from './client';

export const authApi = {
  startEmailVerification: (data) => api.post('/student-verifications/email/start', data),
  confirmEmailVerification: (data) => api.post('/student-verifications/email/confirm', data),
  submitManualVerification: (data) => api.post('/student-verifications/manual', data),
  getCurrentVerification: () => api.get('/student-verifications/current'),
};
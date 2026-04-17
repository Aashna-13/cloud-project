import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const appService = {
  getAll: (page = 0, size = 10) => api.get(`/apps?page=${page}&size=${size}`),
  getById: (id) => api.get(`/apps/${id}`),
  create: (data) => api.post('/apps', data),
  update: (id, data) => api.put(`/apps/${id}`, data),
  delete: (id) => api.delete(`/apps/${id}`),
  search: (keyword) => api.get(`/apps/search?keyword=${keyword}`),
  launch: (id) => api.post(`/apps/${id}/launch`),
  getRecommendations: (id) => api.get(`/apps/${id}/recommendations`),
  getGlobalRecommendations: () => api.get('/apps/recommendations/global'),
  getAnalytics: () => api.get('/apps/analytics'),
};

export default api;

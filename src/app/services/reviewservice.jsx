import api from "../api"; 

export const reviewService = {
  // للعملاء
  getList: (params) => api.get('/reviews', { params }),
  add: (data) => api.post('/reviews', data),
  vote: (id, value) => api.post(`/reviews/${id}/vote`, { value }),
  report: (id, data) => api.post(`/reviews/${id}/report`, data),
  
  // إحصائيات
  getStats: (productId) => api.get(`/reviews/stats/distribution`, { params: { productId } }),
  getAverage: (productId) => api.get(`/reviews/stats/average`, { params: { productId } }),

  // للمسؤول (Admin)
  adminGetList: (params) => api.get('/reviews/admin', { params }),
  adminDelete: (id, reason) => api.delete(`/reviews/${id}`, { data: { reason } }),
  adminToggle: (id, enable) => api.put(`/reviews/${id}/toggle`, { enable }),
  adminReply: (id, content) => api.post(`/reviews/${id}/reply`, { content }),
};
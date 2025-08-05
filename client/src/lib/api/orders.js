import apiClient from './client';

export const ordersAPI = {
  async createOrder(orderData) {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },

  async getOrders() {
    const response = await apiClient.get('/api/orders');
    return response.data;
  },

  async getOrder(id) {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await apiClient.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id) {
    const response = await apiClient.put(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
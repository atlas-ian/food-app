import apiClient from './client';

export const paymentsAPI = {
  async createCheckoutSession(items) {
    const response = await apiClient.post('/api/payments/create-checkout-session', {
      items,
    });
    return response.data;
  },

  async verifyPayment(sessionId) {
    const response = await apiClient.post('/api/payments/verify', {
      sessionId,
    });
    return response.data;
  },

  async getPaymentMethods() {
    const response = await apiClient.get('/api/payments/methods');
    return response.data;
  },

  async addPaymentMethod(paymentMethodData) {
    const response = await apiClient.post('/api/payments/methods', paymentMethodData);
    return response.data;
  },

  async removePaymentMethod(id) {
    const response = await apiClient.delete(`/api/payments/methods/${id}`);
    return response.data;
  },
};
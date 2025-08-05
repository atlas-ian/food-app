import apiClient from './client';

export const authAPI = {
  async login(email, password) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await apiClient.put('/api/auth/profile', userData);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await apiClient.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await apiClient.post('/api/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};
import apiClient from './client';

export const foodsAPI = {
  async getFoods(params = {}) {
    const response = await apiClient.get('/api/foods', { params });
    return response.data;
  },

  async getFood(id) {
    const response = await apiClient.get(`/api/foods/${id}`);
    return response.data;
  },

  async searchFoods(query, filters = {}) {
    const response = await apiClient.get('/api/foods/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  async getFoodsByCategory(category) {
    const response = await apiClient.get(`/api/foods/category/${category}`);
    return response.data;
  },
};
const API_BASE_URL = '/api';

export const menuAPI = {
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  },

  async getMenu() {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }
    return response.json();
  }
};

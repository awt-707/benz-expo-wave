
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export const visitorApi = {
  // Record a visit
  recordVisit: async (page: string) => {
    try {
      await fetch(`${API_BASE_URL}/visitors/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      });
    } catch (error) {
      // Silently fail - we don't want to interrupt user experience if tracking fails
      console.error('Error recording visit:', error);
    }
  },

  // Get visitor stats (admin)
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  }
};

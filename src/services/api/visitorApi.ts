
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export interface VisitorStats {
  totalVisitors: number;
  visitorsLast24Hours: number;
  visitorsLast7Days: number;
  mostVisitedPages: Array<{
    _id: string;
    count: number;
  }>;
}

export const visitorApi = {
  // Record a visit
  recordVisit: async (page: string) => {
    try {
      console.log('Recording visit for page:', page);
      await fetch(`${API_BASE_URL}/visitors/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      });
      console.log('Visit recorded successfully');
    } catch (error) {
      // Silently fail - we don't want to interrupt user experience if tracking fails
      console.error('Error recording visit:', error);
    }
  },

  // Get visitor stats (admin)
  getStats: async (): Promise<VisitorStats | null> => {
    try {
      console.log('Fetching visitor stats...');
      const response = await fetch(`${API_BASE_URL}/visitors/stats`, {
        headers: getAuthHeaders(),
      });
      
      // If the response is not ok, throw an error to be caught below
      if (!response.ok) {
        throw new Error(`Error fetching visitor stats: ${response.status}`);
      }
      
      const data = await handleResponse(response);
      console.log('Visitor stats retrieved:', data);
      
      if (data.error) {
        console.error('Error in visitor stats response:', data.message);
        return null;
      }
      
      return data as VisitorStats;
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      return null;
    }
  }
};

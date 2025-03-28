
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export const mediaApi = {
  // Get all media
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },
  
  // Upload media
  upload: async (file: File) => {
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },
  
  // Delete media
  delete: async (filename: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting media ${filename}:`, error);
      throw error;
    }
  }
};

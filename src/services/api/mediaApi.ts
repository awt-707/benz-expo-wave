
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

export const mediaApi = {
  // Get all media
  getAll: async () => {
    try {
      console.log('Fetching all media...');
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching media:', error);
      return handleApiError(error);
    }
  },
  
  // Upload media
  upload: async (file: File) => {
    try {
      console.log('Uploading media file:', file.name, 'Size:', file.size);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        return { error: true, message: 'Authentication required' };
      }
      
      const formData = new FormData();
      formData.append('media', file);
      
      console.log('Upload endpoint:', `${API_BASE_URL}/media/upload`);
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('Media upload response status:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading media:', error);
      return handleApiError(error);
    }
  },
  
  // Delete media
  delete: async (filename: string) => {
    try {
      console.log('Deleting media:', filename);
      const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting media ${filename}:`, error);
      return handleApiError(error);
    }
  }
};

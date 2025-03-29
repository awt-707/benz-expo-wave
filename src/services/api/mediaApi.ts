
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export const mediaApi = {
  // Get all media
  getAll: async () => {
    try {
      console.log('Fetching all media...');
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to fetch media: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched media:', data);
      return data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },
  
  // Upload media
  upload: async (file: File) => {
    try {
      console.log('Uploading media file:', file.name, 'Size:', file.size);
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to upload media: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Upload response:', result);
      return result;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to delete media: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Delete response:', result);
      return result;
    } catch (error) {
      console.error(`Error deleting media ${filename}:`, error);
      throw error;
    }
  }
};

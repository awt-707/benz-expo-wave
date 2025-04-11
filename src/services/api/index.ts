
import { configApi } from './configApi';
import { vehiclesApi } from './vehiclesApi';
import { mediaApi } from './mediaApi';

// Admin API
const adminApi = {
  // Upload video methods
  uploadVideo: async (videoFile: File) => {
    try {
      console.log('Uploading video via adminApi:', videoFile.name);
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      };
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/upload-video`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: true, message: errorData.message || 'Error uploading video' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in adminApi.uploadVideo:', error);
      return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  // Save custom page method
  saveCustomPage: async (pageKey: string, pageData: { title: string; content: string }) => {
    try {
      console.log('Saving custom page via adminApi:', pageKey, pageData);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/custom-page/${pageKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(pageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: true, message: errorData.message || 'Error saving custom page' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in adminApi.saveCustomPage:', error);
      return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

export {
  configApi,
  vehiclesApi,
  mediaApi,
  adminApi
};


import { configApi } from './configApi';
import { vehiclesApi } from './vehiclesApi';
import { mediaApi } from './mediaApi';
import { contactApi } from './contactApi';
import { visitorApi } from './visitorApi';

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
  },
  
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: true, message: errorData.message || 'Error fetching dashboard stats' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in adminApi.getDashboardStats:', error);
      return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  // Get site configuration
  getSiteConfig: async () => {
    try {
      console.log('Fetching site configuration');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/site-config`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: true, message: errorData.message || 'Error fetching site configuration' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in adminApi.getSiteConfig:', error);
      return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Re-export API_BASE_URL from apiUtils for components that need it directly
export { API_BASE_URL } from './apiUtils';

export {
  configApi,
  vehiclesApi,
  mediaApi,
  contactApi,
  visitorApi,
  adminApi
};

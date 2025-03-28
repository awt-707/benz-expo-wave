
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export const adminApi = {
  // Login
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get site config
  getSiteConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update site config
  updateSiteConfig: async (config: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    return handleResponse(response);
  },
  
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  
  // Get activity log
  getActivityLog: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/activity`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  // Save custom page
  saveCustomPage: async (pageKey: string, pageData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/custom-page/${pageKey}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pageData),
    });
    return handleResponse(response);
  },

  // Upload video
  uploadVideo: async (videoFile: File) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('video', videoFile);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload-video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  }
};

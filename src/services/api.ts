
// API service for communicating with our backend

// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Helper pour obtenir le token d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Admin API
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

// Vehicles API
export const vehiclesApi = {
  // Get all vehicles
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/vehicles`);
    return handleResponse(response);
  },

  // Get featured vehicles
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/vehicles/featured`);
    return handleResponse(response);
  },

  // Get single vehicle
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    return handleResponse(response);
  },

  // Create vehicle
  create: async (vehicleData: any) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  // Update vehicle
  update: async (id: string, vehicleData: any) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  // Delete vehicle
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Upload images
  uploadImages: async (id: string | null, images: File[]) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    images.forEach(image => {
      formData.append('images', image);
    });
    
    const endpoint = id 
      ? `${API_BASE_URL}/vehicles/upload/${id}`
      : `${API_BASE_URL}/vehicles/upload`;
      
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return handleResponse(response);
  }
};

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (contactData: any) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return handleResponse(response);
  },

  // Get all messages (admin)
  getMessages: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Mark message as responded
  markResponded: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Delete message (admin)
  deleteMessage: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Media API
export const mediaApi = {
  // Get all media
  getAll: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },
  
  // Upload media
  upload: async (file: File) => {
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
  },
  
  // Delete media
  delete: async (filename: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  }
};

// Visitor tracking API
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
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/visitors/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  }
};

// Site configuration API
export const configApi = {
  // Get site configuration
  getConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/site-config`);
    return handleResponse(response);
  }
};

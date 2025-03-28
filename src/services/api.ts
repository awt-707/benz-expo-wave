
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

// Vehicles API
export const vehiclesApi = {
  // Get all vehicles
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get featured vehicles
  getFeatured: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/featured`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
      throw error;
    }
  },

  // Get single vehicle
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Create vehicle
  create: async (vehicleData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update vehicle
  update: async (id: string, vehicleData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete vehicle
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Upload images
  uploadImages: async (id: string | null, images: File[]) => {
    try {
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
    } catch (error) {
      console.error('Error uploading vehicle images:', error);
      throw error;
    }
  }
};

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (contactData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Get all messages (admin)
  getMessages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Mark message as responded
  markResponded: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}/respond`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error marking message ${id} as responded:`, error);
      throw error;
    }
  },

  // Delete message (admin)
  deleteMessage: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }
};

// Media API
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

// Site configuration API
export const configApi = {
  // Get site configuration
  getConfig: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/site-config`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching site configuration:', error);
      throw error;
    }
  }
};


// API service for communicating with our backend

// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  // Update vehicle
  update: async (id: string, vehicleData: any) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  // Delete vehicle
  delete: async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/contact/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Delete message (admin)
  deleteMessage: async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/contact/messages/${id}`, {
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
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/visitors/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
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

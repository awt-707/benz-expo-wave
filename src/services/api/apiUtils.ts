
// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  console.log(`API Response: ${response.url}`, response.status, response.statusText);
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (parseError) {
      console.error('Error parsing API error response:', parseError);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
  }
  
  try {
    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (parseError) {
    console.error('Error parsing API success response:', parseError);
    throw new Error('Failed to parse server response');
  }
};

// Helper to obtain authentication headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  
  console.log('Using authentication token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper to check authentication status
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Helper to handle API errors
export const handleApiError = (error: any) => {
  console.error('API error:', error);
  const message = error.message || 'Une erreur est survenue lors de la communication avec le serveur';
  return { error: true, message };
};

// Helper to refresh token if needed
export const refreshAdminToken = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  
  try {
    // Call a refresh endpoint - this would need to be implemented on the server
    const response = await fetch(`${API_BASE_URL}/admin/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      localStorage.removeItem('adminToken');
      return false;
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};


// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
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
    return await response.json();
  } catch (parseError) {
    console.error('Error parsing API success response:', parseError);
    throw new Error('Failed to parse server response');
  }
};

// Helper to obtain authentication headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
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

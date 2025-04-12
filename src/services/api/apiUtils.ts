
import { API_CONFIG, buildApiUrl } from '@/config/apiConfig';

// Define API base URL
export const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Get authentication headers for protected API calls
 * @returns Headers object with Authorization token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Handle API response and standardize error handling
 * @param response Fetch response object
 * @returns Processed response data or error object
 */
export const handleResponse = async (response) => {
  if (!response) {
    console.error('Network error - no response received');
    return { error: true, message: 'Network error - check your server connection' };
  }

  if (!response.ok) {
    // Try to get error details from response
    try {
      const errorData = await response.json();
      return { 
        error: true, 
        status: response.status,
        message: errorData.message || `Error: ${response.status} ${response.statusText}`
      };
    } catch (parseError) {
      return { 
        error: true, 
        status: response.status,
        message: `Error: ${response.status} ${response.statusText}`
      };
    }
  }

  try {
    return await response.json();
  } catch (error) {
    // If there's no JSON to parse but response was OK (e.g., 204 No Content)
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }
    
    return { error: true, message: 'Error parsing response' };
  }
};

/**
 * Standardized API error handler
 * @param error Error object
 * @returns Formatted error object
 */
export const handleApiError = (error) => {
  console.error('API error:', error);
  return { 
    error: true, 
    message: error instanceof Error ? error.message : 'Unknown error' 
  };
};

/**
 * Helper to check if token is expired or user is not authenticated
 * @param error Error object from API call
 * @returns Boolean indicating if authentication failed
 */
export const isAuthError = (error) => {
  if (!error) return false;
  
  const errorMsg = typeof error.message === 'string' ? error.message.toLowerCase() : '';
  return (
    error.status === 401 || 
    error.status === 403 || 
    errorMsg.includes('unauthorized') ||
    errorMsg.includes('forbidden') ||
    errorMsg.includes('token') ||
    errorMsg.includes('authentication')
  );
};

/**
 * Effectue une requête API avec gestion d'erreur et retry
 */
export const fetchWithRetry = async (url: string, options: RequestInit = {}, maxRetries = API_CONFIG.RETRY.MAX_RETRIES) => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      console.log(`Fetching ${url} (attempt ${retries + 1}/${maxRetries + 1})`);
      
      // Create a proper RequestInit object with correct types
      const requestOptions: RequestInit = {
        ...API_CONFIG.DEFAULT_OPTIONS,
        ...options,
        headers: {
          ...API_CONFIG.DEFAULT_OPTIONS.headers,
          ...(options.headers || {})
        },
        // Fix the credentials type issue by providing a valid RequestCredentials value
        credentials: (API_CONFIG.DEFAULT_OPTIONS.credentials as RequestCredentials) || 'same-origin'
      };
      
      const response = await fetch(buildApiUrl(url), requestOptions);
      
      return response;
    } catch (error) {
      retries++;
      console.error(`Fetch attempt ${retries} failed for ${url}:`, error);
      
      if (retries <= maxRetries) {
        // Attente exponentielle entre les retries
        const delay = API_CONFIG.RETRY.RETRY_DELAY * Math.pow(2, retries - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

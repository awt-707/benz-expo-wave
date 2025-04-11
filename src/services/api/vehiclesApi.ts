
import { handleResponse, handleApiError, getAuthHeaders, fetchWithRetry } from './apiUtils';

export const vehiclesApi = {
  // Get all vehicles
  getAll: async () => {
    try {
      const response = await fetchWithRetry('/vehicles');
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get a single vehicle by ID
  getById: async (id: string) => {
    try {
      const response = await fetchWithRetry(`/vehicles/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get featured vehicles
  getFeatured: async () => {
    try {
      const response = await fetchWithRetry('/vehicles/featured');
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Create a new vehicle (admin only)
  create: async (vehicleData: any) => {
    try {
      const response = await fetchWithRetry('/vehicles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update a vehicle (admin only)
  update: async (id: string, vehicleData: any) => {
    try {
      const response = await fetchWithRetry(`/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Delete a vehicle (admin only)
  delete: async (id: string) => {
    try {
      const response = await fetchWithRetry(`/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Upload vehicle images
  uploadImages: async (vehicleId: string, formData: FormData) => {
    try {
      // Supprimez le Content-Type car il sera défini automatiquement avec le boundary pour FormData
      const headers = getAuthHeaders();
      delete headers['Content-Type'];
      
      const response = await fetchWithRetry(`/vehicles/upload/${vehicleId}`, {
        method: 'POST',
        headers,
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};


import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export const vehiclesApi = {
  // Get all vehicles
  getAll: async () => {
    try {
      console.log('Fetching all vehicles...');
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched vehicles:', data);
      return data;
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
      console.log('Creating vehicle:', vehicleData);
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to create vehicle: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update vehicle
  update: async (id: string, vehicleData: any) => {
    try {
      console.log('Updating vehicle:', id, vehicleData);
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to update vehicle: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete vehicle
  delete: async (id: string) => {
    try {
      console.log('Deleting vehicle:', id);
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to delete vehicle: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Upload images
  uploadImages: async (id: string | null, images: File[]) => {
    try {
      console.log('Uploading images for vehicle:', id, 'Number of images:', images.length);
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      
      images.forEach(image => {
        formData.append('images', image);
      });
      
      const endpoint = id 
        ? `${API_BASE_URL}/vehicles/upload/${id}`
        : `${API_BASE_URL}/vehicles/upload`;
      
      console.log('Upload endpoint:', endpoint);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to upload images: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Upload response:', result);
      return result;
    } catch (error) {
      console.error('Error uploading vehicle images:', error);
      throw error;
    }
  }
};

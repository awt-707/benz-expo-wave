
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const contactApi = {
  // Submit contact form
  submit: async (contactData: ContactFormData) => {
    try {
      console.log('Submitting contact form:', contactData);
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
      return handleApiError(error);
    }
  },

  // Get all messages (admin)
  getMessages: async () => {
    try {
      console.log('Fetching contact messages...');
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return handleApiError(error);
    }
  },

  // Get a single message by ID
  getMessage: async (id: string) => {
    try {
      console.log(`Fetching contact message with ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      return handleApiError(error);
    }
  },

  // Mark message as responded
  markResponded: async (id: string) => {
    try {
      console.log(`Marking message ${id} as responded...`);
      const response = await fetch(`${API_BASE_URL}/contact/${id}/respond`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error marking message ${id} as responded:`, error);
      return handleApiError(error);
    }
  },

  // Delete message (admin)
  deleteMessage: async (id: string) => {
    try {
      console.log(`Deleting message ${id}...`);
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      return handleApiError(error);
    }
  }
};

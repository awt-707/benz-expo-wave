
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

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

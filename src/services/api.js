// API service for authentication and other API calls
// Replace the base URL with your actual backend URL

import config from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async sendOTP(email) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/admin/logout', {
      method: 'POST',
    });
  }

  // User management methods
  async getUsers() {
    return this.request('/admin/users');
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Resident management methods
  async getResidents(page = 1) {
    return this.request(`/admin/residents?page=${page}`);
  }

  async getResidentRequests(page = 1) {
    return this.request(`/admin/resident-requests?page=${page}`);
  }

  async getResidentById(residentId) {
    return this.request(`/admin/residents/${residentId}`);
  }

  async updateResident(residentId, residentData) {
    return this.request(`/admin/residents/${residentId}`, {
      method: 'PUT',
      body: JSON.stringify(residentData),
    });
  }

  // Other API methods can be added here...
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 
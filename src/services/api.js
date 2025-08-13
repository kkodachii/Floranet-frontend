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
      'Accept': 'application/json',
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
  async getResidents(page = 1, search = '', filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/residents?${params.toString()}`);
  }

  async getResidentRequests(page = 1, search = '', filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/resident-requests?${params.toString()}`);
  }

  async getArchivedResidents(page = 1, search = '', filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/archived-residents?${params.toString()}`);
  }

  async getResidentById(residentId) {
    return this.request(`/admin/residents/${residentId}`);
  }

  async getNextResidentId() {
    return this.request(`/admin/residents-next-id`);
  }

  async updateResident(residentId, residentData) {
    return this.request(`/admin/residents/${residentId}`, {
      method: 'PUT',
      body: JSON.stringify(residentData),
    });
  }

  async createResident(residentData) {
    return this.request(`/admin/residents`, {
      method: 'POST',
      body: JSON.stringify(residentData),
    });
  }

  async acceptResidentRequest(id) {
    return this.request(`/admin/resident-requests/${id}/accept`, {
      method: 'POST',
    });
  }

  async deleteResidentRequest(id) {
    return this.request(`/admin/resident-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async archiveResident(id) {
    return this.request(`/admin/residents/${id}/archive`, {
      method: 'POST',
    });
  }

  async unarchiveResident(id) {
    return this.request(`/admin/residents/${id}/unarchive`, {
      method: 'POST',
    });
  }

  // Vendor management methods
  async getVendors(queryParams = '') {
    return this.request(`/admin/vendors${queryParams}`);
  }

  async getVendorsWithDetails(search = '', filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/vendors-with-details?${params.toString()}`);
  }

  async getVendorRequests(search = '', filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/vendor-requests?${params.toString()}`);
  }

  async getArchivedVendors(search = '', filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/admin/archived-vendors?${params.toString()}`);
  }

  async getVendorById(id) {
    return this.request(`/admin/vendors/${id}`);
  }

  async createVendor(vendorData) {
    return this.request('/admin/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  }

  async updateVendor(id, vendorData) {
    return this.request(`/admin/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  }

  async archiveVendor(id) {
    return this.request(`/admin/vendors/${id}/archive`, {
      method: 'POST',
    });
  }

  async unarchiveVendor(id) {
    return this.request(`/admin/vendors/${id}/unarchive`, {
      method: 'POST',
    });
  }

  async deleteVendor(id) {
    return this.request(`/admin/vendors/${id}`, {
      method: 'DELETE',
    });
  }

  async acceptVendor(id) {
    return this.request(`/admin/vendors/${id}/accept`, {
      method: 'POST',
    });
  }

  async rejectVendor(id) {
    return this.request(`/admin/vendors/${id}/reject`, {
      method: 'POST',
    });
  }
  
  // Other API methods can be added here...
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 
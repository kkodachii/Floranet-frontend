// Environment configuration for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const config = {
  API_BASE_URL,
  ENDPOINTS: {
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    LOGOUT: `${API_BASE_URL}/api/admin/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
    FORGOT_PASSWORD_ADMIN: `${API_BASE_URL}/api/forgot-password-admin`,
    RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  }
};

export default config; 
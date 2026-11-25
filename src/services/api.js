/**
 * API Service for Medical Store Inventory and Sales Management System
 * Connects React frontend to Spring Boot backend running on http://localhost:8080/api
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Helper to get current JWT token
 */
export const getAuthToken = () => {
  return localStorage.getItem('medstore_jwt_token');
};

/**
 * Standard fetch wrapper with JWT authentication header
 */
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is not running or network fails
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot connect to backend server. Please ensure Spring Boot backend is running on port 8080.');
      netError.isNetworkError = true;
      throw netError;
    }
    throw error;
  }
}

export const authApi = {
  /**
   * Public Staff Registration
   */
  signup: async (signupData) => {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  },

  /**
   * User Login (Admin & Staff)
   */
  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get Current Authenticated User Profile
   */
  getCurrentUser: async () => {
    return request('/auth/me', {
      method: 'GET',
    });
  },
};

export const adminApi = {
  /**
   * Get all users (Admin only)
   */
  getAllUsers: async () => {
    return request('/admin/users', {
      method: 'GET',
    });
  },

  /**
   * Get all staff members (Admin only)
   */
  getAllStaff: async () => {
    return request('/admin/staff', {
      method: 'GET',
    });
  },

  /**
   * Admin creates a staff member
   */
  createStaff: async (staffData) => {
    return request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  /**
   * Toggle staff active/inactive status
   */
  toggleStaffStatus: async (staffId) => {
    return request(`/admin/staff/${staffId}/toggle-status`, {
      method: 'PUT',
    });
  },

  /**
   * Delete staff member
   */
  deleteStaff: async (staffId) => {
    return request(`/admin/staff/${staffId}`, {
      method: 'DELETE',
    });
  },
};

export const staffApi = {
  /**
   * Get permissions for current authenticated user
   */
  getPermissions: async () => {
    return request('/staff/permissions', {
      method: 'GET',
    });
  },
};

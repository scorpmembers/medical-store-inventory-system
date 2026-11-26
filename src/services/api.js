/**
 * API Service for Medical Store Inventory and Sales Management System
 * Multi-Tenant Edition — Connects React frontend to Spring Boot backend on http://localhost:8080/api
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
   * Register a new Medical Store with Admin account
   */
  registerStore: async (data) => {
    return request('/auth/register-store', {
      method: 'POST',
      body: JSON.stringify(data),
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

export const storeApi = {
  /**
   * Get authenticated user's store profile
   */
  getProfile: async () => {
    return request('/stores/profile', { method: 'GET' });
  },

  /**
   * Update store profile (Admin only)
   */
  updateProfile: async (data) => {
    return request('/stores/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export const adminApi = {
  /**
   * Get all staff members in the Admin's store (tenant-scoped)
   */
  getAllStaff: async () => {
    return request('/admin/staff', { method: 'GET' });
  },

  /**
   * Admin creates a staff member scoped to their store
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
    return request(`/admin/staff/${staffId}/toggle-status`, { method: 'PUT' });
  },

  /**
   * Delete staff member
   */
  deleteStaff: async (staffId) => {
    return request(`/admin/staff/${staffId}`, { method: 'DELETE' });
  },
};

export const medicineApi = {
  getAll: async () => request('/medicines', { method: 'GET' }),
  getById: async (id) => request(`/medicines/${id}`, { method: 'GET' }),
  create: async (data) => request('/medicines', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => request(`/medicines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => request(`/medicines/${id}`, { method: 'DELETE' }),
};

export const inventoryApi = {
  getAll: async () => request('/inventory', { method: 'GET' }),
  getByMedicine: async (medicineId) => request(`/inventory/medicine/${medicineId}`, { method: 'GET' }),
  addBatch: async (medicineId, data) => request(`/inventory/medicine/${medicineId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateBatch: async (id, data) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBatch: async (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
};

export const supplierApi = {
  getAll: async () => request('/suppliers', { method: 'GET' }),
  getById: async (id) => request(`/suppliers/${id}`, { method: 'GET' }),
  create: async (data) => request('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => request(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => request(`/suppliers/${id}`, { method: 'DELETE' }),
};

export const purchaseApi = {
  getAll: async () => request('/purchases', { method: 'GET' }),
  getById: async (id) => request(`/purchases/${id}`, { method: 'GET' }),
  create: async (data) => request('/purchases', { method: 'POST', body: JSON.stringify(data) }),
};

export const saleApi = {
  getAll: async () => request('/sales', { method: 'GET' }),
  getById: async (id) => request(`/sales/${id}`, { method: 'GET' }),
  create: async (data) => request('/sales', { method: 'POST', body: JSON.stringify(data) }),
};

export const reportApi = {
  getDashboard: async () => request('/reports/dashboard', { method: 'GET' }),
};

export const staffApi = {
  getPermissions: async () => request('/staff/permissions', { method: 'GET' }),
};

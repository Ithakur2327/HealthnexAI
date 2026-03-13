import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register new user
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Extract meaningful error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Extract meaningful error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      // Update local storage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
};

// Assessment API
export const assessmentAPI = {
  create: async (assessmentData) => {
    try {
      const response = await api.post('/assessment', assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/assessment/my-assessments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/assessment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/assessment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLatest: async () => {
    try {
      const response = await api.get('/assessment/latest');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Chat API (NexAI)
export const chatAPI = {
  sendMessage: async (message, conversationHistory = []) => {
    try {
      const response = await api.post('/chat', {
        message,
        conversationHistory,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/chat/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clearHistory: async () => {
    try {
      const response = await api.delete('/chat/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecommendations: async (assessmentId) => {
    try {
      const response = await api.post('/chat/recommendations', {
        assessmentId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
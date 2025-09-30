import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection header
  },
  withCredentials: true, // Include cookies for session management
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await apiClient.post('/users/register', {
        full_name: userData.fullName,
        id_number: userData.idNumber,
        account_number: userData.accountNumber,
        username: userData.username,
        password: userData.password,
      });
      
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      
      return {
        success: true,
        token,
        message: 'Registration successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post('/users/login', {
        username: credentials.username,
        account_number: credentials.accountNumber,
        password: credentials.password,
      });
      
      const { token, role, userId, username, fullName } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('fullName', fullName);
      
      return {
        success: true,
        token,
        role,
        userId,
        username,
        fullName,
        message: 'Login successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check your credentials.'
      };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    window.location.href = '/signin';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Get current token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Get user role
  getUserRole() {
    return localStorage.getItem('userRole') || 'customer';
  },

  // Get current user ID
  getCurrentUserId() {
    return localStorage.getItem('userId');
  },

  // Get current user info
  getCurrentUser() {
    return {
      id: this.getCurrentUserId(),
      username: localStorage.getItem('username'),
      fullName: localStorage.getItem('fullName'),
      role: this.getUserRole()
    };
  },

  // Check if user is employee
  isEmployee() {
    return this.getUserRole() === 'employee';
  }
};

export default authService;

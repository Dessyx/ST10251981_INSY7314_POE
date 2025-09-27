import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
      
      const { token, role } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      
      return {
        success: true,
        token,
        role,
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

  // Check if user is employee
  isEmployee() {
    return this.getUserRole() === 'employee';
  }
};

export default authService;

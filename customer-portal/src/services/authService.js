import axios from 'axios';

// HTTPS for secure communication
const API_BASE_URL = 'https://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection header
  },
  withCredentials: true, 
});

// CSRF token storage
let csrfToken = null;
let csrfTokenExpiry = null;

// Function to get CSRF token
const getCsrfToken = async () => {
  if (csrfToken && csrfTokenExpiry && Date.now() < csrfTokenExpiry) {
    return csrfToken;
  }
  
  try {
    const response = await apiClient.get('/users/csrf-token');
    csrfToken = response.data.csrfToken;
    csrfTokenExpiry = Date.now() + response.data.expiresIn - 30000;
    return csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw new Error('Failed to get CSRF token');
  }
};

const clearCsrfToken = () => {
  csrfToken = null;
  csrfTokenExpiry = null;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('fullName');
      
      if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register a new user
  async register(userData) {
    try {
      // Get CSRF token
      const token = await getCsrfToken();
      
      const response = await apiClient.post('/users/register', {
        full_name: userData.fullName,
        id_number: userData.idNumber,
        account_number: userData.accountNumber,
        username: userData.username,
        password: userData.password,
      }, {
        headers: {
          'X-CSRF-Token': token
        }
      });
      
      const { user } = response.data;
      
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      
      clearCsrfToken();
      
      return {
        success: true,
        user,
        message: 'Registration successful!'
      };
    } catch (error) {
      clearCsrfToken();
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },

  // Login user
  async login(credentials) {
    try {
      // Get CSRF token
      const token = await getCsrfToken();
      
      const response = await apiClient.post('/users/login', {
        username: credentials.username,
        account_number: credentials.accountNumber,
        password: credentials.password,
      }, {
        headers: {
          'X-CSRF-Token': token
        }
      });
      
      const { user } = response.data;
      
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('username', user.username);
      localStorage.setItem('fullName', user.fullName);
      
      clearCsrfToken();
      
      return {
        success: true,
        user,
        message: 'Login successful!'
      };
    } catch (error) {
      clearCsrfToken();
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  },

  // Logout user
  async logout() {
    try {
      // Get CSRF token
      const token = await getCsrfToken();
      
      // Call logout endpoint to clear HTTPOnly cookie
      await apiClient.post('/users/logout', {}, {
        headers: {
          'X-CSRF-Token': token
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
    
    // Clear CSRF token
    clearCsrfToken();
    
    // Clear localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    
    window.location.href = '/signin';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('userId');
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

  // Check if user is admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  },

  // Check if user can access dashboard (admin only)
  canAccessDashboard() {
    return this.getUserRole() === 'admin';
  },

  // Verify authentication with server
  async verifyAuth() {
    try {
      // This will use the HTTPOnly cookie automatically
      const response = await apiClient.get('/users/verify');
      return response.data.authenticated === true;
    } catch (error) {
      return false;
    }
  }
};

export default authService;

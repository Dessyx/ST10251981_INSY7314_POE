// Payment Service for API Integration
import axios from 'axios';
import { authService } from './authService';

// Updated to use HTTPS for secure communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  },
  withCredentials: true, // REQUIRED for HTTPOnly cookies - automatically sends cookies
});

// CSRF token management for payment operations
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

// Function to clear CSRF token
const clearCsrfToken = () => {
  csrfToken = null;
  csrfTokenExpiry = null;
};

class PaymentService {
  // Create a new transaction
  static async createTransaction(transactionData) {
    try {
      // Get CSRF token
      const token = await getCsrfToken();
      
      const response = await apiClient.post('/transactions', transactionData, {
        headers: {
          'X-CSRF-Token': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Payment service error:', error);
      clearCsrfToken(); // Clear token on error
      throw new Error(error.response?.data?.error || 'Failed to create transaction');
    }
  }

  // Get all transactions for a user
  static async getTransactions(userId = null) {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Fetch transactions error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
    }
  }

  // Get a specific transaction by ID
  static async getTransaction(transactionId) {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Fetch transaction error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch transaction');
    }
  }

  // Update transaction status
  static async updateTransactionStatus(transactionId, status) {
    try {
      // Get CSRF token
      const token = await getCsrfToken();
      
      const response = await apiClient.patch(`/transactions/${transactionId}`, { status }, {
        headers: {
          'X-CSRF-Token': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update transaction error:', error);
      clearCsrfToken(); // Clear token on error
      throw new Error(error.response?.data?.error || 'Failed to update transaction');
    }
  }

  // Validate payment data before sending
  static validatePaymentData(paymentData) {
    const errors = {};
    
    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!paymentData.currency || !['ZAR', 'USD', 'EUR', 'GBP'].includes(paymentData.currency)) {
      errors.currency = 'Invalid currency';
    }
    
    if (!paymentData.recipient || paymentData.recipient.trim().length < 2) {
      errors.recipient = 'Recipient name is required';
    }
    
    if (!paymentData.provider || paymentData.provider.trim().length < 2) {
      errors.provider = 'Provider name is required';
    }
    
    const swiftCode = paymentData.swift_code || paymentData.swiftCode;
    if (!swiftCode || !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      errors.swiftCode = 'Invalid SWIFT code format';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitize payment data for security
  static sanitizePaymentData(paymentData) {
    const swiftCode = paymentData.swiftCode || paymentData.swift_code || '';
    const currentUser = authService.getCurrentUser();
    
    return {
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency.toUpperCase(),
      recipient: paymentData.recipient.trim(),
      recipient_name: paymentData.recipient.trim(),
      provider: paymentData.provider.trim(),
      swift_code: swiftCode.toUpperCase().replace(/\s+/g, ''), // Remove any spaces
      description: paymentData.description ? paymentData.description.trim() : '',
      user_id: paymentData.userId || paymentData.user_id || currentUser.id,
      user_full_name: currentUser.fullName || 'Unknown User',
      payment_date: new Date().toISOString()
    };
  }

}

export default PaymentService;

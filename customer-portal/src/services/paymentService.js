// Payment Service for API Integration
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  },
  withCredentials: true, // Include cookies for session management
});

class PaymentService {
  // Create a new transaction
  static async createTransaction(transactionData) {
    try {
      const response = await apiClient.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Payment service error:', error);
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
      const response = await apiClient.patch(`/transactions/${transactionId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update transaction error:', error);
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
    
    if (!paymentData.swiftCode || !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(paymentData.swiftCode)) {
      errors.swiftCode = 'Invalid SWIFT code format';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitize payment data for security
  static sanitizePaymentData(paymentData) {
    return {
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency.toUpperCase(),
      recipient: paymentData.recipient.trim(),
      provider: paymentData.provider.trim(),
      swift_code: paymentData.swiftCode.toUpperCase(),
      description: paymentData.description ? paymentData.description.trim() : '',
      user_id: paymentData.userId || 1, // Default user for demo
    };
  }
}

export default PaymentService;

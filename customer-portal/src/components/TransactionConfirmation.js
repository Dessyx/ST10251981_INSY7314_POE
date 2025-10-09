import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TransactionConfirmation.css';
import PaymentService from '../services/paymentService';
import { authService } from '../services/authService';

const TransactionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state?.paymentData;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // If no payment data, redirect back to payment page
  React.useEffect(() => {
    if (!paymentData) {
      navigate('/payment');
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Validate payment data
      const validation = PaymentService.validatePaymentData(paymentData);
      if (!validation.isValid) {
        setError('Invalid payment data. Please check your information.');
        setIsProcessing(false);
        return;
      }

      // Sanitize and prepare data for API
      const currentUserId = authService.getCurrentUserId();
      console.log('Creating transaction for user ID:', currentUserId);
      const sanitizedData = PaymentService.sanitizePaymentData({
        ...paymentData,
        swiftCode: paymentData.swift_code || paymentData.swiftCode, // Handle both property names
        userId: parseInt(currentUserId) || 1 // Convert to integer, fallback to 1 for demo
      });

      // Create transaction in the database (status will be 'pending' by default)
      const createdTransaction = await PaymentService.createTransaction(sanitizedData);

      // Prepare transaction data for success page
      const transactionData = {
        ...createdTransaction,
        transactionId: `TXN${(createdTransaction.transaction_number || 0).toString().padStart(8, '0')}`,
        timestamp: createdTransaction.created_at,
        status: 'pending', // Status is pending until employee review
        recipient: paymentData.recipient,
        provider: paymentData.provider
      };
      
      // Navigate to success page with real transaction data
      navigate('/success', { state: { transactionData } });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleEditPayment = () => {
    navigate('/payment', { state: { editData: paymentData } });
  };

  const handleCancelPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="confirmation-page">
      {/* Simple Header */}
      <header className="simple-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">PayNow</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="confirmation-card">
          {/* Confirmation Icon */}
          <div className="confirmation-icon">
            <div className="shield-icon">🛡️</div>
          </div>
          
          {/* Confirmation Title */}
          <h2 className="confirmation-title">Confirm Your Payment</h2>
          <p className="confirmation-subtitle">Please review your payment details before confirming</p>
          
          {/* Payment Details */}
          <div className="payment-details">
            <h3 className="details-title">Payment Information</h3>
            
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value amount">{paymentData.currency || ''} {parseFloat(paymentData.amount || 0).toFixed(2)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Recipient:</span>
              <span className="detail-value">{paymentData.recipient || ''}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Provider:</span>
              <span className="detail-value">{paymentData.provider || ''}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">SWIFT Code:</span>
              <span className="detail-value">{(paymentData.swift_code || paymentData.swiftCode || '').toUpperCase()}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Payment Date:</span>
              <span className="detail-value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <h4>Secure Transaction</h4>
              <p>Your payment is protected by bank-level encryption and security measures.</p>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="confirmation-error">
              <span className="error-message">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`confirm-button ${isProcessing ? 'processing' : ''}`}
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : 'Confirm Payment'}
            </button>
            
            <div className="secondary-actions">
              <button 
                className="edit-button"
                onClick={handleEditPayment}
              >
                Edit Details
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancelPayment}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025- PayNow All rights reserved</p>
      </footer>
    </div>
  );
};

export default TransactionConfirmation;

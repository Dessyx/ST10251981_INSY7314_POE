import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TransactionConfirmation.css';

const TransactionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state?.paymentData;

  // If no payment data, redirect back to payment page
  React.useEffect(() => {
    if (!paymentData) {
      navigate('/payment');
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

  const handleConfirmPayment = () => {
    // Generate a mock transaction ID
    const transactionId = 'TXN' + Date.now();
    const transactionData = {
      ...paymentData,
      transactionId,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    // Navigate to success page with transaction data
    navigate('/success', { state: { transactionData } });
  };

  const handleEditPayment = () => {
    navigate('/payment', { state: { editData: paymentData } });
  };

  const handleCancelPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="confirmation-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">PayNow</h1>
          </div>
          <div className="header-center">
            <div className="page-navigation">
              <button 
                className="nav-link" 
                onClick={() => navigate('/payment')}
              >
                Payment Page
              </button>
              <button 
                className="nav-link" 
                onClick={() => navigate('/success')}
              >
                Success Page
              </button>
              <button 
                className="nav-link" 
                onClick={() => navigate('/TransactionDashboard')}
              >
                Dashboard
              </button>
              <button 
                className="nav-link" 
                onClick={() => navigate('/TransactionHistory')}
              >
                Transaction History
              </button>
            </div>
          </div>
          <div className="header-right">
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
              <span className="detail-value amount">{paymentData.currency} {parseFloat(paymentData.amount).toFixed(2)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Recipient:</span>
              <span className="detail-value">{paymentData.recipient}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Provider:</span>
              <span className="detail-value">{paymentData.provider}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">SWIFT Code:</span>
              <span className="detail-value">{paymentData.swiftCode.toUpperCase()}</span>
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
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="confirm-button"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
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

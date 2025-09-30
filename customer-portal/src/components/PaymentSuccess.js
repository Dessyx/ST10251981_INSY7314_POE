import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionData = location.state?.transactionData;

  // If no transaction data, redirect back to payment page
  React.useEffect(() => {
    if (!transactionData) {
      navigate('/payment');
    }
  }, [transactionData, navigate]);

  if (!transactionData) {
    return null;
  }

  const handleMakeAnotherPayment = () => {
    navigate('/payment');
  };

  const handleViewHistory = () => {
    navigate('/TransactionHistory');
  };

  return (
    <div className="success-page">
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
        <div className="success-card">
          {/* Success Icon */}
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          {/* Success Message */}
          <h2 className="success-title">Payment Submitted!</h2>
          <p className="success-message">
            Your payment has been submitted and is pending employee review. 
            You will be notified once the transaction is processed.
          </p>
          
          {/* Transaction Details */}
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Transaction Number:</span>
              <span className="detail-value">{transactionData.transactionId || `TXN${transactionData.id}`}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">{transactionData.currency} {parseFloat(transactionData.amount).toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Recipient:</span>
              <span className="detail-value">{transactionData.recipient || transactionData.recipient_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Provider:</span>
              <span className="detail-value">{transactionData.provider}</span>
            </div>
            {transactionData.swift_code && (
              <div className="detail-row">
                <span className="detail-label">SWIFT Code:</span>
                <span className="detail-value">{transactionData.swift_code}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(transactionData.timestamp || transactionData.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value">
                {new Date(transactionData.timestamp || transactionData.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value success-status">{transactionData.status}</span>
            </div>
            {transactionData.description && (
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{transactionData.description}</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={handleViewHistory}
            >
              View Transaction History
            </button>
            <button 
              className="secondary-button"
              onClick={handleMakeAnotherPayment}
            >
              Make Another Payment
            </button>
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

export default PaymentSuccess;

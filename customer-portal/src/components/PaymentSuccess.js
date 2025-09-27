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
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">PayNow</h1>
          </div>
          <div className="header-center">
            <div className="page-navigation">
              <button 
                className={currentPage === 'payment' ? 'nav-active' : 'nav-link'} 
                onClick={() => setCurrentPage('payment')}
              >
                Payment Page
              </button>
              <button 
                className={currentPage === 'success' ? 'nav-active' : 'nav-link'} 
                onClick={() => setCurrentPage('success')}
              >
                Success Page
              </button>
              <button 
                className={currentPage === 'dashboard' ? 'nav-active' : 'nav-link'} 
                onClick={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={currentPage === 'history' ? 'nav-active' : 'nav-link'} 
                onClick={() => setCurrentPage('history')}
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
        <div className="success-card">
          {/* Success Icon */}
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          {/* Success Message */}
          <h2 className="success-title">Payment Successful!</h2>
          
          {/* Transaction Details */}
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Transaction Number:</span>
              <span className="detail-value">{transactionData.transactionId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">{transactionData.currency} {transactionData.amount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Recipient:</span>
              <span className="detail-value">{transactionData.recipient}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Provider:</span>
              <span className="detail-value">{transactionData.provider}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{new Date(transactionData.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value success-status">{transactionData.status}</span>
            </div>
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

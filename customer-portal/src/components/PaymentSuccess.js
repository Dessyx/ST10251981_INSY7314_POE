import React from 'react';
import './PaymentSuccess.css';

const PaymentSuccess = ({ currentPage, setCurrentPage }) => {
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
              <span className="detail-value">#1234532</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">R100.00</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">September 26, 2025</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">Completed</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={() => setCurrentPage('history')}
            >
              View Transaction History
            </button>
            <button 
              className="secondary-button"
              onClick={() => setCurrentPage('payment')}
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

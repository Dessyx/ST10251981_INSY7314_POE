import React from 'react';
import './PaymentPage.css';
import paymentIcon from '../assets/payment-icon.png';

const PaymentPage = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="payment-page">
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
        <div className="payment-card">
          {/* Payment Icon */}
          <div className="payment-icon">
            <img src={paymentIcon} alt="Payment Icon" />
          </div>
          
          {/* Welcome Message */}
          <h2 className="welcome-message">Welcome, User!</h2>
          <p className="welcome-subtitle">Securely make a transaction</p>
          
          {/* Payment Form */}
          <form className="payment-form">
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input type="text" id="amount" name="amount" />
                </div>
                <div className="form-group">
                  <label htmlFor="provider">Provider</label>
                  <input type="text" id="provider" name="provider" />
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <input type="text" id="currency" name="currency" />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient">Recipient</label>
                  <input type="text" id="recipient" name="recipient" />
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="swift-code">SWIFT code</label>
              <input type="text" id="swift-code" name="swiftCode" />
            </div>
            
            <button type="submit" className="paynow-button">PayNow</button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025- PayNow All rights reserved</p>
      </footer>
    </div>
  );
};

export default PaymentPage;

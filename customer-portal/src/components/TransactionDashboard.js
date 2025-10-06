import React, { useState, useEffect } from 'react';
import './TransactionDashboard.css';
import PaymentService from '../services/paymentService';
import { authService } from '../services/authService';

const TransactionDashboard = ({ currentPage, setCurrentPage }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showSubmitAllConfirm, setShowSubmitAllConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions from database
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await PaymentService.getTransactions();
      const transactions = response.transactions || response || [];
      setTransactions(transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setMessage('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
  };

  // Handle verify transaction
  const handleVerify = async (transactionId) => {
    setLoading(true);
    setMessage('');
    try {
      await PaymentService.updateTransactionStatus(transactionId, 'verified');
      setMessage(`Transaction ${transactionId} verified successfully!`);
      await fetchTransactions(); // Refresh transactions
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to verify transaction: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle reject transaction with confirmation
  const handleRejectClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRejectConfirm(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedTransaction) return;
    
    setLoading(true);
    setMessage('');
    setShowRejectConfirm(false);
    
    try {
      await PaymentService.updateTransactionStatus(selectedTransaction.id, 'failed');
      setMessage(`Transaction ${selectedTransaction.id} rejected successfully!`);
      await fetchTransactions(); // Refresh transactions
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to reject transaction: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
      setSelectedTransaction(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectConfirm(false);
    setSelectedTransaction(null);
  };

  // Handle submit to SWIFT
  const handleSubmitToSwift = async (transactionId) => {
    setLoading(true);
    setMessage('');
    try {
      await PaymentService.updateTransactionStatus(transactionId, 'completed');
      setMessage(`Transaction ${transactionId} submitted to SWIFT successfully!`);
      await fetchTransactions(); // Refresh transactions
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to submit transaction: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle submit all to SWIFT with confirmation
  const handleSubmitAllClick = () => {
    const verifiedTransactions = transactions.filter(t => t.status === 'verified');
    if (verifiedTransactions.length === 0) {
      setMessage('No verified transactions to submit.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setShowSubmitAllConfirm(true);
  };

  const handleSubmitAllConfirm = async () => {
    setLoading(true);
    setMessage('');
    setShowSubmitAllConfirm(false);
    
    try {
      const verifiedTransactions = transactions.filter(t => t.status === 'verified');
      const promises = verifiedTransactions.map(t => 
        PaymentService.updateTransactionStatus(t.id, 'completed')
      );
      
      await Promise.all(promises);
      setMessage(`${verifiedTransactions.length} transactions submitted to SWIFT successfully!`);
      await fetchTransactions(); // Refresh transactions
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to submit transactions: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAllCancel = () => {
    setShowSubmitAllConfirm(false);
  };

  // Helper functions to filter transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const verifiedTransactions = transactions.filter(t => t.status === 'verified');

  // Format transaction for display
  const formatTransaction = (transaction) => ({
    id: transaction.id,
    transactionId: `TXN${transaction.id.toString().padStart(6, '0')}`,
    amount: `${transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}`,
    recipient: transaction.user_full_name || transaction.recipient_name || 'Unknown',
    provider: transaction.provider || 'Unknown',
    swiftCode: transaction.swift_code || 'N/A',
    status: transaction.status,
    date: new Date(transaction.created_at).toLocaleDateString()
  });

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">PayNow</h1>
          </div>
          <div className="header-center">
            <h2>Employee Dashboard</h2>
          </div>
          <div className="header-right">
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="page-title">Customer Transactions</h2>
        
        {/* Message Display */}
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="dashboard-container">
          {/* Pending Transactions Section */}
          <div className="pending-section">
            <div className="section-header">
              <div className="status-label pending">Pending ({pendingTransactions.length})</div>
            </div>
            
            <div className="transactions-grid">
              {pendingTransactions.length === 0 ? (
                <div className="no-transactions">
                  <p>No pending transactions</p>
                </div>
              ) : (
                pendingTransactions.map(transaction => {
                  const formatted = formatTransaction(transaction);
                  return (
                    <div key={transaction.id} className="transaction-card">
                      <div className="card-content">
                        <div className="card-left">
                          <div className="detail-item">
                            <span className="detail-label">Recipient:</span>
                            <span className="detail-value">{formatted.recipient}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">{formatted.amount}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">SWIFT Code:</span>
                            <span className="detail-value">{formatted.swiftCode}</span>
                          </div>
                        </div>
                        <div className="card-right">
                          <div className="detail-item">
                            <span className="detail-label">Provider:</span>
                            <span className="detail-value">{formatted.provider}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{formatted.date}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">Pending</span>
                          </div>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button 
                          className="verify-button"
                          onClick={() => handleVerify(transaction.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Verify'}
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleRejectClick(transaction)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Verified Transactions Section */}
          <div className="verified-section">
            <div className="section-header">
              <div className="status-label verified">Verified ({verifiedTransactions.length})</div>
              <button 
                className="submit-all-button"
                onClick={handleSubmitAllClick}
                disabled={loading || verifiedTransactions.length === 0}
              >
                {loading ? 'Processing...' : 'Submit all to SWIFT'}
              </button>
            </div>
            
            <div className="transactions-grid">
              {verifiedTransactions.length === 0 ? (
                <div className="no-transactions">
                  <p>No verified transactions</p>
                </div>
              ) : (
                verifiedTransactions.map(transaction => {
                  const formatted = formatTransaction(transaction);
                  return (
                    <div key={transaction.id} className="transaction-card">
                      <div className="card-content">
                        <div className="card-left">
                          <div className="detail-item">
                            <span className="detail-label">Recipient:</span>
                            <span className="detail-value">{formatted.recipient}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">{formatted.amount}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">SWIFT Code:</span>
                            <span className="detail-value">{formatted.swiftCode}</span>
                          </div>
                        </div>
                        <div className="card-right">
                          <div className="detail-item">
                            <span className="detail-label">Provider:</span>
                            <span className="detail-value">{formatted.provider}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{formatted.date}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">Verified</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-buttons">
                        <button className="verified-status-button">Verified</button>
                        <button 
                          className="submit-button"
                          onClick={() => handleSubmitToSwift(transaction.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Submit to SWIFT'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialogs */}
      {showRejectConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Rejection</h3>
            <p>Are you sure you want to reject this transaction?</p>
            <p><strong>Transaction ID:</strong> {selectedTransaction?.id}</p>
            <p><strong>Amount:</strong> {selectedTransaction && `${selectedTransaction.currency} ${parseFloat(selectedTransaction.amount).toFixed(2)}`}</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleRejectConfirm} disabled={loading}>
                {loading ? 'Processing...' : 'Yes, Reject'}
              </button>
              <button className="cancel-button" onClick={handleRejectCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitAllConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit All to SWIFT</h3>
            <p>Are you sure you want to submit all verified transactions to SWIFT?</p>
            <p><strong>Number of transactions:</strong> {verifiedTransactions.length}</p>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleSubmitAllConfirm} disabled={loading}>
                {loading ? 'Processing...' : 'Yes, Submit All'}
              </button>
              <button className="cancel-button" onClick={handleSubmitAllCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025- PayNow All rights reserved</p>
      </footer>
    </div>
  );
};

export default TransactionDashboard;










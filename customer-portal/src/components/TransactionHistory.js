import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransactionHistory.css';
import PaymentService from '../services/paymentService';

const TransactionHistory = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get transactions for user (defaulting to user ID 1 for demo)
        const response = await PaymentService.getTransactions(1);
        setTransactions(response.transactions || response);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transaction history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions by selected date
  const filteredTransactions = selectedDate 
    ? transactions.filter(transaction => {
        const transactionDate = new Date(transaction.created_at || transaction.timestamp).toISOString().split('T')[0];
        return transactionDate === selectedDate;
      })
    : transactions;

  // Format transaction data for display
  const formatTransaction = (transaction) => ({
    id: `TXN${transaction.id.toString().padStart(6, '0')}`,
    amount: `${transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}`,
    date: new Date(transaction.created_at || transaction.timestamp).toISOString().split('T')[0],
    status: transaction.status || 'Completed',
    recipient: transaction.recipient_name || transaction.recipient || 'Unknown',
    type: 'Payment',
    description: transaction.description || '',
    timestamp: transaction.created_at || transaction.timestamp
  });

  return (
    <div className="transaction-history-page">
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
        <h2 className="page-title">Transaction History</h2>
        
        {/* Action Buttons */}
        <div className="action-section">
          <button 
            className="make-payment-btn"
            onClick={() => navigate('/payment')}
          >
            Make Payment
          </button>
        </div>

        {/* Date Filter */}
        <div className="filter-section">
          <label htmlFor="date-filter" className="filter-label">
            Filter by Date:
          </label>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              className="clear-filter"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Transaction List */}
        <div className="transactions-container">
          <div className="transactions-header">
            <h3>
              {selectedDate 
                ? `Transactions for ${new Date(selectedDate).toLocaleDateString()}`
                : 'All Transactions'
              }
            </h3>
            <span className="transaction-count">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="transactions-list">
            {loading ? (
              <div className="loading-state">
                <p>Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button 
                  className="retry-button"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => {
                const formattedTransaction = formatTransaction(transaction);
                return (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      💳
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-main">
                        <div className="transaction-left">
                          <h4 className="transaction-id">{formattedTransaction.id}</h4>
                          <p className="transaction-recipient">To: {formattedTransaction.recipient}</p>
                          <p className="transaction-date">
                            {new Date(formattedTransaction.timestamp).toLocaleDateString()} at{' '}
                            {new Date(formattedTransaction.timestamp).toLocaleTimeString()}
                          </p>
                          {formattedTransaction.description && (
                            <p className="transaction-description">{formattedTransaction.description}</p>
                          )}
                        </div>
                        <div className="transaction-right">
                          <p className="transaction-amount">{formattedTransaction.amount}</p>
                          <span className={`transaction-status ${formattedTransaction.status.toLowerCase()}`}>
                            {formattedTransaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-transactions">
                <p>No transactions found for the selected date.</p>
              </div>
            )}
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

export default TransactionHistory;

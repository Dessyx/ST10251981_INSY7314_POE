import React, { useState } from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ currentPage, setCurrentPage }) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sample transaction history data
  const transactions = [
    {
      id: '#1234532',
      amount: 'R100.00',
      date: '2025-09-26',
      status: 'Completed',
      recipient: 'John Doe',
      type: 'Payment'
    },
    {
      id: '#1234531',
      amount: 'R250.00',
      date: '2025-09-25',
      status: 'Completed',
      recipient: 'Jane Smith',
      type: 'Payment'
    },
    {
      id: '#1234530',
      amount: 'R75.50',
      date: '2025-09-24',
      status: 'Completed',
      recipient: 'Bob Johnson',
      type: 'Payment'
    },
    {
      id: '#1234529',
      amount: 'R500.00',
      date: '2025-09-23',
      status: 'Completed',
      recipient: 'Alice Brown',
      type: 'Payment'
    },
    {
      id: '#1234528',
      amount: 'R150.25',
      date: '2025-09-22',
      status: 'Completed',
      recipient: 'Charlie Wilson',
      type: 'Payment'
    }
  ];

  // Filter transactions by selected date
  const filteredTransactions = selectedDate 
    ? transactions.filter(transaction => transaction.date === selectedDate)
    : transactions;

  return (
    <div className="transaction-history-page">
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
        <h2 className="page-title">Transaction History</h2>
        
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    💳
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-main">
                      <div className="transaction-left">
                        <h4 className="transaction-id">{transaction.id}</h4>
                        <p className="transaction-recipient">To: {transaction.recipient}</p>
                        <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="transaction-right">
                        <p className="transaction-amount">{transaction.amount}</p>
                        <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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

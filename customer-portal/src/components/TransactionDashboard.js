import React from 'react';
import './TransactionDashboard.css';

const TransactionDashboard = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="dashboard-page">
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
        <h2 className="page-title">Customer Transactions</h2>
        <div className="dashboard-container">
          {/* Pending Transactions Section */}
          <div className="pending-section">
            <div className="section-header">
              <div className="status-label pending">Pending</div>
            </div>
            
            <div className="transactions-grid">
              {/* Transaction Card 1 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Pending</span>
                    </div>
                  </div>
                </div>
                <button className="verify-button">Verify</button>
              </div>

              {/* Transaction Card 2 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Pending</span>
                    </div>
                  </div>
                </div>
                <button className="verify-button">Verify</button>
              </div>

              {/* Transaction Card 3 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Pending</span>
                    </div>
                  </div>
                </div>
                <button className="verify-button">Verify</button>
              </div>

              {/* Transaction Card 4 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Pending</span>
                    </div>
                  </div>
                </div>
                <button className="verify-button">Verify</button>
              </div>
            </div>
          </div>

          {/* Verified Transactions Section */}
          <div className="verified-section">
            <div className="section-header">
              <div className="status-label verified">Verified</div>
              <button className="submit-all-button">Submit all to SWIFT</button>
            </div>
            
            <div className="transactions-grid">
              {/* Verified Transaction Card 1 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="card-buttons">
                  <button className="verified-status-button">Verified</button>
                  <button className="submit-button">Submit to SWIFT</button>
                </div>
              </div>

              {/* Verified Transaction Card 2 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="card-buttons">
                  <button className="verified-status-button">Verified</button>
                  <button className="submit-button">Submit to SWIFT</button>
                </div>
              </div>

              {/* Verified Transaction Card 3 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="card-buttons">
                  <button className="verified-status-button">Verified</button>
                  <button className="submit-button">Submit to SWIFT</button>
                </div>
              </div>

              {/* Verified Transaction Card 4 */}
              <div className="transaction-card">
                <div className="card-content">
                  <div className="card-left">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">John Doe</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">R100.00</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SWIFT Code:</span>
                      <span className="detail-value">09374913</span>
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">...8074</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">ZAR</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="card-buttons">
                  <button className="verified-status-button">Verified</button>
                  <button className="submit-button">Submit to SWIFT</button>
                </div>
              </div>
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

export default TransactionDashboard;

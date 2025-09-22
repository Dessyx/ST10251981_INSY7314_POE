import React, { useState } from 'react';
import './App.css';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import TransactionDashboard from './components/TransactionDashboard';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const [currentPage, setCurrentPage] = useState('payment');

  const renderPage = () => {
    switch (currentPage) {
      case 'payment':
        return <PaymentPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'success':
        return <PaymentSuccess currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <TransactionDashboard currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'history':
        return <TransactionHistory currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      default:
        return <PaymentPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;

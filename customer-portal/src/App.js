<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
>>>>>>> Auth-API
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
<<<<<<< HEAD
    <div className="App">
      {renderPage()}
    </div>
=======
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
>>>>>>> Auth-API
  );
}

export default App;

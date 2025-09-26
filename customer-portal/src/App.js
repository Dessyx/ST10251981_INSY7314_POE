import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './App.css';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import TransactionDashboard from './components/TransactionDashboard';
import TransactionHistory from './components/TransactionHistory';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<TransactionDashboard />} />
          <Route path="/history" element={<TransactionHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './App.css';
import PaymentPage from './components/PaymentPage';
import TransactionConfirmation from './components/TransactionConfirmation';
import PaymentSuccess from './components/PaymentSuccess';
import TransactionDashboard from './components/TransactionDashboard';
import TransactionHistory from './components/TransactionHistory';
import ProtectedRoute from './components/ProtectedRoute';
import { SecurityProvider } from './components/SecurityProvider';
import SessionTimeoutWarning from './components/SessionTimeoutWarning';

function App() {

  return (
    <SecurityProvider>
      <Router>
        <div className="App">
          <SessionTimeoutWarning />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<TransactionConfirmation />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/TransactionDashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <TransactionDashboard />
              </ProtectedRoute>
            } />
            <Route path="/TransactionHistory" element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </SecurityProvider>
  );
}

export default App;

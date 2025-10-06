import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requireEmployee = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isEmployee = authService.isEmployee();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireEmployee && !isEmployee) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

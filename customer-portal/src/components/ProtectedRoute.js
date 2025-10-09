import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requireEmployee = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const canAccessDashboard = authService.canAccessDashboard();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireEmployee && !canAccessDashboard) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

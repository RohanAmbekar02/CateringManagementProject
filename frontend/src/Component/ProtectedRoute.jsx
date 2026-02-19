import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

// Wraps around any element that requires authentication
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

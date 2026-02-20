import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is logged in
  const user = localStorage.getItem('user');
  
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    // Redirect to chatify if already logged in
    return <Navigate to="/chatify" replace />;
  }

  // If trying to access login/register, redirect to GetStarted
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;


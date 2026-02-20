import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const PublicRoute = () => {
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

  // Render the nested routes via Outlet
  return <Outlet />;
};

export default PublicRoute;


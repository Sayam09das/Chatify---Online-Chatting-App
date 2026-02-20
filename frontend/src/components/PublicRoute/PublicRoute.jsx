import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const location = useLocation();
  
  // Check if user is logged in - only check localStorage user
  // Backend uses HTTP-only cookies for token authentication
  const user = localStorage.getItem('user');
  
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    // Redirect to chatify if already logged in
    return <Navigate to="/chatify" replace />;
  }

  // Allow access to login and register pages for unauthenticated users
  // Render the nested routes via Outlet
  return <Outlet />;
};

export default PublicRoute;


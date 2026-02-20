import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const location = useLocation();
  
  // Check if user is logged in - check both localStorage items
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  const isAuthenticated = !!(user && token);

  if (isAuthenticated) {
    // Redirect to chatify if already logged in
    return <Navigate to="/chatify" replace />;
  }

  // Allow access to login and register pages for unauthenticated users
  // Render the nested routes via Outlet
  return <Outlet />;
};

export default PublicRoute;


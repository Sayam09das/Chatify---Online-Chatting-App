import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  
  // Check if user is logged in - check both localStorage items
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  // Both user and token must exist for authentication
  const isAuthenticated = !!(user && token);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the nested routes via Outlet
  return <Outlet />;
};

export default ProtectedRoute;


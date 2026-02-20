import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  
  // Check if user is logged in - only check localStorage user
  // Backend uses HTTP-only cookies for token authentication
  const user = localStorage.getItem('user');
  
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the nested routes via Outlet
  return <Outlet />;
};

export default ProtectedRoute;


import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  
  // Check if user is logged in - check both localStorage and cookies
  const user = localStorage.getItem('user');
  
  // For cookie-based auth, we check if user data exists
  // The backend uses HTTP-only cookies, so we rely on user data being stored
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the nested routes via Outlet
  return <Outlet />;
};

export default ProtectedRoute;


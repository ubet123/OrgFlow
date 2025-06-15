import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  // If not logged in, redirect to login with return location
  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but trying to access wrong dashboard
  const isManagerPath = location.pathname.includes('manager-dashboard');
  const isEmployeePath = location.pathname.includes('employee-dashboard');
  
  if ((userData.role === 'manager' && isEmployeePath) || 
      (userData.role !== 'manager' && isManagerPath)) {
    const correctPath = userData.role === 'manager' 
      ? '/manager-dashboard' 
      : '/employee-dashboard';
    return <Navigate to={correctPath} replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoutes;
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoutes = () => {
  const location = useLocation();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/check-auth', {
          withCredentials: true
        });
        setUserData(response.data.user);
      } catch (error) {
        setUserData(null);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [location]);

  if (!authChecked) {
    // Show loading state while checking auth
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>;
  }

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
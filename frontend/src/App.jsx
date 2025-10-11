import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDash from "./pages/ManagerDash";
import EmployeeDash from "./pages/EmployeeDash";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateEmployee from './pages/CreateEmployee';
import AdminEmpTasks from './components/AdminEmpTasks';
import { ThemeProvider } from './context/themeContext';
import Analytics from './components/charts/Analytics';
import axios from 'axios';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

 useEffect(() => {
  const checkAuth = async () => {
    try {
      console.log('Checking cookies:', document.cookie); // Add this line
      console.log('Making request to:', `${API_URL}/auth/check-auth`);
      
      const response = await axios.get(`${API_URL}/auth/check-auth`, {
        withCredentials: true
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error.response?.data || error.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, [authChecked, API_URL]);

  if (loading) {
    return <LoadingScreen/>
  }

  return (
    <>
      <ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              userData ? 
                <Navigate to={userData.role === 'manager' ? '/manager-dashboard' : '/employee-dashboard'} replace /> 
                : <Login onLogin={() => setAuthChecked(prev => !prev)} />
            } 
          />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoutes userData={userData} />}>
            <Route path="/manager-dashboard" element={<ManagerDash onLogout={() => setAuthChecked(prev => !prev)} userData={userData} />} />
            <Route path="/manager-dashboard/create-employee" element={<CreateEmployee />} />
            <Route path="/manager-dashboard/employee-tasks/:id" element={<AdminEmpTasks/>} />
            <Route path="/employee-dashboard" element={<EmployeeDash onLogout={() => setAuthChecked(prev => !prev)} userData={userData} />} />
          </Route>
          
          {/* Redirect to login by default */}
          <Route path="*" element={
            <Navigate to={
              userData ? 
                (userData.role === 'manager' ? '/manager-dashboard' : '/employee-dashboard') 
                : '/login'
            } replace />
          } />
        </Routes>
      </BrowserRouter>
    
      </ThemeProvider>
    </>
  );
}

export default App;
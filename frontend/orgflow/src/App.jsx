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

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check auth status whenever the component mounts or authChecked changes
    const data = JSON.parse(localStorage.getItem('userData') || null);
    setUserData(data);
  }, [authChecked]);

  return (
    <>
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
        {!userData && (
          <Route path="/login" element={<Login onLogin={() => setAuthChecked(prev => !prev)} />} />
        )}
        
        {/* Protected routes */}
        <Route element={<ProtectedRoutes authChecked={authChecked} />}>
        
        
    <Route path="/manager-dashboard" element={<ManagerDash onLogout={() => setAuthChecked(prev => !prev)} />} />
  <Route path="/manager-dashboard/create-employee" element={<CreateEmployee />} />
  <Route path="/manager-dashboard/employee-tasks/:id" element={<AdminEmpTasks/>} />
          <Route path="/employee-dashboard" element={<EmployeeDash onLogout={() => setAuthChecked(prev => !prev)} />} />
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
    </>
  );
}

export default App;
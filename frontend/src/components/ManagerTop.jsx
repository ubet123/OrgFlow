import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import SunAnimation from './SunAnimation';
import Afternoon from './Afternoon';
import Evening from './Evening';
import { useTheme } from '../context/themeContext';
import Switch from './Switch';

const ManagerTop = ({ onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


  //For the Good Morning, Afternoon, Evening
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return (
        <>
          <SunAnimation />
          <span>Good Morning</span>
        </>
      );
    }
    
    if (hour < 17) {
      return (
        <>
          <Afternoon/>
          <span>Good Afternoon</span>
        </>
      );
    }
    
    return (
      <>
        <Evening/>
        <span>Good Evening</span>
      </>
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Custom styles for theme
  const headerStyles = theme === 'dark' 
    ? 'bg-neutral-900/80 border-neutral-700' 
    : 'bg-neutral-100/80 border-neutral-300';
  
  const iconContainerStyles = theme === 'dark' 
    ? 'bg-emerald-800/30 border-emerald-700/50' 
    : 'bg-emerald-100 border-emerald-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const createEmployeeBtnStyles = theme === 'dark' 
    ? 'bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 border-emerald-400/30 hover:border-emerald-400/50 shadow-emerald-500/10 hover:shadow-emerald-500/20' 
    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300 hover:border-emerald-400 shadow-emerald-500/20 hover:shadow-emerald-500/30';

  return (
    <header className={`${headerStyles} backdrop-blur-sm border-b p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 space-y-4 sm:space-y-0`}>
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-3">
          <div className={`${iconContainerStyles} p-2 rounded-lg border`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 sm:h-6 sm:w-6 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight flex flex-row gap-1 justify-center items-center ${textColor}`}>
            {getGreeting()}, <span className={`${accentColor} font-extrabold text-2xl sm:text-3xl`}> Manager</span>
          </h1>
        </div>
        
      </div>
      
      <div className="flex flex-col items-center sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">

<div className='mr-12'
title='Toggle Theme'>
<Switch checked={theme === 'light'}
      onChange={toggleTheme}
    />

</div>
   

        <button
          onClick={() => navigate('/manager-dashboard/create-employee')}
          className={`${createEmployeeBtnStyles} px-5 py-2.5 rounded-lg border hover:border transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${accentColor}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          <span className="text-sm sm:text-base font-medium">Employee Management</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default ManagerTop;
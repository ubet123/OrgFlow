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

  // For the Good Morning, Afternoon, Evening
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
    <header className={`${headerStyles} backdrop-blur-sm border-b p-4 lg:p-6 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center sticky top-0 z-10`}>
      {/* Left Section - Greeting */}
      <div className="flex items-center justify-between w-full lg:w-auto lg:justify-start">
        <div className="flex items-center space-x-3">
          <div className={`${iconContainerStyles} p-2 rounded-lg border`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 lg:h-6 lg:w-6 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight flex items-center gap-1 ${textColor}`}>
              {getGreeting()},
            </h1>
            <span className={`${accentColor} font-extrabold sm:ml-2 text-2xl ml-14 sm:text-2xl lg:text-3xl`}>
              Manager
            </span>
          </div>
        </div>
        
        {/* Theme Toggle - Mobile */}
        <div className="lg:hidden" title="Toggle Theme">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        {/* Theme Toggle - Desktop */}
        <div className="hidden lg:flex mr-4" title="Toggle Theme">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        {/* Employee Management Button */}
        <button
          onClick={() => navigate('/manager-dashboard/create-employee')}
          className={`${createEmployeeBtnStyles} px-4 py-3 sm:px-5 sm:py-2.5 rounded-lg border hover:border transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow text-sm sm:text-base font-medium`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" 
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
          <span className="whitespace-nowrap">Employee Management</span>
        </button>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default ManagerTop;
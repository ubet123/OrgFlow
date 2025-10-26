import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunAnimation from './SunAnimation';
import Afternoon from './Afternoon';
import Evening from './Evening';
import { useTheme } from '../context/themeContext';
import Switch from './Switch';

const EmployeeHeader = ({ onLogout, employee }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
   
  // Theme-based styles
  const headerStyles = theme === 'dark' 
    ? 'bg-neutral-900/80 border-neutral-700' 
    : 'bg-neutral-100/80 border-neutral-300';
  
  const iconContainerStyles = theme === 'dark' 
    ? 'bg-emerald-800/30 border-emerald-700/50' 
    : 'bg-emerald-100/80 border-emerald-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return (
        <div className='flex flex-row justify-center items-center gap-1'>
          <SunAnimation />
          <span className={`${textColor} -ml-2 sm:ml-1 sm:text-2xl text-lg`}>Good Morning</span>
        </div>
      );
    }
    
    if (hour < 17) {
      return (
        <div className='flex flex-row justify-center items-center gap-1'>
          <Afternoon/>
          <span className={`${textColor} -ml-2 sm:ml-1 sm:text-2xl text-lg`}>Good Afternoon</span>
        </div>
      );
    }
    
    return (
      <div className='flex flex-row justify-center items-center gap-1'>
        <Evening/>
        <span className={`${textColor} -ml-2 sm:ml-1 sm:text-2xl text-lg`}>Good Evening</span>
      </div>
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

  return (
    <header className={`${headerStyles} backdrop-blur-sm border-b p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 gap-3 sm:gap-4 md:gap-0`}>
      {/* Left Section - Greeting and Employee Name */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`${iconContainerStyles} p-1.5 sm:p-2 rounded-lg border`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1">
              {getGreeting()}
              <span className={textColor}>,</span>
            </div>
            <span className={`${accentColor} font-extrabold sm:ml-1 text-xl ml-[54px] -mt-4 sm:mt-0 sm:text-2xl lg:text-3xl`}>
              {employee?.name}
            </span>
          </div>
        </div>

        {/* Theme Toggle - Mobile */}
        <div className="sm:hidden" title="Toggle Theme">
          <Switch
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
      </div>

      {/* Right Section - Theme Toggle and Logout */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 md:gap-6">
        {/* Theme Toggle - Desktop */}
        <div className="hidden sm:flex" title="Toggle Theme">
          <Switch
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto text-sm sm:text-base"
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

export default EmployeeHeader;
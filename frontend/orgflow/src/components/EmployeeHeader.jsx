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
        <div className='flex flex-row justify-center items-center'>
          <SunAnimation />
          <span className={textColor}>Good Morning</span>
        </div>
      );
    }
    
    if (hour < 17) {
      return (
        <div className='flex flex-row justify-center items-center'>
          <Afternoon/>
          <span className={textColor}>Good Afternoon</span>
        </div>
      );
    }
    
    return (
      <div className='flex flex-row justify-center items-center'>
        <Evening/>
        <span className={textColor}>Good Evening</span>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, {
        withCredentials: true
      });
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`${headerStyles} backdrop-blur-sm border-b p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 gap-3 sm:gap-0`}>
      <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`${iconContainerStyles} p-1 sm:p-2 rounded-lg border`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 sm:h-6 sm:w-6 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold flex flex-col sm:flex-row gap-2 justify-center items-center tracking-tight ${textColor}`}>
            <div className='flex flex-row justify-center items-center'>
              {getGreeting()} 
              <span>,</span>
            </div>  
            <span className={`${accentColor} font-extrabold text-2xl sm:text-3xl`}>
              {employee?.name}
            </span>
          </h1>
        </div>
      </div>

      <div className='flex flex-row justify-center items-center'>
        <div className='mr-3 sm:mr-6 md:mr-12'>
          <Switch
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        <div className="flex justify-end w-full sm:w-auto">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
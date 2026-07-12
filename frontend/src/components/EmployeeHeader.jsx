import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunAnimation from './SunAnimation';
import Afternoon from './Afternoon';
import Evening from './Evening';
import { useTheme } from '../context/themeContext';
import Switch from './Switch';
import { IoChatbubblesOutline } from "react-icons/io5";


const EmployeeHeader = ({ onLogout, employee }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
   
  // Theme-based styles
  const headerStyles = theme === 'dark' 
    ? 'bg-neutral-950/70 border-neutral-800/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)]' 
    : 'bg-white/70 border-neutral-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]';
  
  const iconContainerStyles = theme === 'dark' 
    ? 'bg-emerald-950/30 border-emerald-800/30 text-emerald-400' 
    : 'bg-emerald-50/80 border-emerald-200/50 text-emerald-600';
  
  const textColor = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-700';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const chatButtonStyles = theme === 'dark'
    ? 'bg-neutral-800/50 border-neutral-700/40 hover:border-neutral-600/50 hover:bg-neutral-800/70 text-neutral-300 active:scale-[0.97]'
    : 'bg-white/80 border-neutral-200/60 hover:border-neutral-300/60 hover:bg-neutral-50 text-neutral-600 active:scale-[0.97]';

  const logoutBtnStyles = theme === 'dark'
    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/30 active:scale-[0.97]'
    : 'bg-red-50 hover:bg-red-100/80 text-red-600 border-red-200/60 hover:border-red-300/60 active:scale-[0.97]';

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
          <Afternoon />
          <span>Good Afternoon</span>
        </>
      );
    }
    
    return (
      <>
        <Evening />
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

  return (
    <header className={`${headerStyles} backdrop-blur-xl border-b px-4 py-3.5 sm:py-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 transition-all duration-300 gap-3 sm:gap-0`}>
      {/* Left Section - Greeting and Employee Name */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`${iconContainerStyles} p-2 rounded-xl border flex-shrink-0 items-center justify-center hidden sm:flex`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-x-2 sm:ml-3 min-w-0">
            <div className={`text-sm sm:text-base lg:text-lg font-medium tracking-tight flex items-center gap-1.5 min-w-0 ${textColor}`}>
              {getGreeting()}
              <span className="hidden sm:inline opacity-50">,</span>
            </div>
            <span className={`${accentColor} font-bold text-base sm:text-lg lg:text-xl leading-none`}>
              {employee?.name}
            </span>
          </div>
        </div>

        {/* Theme Toggle - Mobile */}
        <div className="sm:hidden flex items-center" title="Toggle Theme">
          <Switch
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
      </div>

      {/* Right Section - Theme Toggle and Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2.5 sm:gap-3">
        {/* Theme Toggle - Desktop */}
        <div className="hidden sm:flex items-center mr-2" title="Toggle Theme">
          <Switch
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        {/* Chat Button */}
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className={`border px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto ${chatButtonStyles}`}
          aria-label="Open chat"
        >
          <IoChatbubblesOutline className="h-4 w-4" />
          <span className="whitespace-nowrap">Chat</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`${logoutBtnStyles} px-4 py-2 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default EmployeeHeader;
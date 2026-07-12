import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import SunAnimation from './SunAnimation';
import Afternoon from './Afternoon';
import Evening from './Evening';
import { useTheme } from '../context/themeContext';
import Switch from './Switch';
import { IoChatbubblesOutline } from "react-icons/io5";

const ManagerTop = ({ onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // For the Good Morning, Afternoon, Evening
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return (
        <> 
          <SunAnimation />
          <span className='ml-0.5'>Good Morning</span>
        </>
      );
    }
    
    if (hour < 17) {
      return (
        <>
          <Afternoon/>
          <span className='ml-0.5'>Good Afternoon</span>
        </>
      );
    }
    
    return (
      <>
        <Evening/>
        <span className='ml-0.5'>Good Evening</span>
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
    ? 'bg-neutral-950/70 border-neutral-800/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)]' 
    : 'bg-white/70 border-neutral-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]';
  
  const iconContainerStyles = theme === 'dark' 
    ? 'bg-emerald-950/30 border-emerald-800/30 text-emerald-400' 
    : 'bg-emerald-50/80 border-emerald-200/50 text-emerald-600';
  
  const textColor = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-700';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const createEmployeeBtnStyles = theme === 'dark' 
    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30 active:scale-[0.97]' 
    : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-200/60 hover:border-emerald-300/60 active:scale-[0.97]';
  
  const chatButtonStyles = theme === 'dark'
    ? 'bg-neutral-800/50 border-neutral-700/40 hover:border-neutral-600/50 hover:bg-neutral-800/70 text-neutral-300 active:scale-[0.97]'
    : 'bg-white/80 border-neutral-200/60 hover:border-neutral-300/60 hover:bg-neutral-50 text-neutral-600 active:scale-[0.97]';

  const logoutBtnStyles = theme === 'dark'
    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/30 active:scale-[0.97]'
    : 'bg-red-50 hover:bg-red-100/80 text-red-600 border-red-200/60 hover:border-red-300/60 active:scale-[0.97]';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const menuItemBase = theme === 'dark'
    ? 'hover:bg-neutral-800/60 text-neutral-300'
    : 'hover:bg-neutral-50 text-neutral-600';

  return (
    <header className={`${headerStyles} backdrop-blur-xl border-b px-4 py-3.5 sm:py-4 lg:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300`}>
      {/* Left Section - Greeting */}
      <div className="flex items-center min-w-0">
        <div className={`${iconContainerStyles} p-2 rounded-xl border flex-shrink-0 hidden sm:flex items-center justify-center`}>
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
            Manager
          </span>
        </div>
      </div>

      {/* Right Section - Desktop Actions */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="mr-2 flex items-center" title="Toggle Theme">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        <button
          onClick={() => navigate('/manager-dashboard/create-employee')}
          className={`${createEmployeeBtnStyles} px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 text-sm font-medium`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="whitespace-nowrap">Employee Management</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/chat')}
          className={`border px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium ${chatButtonStyles}`}
          aria-label="Open chat"
        >
          <IoChatbubblesOutline className="h-4 w-4" />
          <span className="whitespace-nowrap">Chat</span>
        </button>

        <button
          onClick={handleLogout}
          className={`${logoutBtnStyles} px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 text-sm font-medium`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>

      {/* Mobile - Theme Toggle + Hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <div title="Toggle Theme" className="flex items-center">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'border-neutral-700/40 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800/70' : 'border-neutral-200/60 bg-white/80 text-neutral-600 hover:bg-neutral-50'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl overflow-hidden backdrop-blur-xl transition-all duration-300 animate-fade-in ${theme === 'dark' ? 'bg-neutral-900/95 border-neutral-800/60' : 'bg-white/95 border-neutral-200/60'}`}>
              <button
                onClick={() => { navigate('/manager-dashboard/create-employee'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-colors duration-200 ${menuItemBase}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Employee Management
              </button>

              <button
                onClick={() => { navigate('/chat'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-colors duration-200 ${menuItemBase}`}
              >
                <IoChatbubblesOutline className="h-4 w-4 text-emerald-500" />
                Chat
              </button>

              <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-neutral-800/60' : 'bg-neutral-100'}`} />

              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ManagerTop;
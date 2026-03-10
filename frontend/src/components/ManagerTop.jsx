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
  const chatButtonStyles = theme === 'dark'
    ? 'bg-neutral-800/80 border-neutral-700 text-emerald-300 hover:bg-neutral-700/80'
    : 'bg-white border-neutral-200 text-emerald-700 hover:bg-emerald-50';

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
    ? 'hover:bg-neutral-700/60 text-neutral-200'
    : 'hover:bg-neutral-100 text-neutral-700';

  return (
    <header className={`${headerStyles} backdrop-blur-sm border-b p-4 lg:p-6 flex items-center justify-between sticky top-0 z-10`}>
      {/* Left Section - Greeting */}
      <div className="flex items-center min-w-0">
        <div className={`${iconContainerStyles} p-2 rounded-lg border flex-shrink-0 hidden sm:flex`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 lg:h-6 lg:w-6 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex items-center flex-wrap gap-x-1.5 sm:ml-3">
          <h1 className={`text-base sm:text-xl lg:text-2xl font-bold tracking-tight flex items-center gap-1 whitespace-nowrap ${textColor}`}>
            {getGreeting()},
          </h1>
          <span className={`${accentColor} font-extrabold text-xl sm:text-2xl lg:text-3xl sm:ml-0 ml-[4rem] leading-none whitespace-nowrap`}>
            Manager
          </span>
        </div>
      </div>

      {/* Right Section - Desktop Actions */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="mr-4" title="Toggle Theme">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>

        <button
          onClick={() => navigate('/manager-dashboard/create-employee')}
          className={`${createEmployeeBtnStyles} px-5 py-2.5 rounded-lg border transition-colors flex items-center gap-2 shadow-sm hover:shadow text-base font-medium`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="whitespace-nowrap">Employee Management</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/chat')}
          className={`border px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-base ${chatButtonStyles}`}
          aria-label="Open chat"
        >
          <IoChatbubblesOutline className={`h-5 w-5 flex-shrink-0 ${accentColor}`} />
          <span className="whitespace-nowrap">Chat</span>
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>

      {/* Mobile - Theme Toggle + Hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <div title="Toggle Theme">
          <Switch 
            checked={theme === 'light'}
            onChange={toggleTheme}
          />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
              <button
                onClick={() => { navigate('/manager-dashboard/create-employee'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-colors ${menuItemBase}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 flex-shrink-0 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Employee Management
              </button>

              <button
                onClick={() => { navigate('/chat'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-colors ${menuItemBase}`}
              >
                <IoChatbubblesOutline className={`h-4 w-4 flex-shrink-0 ${accentColor}`} />
                Chat
              </button>

              <div className={`h-px ${theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'}`} />

              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
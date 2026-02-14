import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import Search from './Search';
import User from './User';
import useAuth from '../../statemanagement/useAuth';

export default function Left() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || '';
  const loadingRole = !user;
  const [searchTerm, setSearchTerm] = useState('');

  const containerStyles = theme === 'dark'
    ? 'bg-black text-white border-white'
    : 'bg-white text-neutral-900 border-neutral-200';
  const dividerStyles = theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200';
  const backButtonStyles = theme === 'dark'
    ? 'text-emerald-300 bg-neutral-900/70 border border-emerald-400/20 hover:bg-neutral-800'
    : 'text-emerald-700 bg-white border border-emerald-200 hover:bg-neutral-100';
  const backButtonText = loadingRole ? 'Loading...' : 'Back to Dashboard';

  const handleBackToDashboard = () => {
    const targetPath = userRole === 'manager' ? '/manager-dashboard' : '/employee-dashboard';
    navigate(targetPath);
  };

  return (
    <>
   
    <div className={`w-[30%]  overflow-auto custom-scrollbar ${containerStyles}`}>
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={handleBackToDashboard}
            disabled={loadingRole}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${backButtonStyles} ${loadingRole ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>{backButtonText}</span>
          </button>
        </div>
         <h1 className="font-bold text-3xl px-3 mb-3 mt-7">My Chats</h1>
       <Search value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
       <hr className={`mb-3 mt-2 border-t ${dividerStyles}`} />
       <User searchTerm={searchTerm} userRole={userRole} />
    </div>
    </>
  );

}
 
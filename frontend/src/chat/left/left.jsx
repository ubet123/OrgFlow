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
    ? 'bg-neutral-950/80 text-white border-neutral-800/80 shadow-xl shadow-emerald-900/10'
    : 'bg-white/90 text-neutral-900 border-neutral-200 shadow-lg shadow-emerald-200/40';
  const headerStyles = theme === 'dark' ? 'bg-neutral-950/80' : 'bg-white/90';
  const dividerStyles = theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200';
  const backButtonStyles = theme === 'dark'
    ? 'text-emerald-200 bg-neutral-900/60 border border-emerald-400/20 hover:bg-neutral-800/80'
    : 'text-emerald-700 bg-white border border-emerald-200 hover:bg-neutral-100';
  const subtitleStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const backButtonText = loadingRole ? 'Loading...' : 'Back to Dashboard';

  const handleBackToDashboard = () => {
    const targetPath = userRole === 'manager' ? '/manager-dashboard' : '/employee-dashboard';
    navigate(targetPath);
  };

  return (
    <>
   
    <div className={`w-full md:flex-none md:basis-[34%] lg:basis-[30%] xl:basis-[28%] md:min-w-[320px] h-full rounded-2xl border overflow-hidden backdrop-blur flex flex-col ${containerStyles}`}>
      <div className={`sticky top-0 z-10 ${headerStyles}`}>
        <div className="px-4 pt-4">
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
        <div className="px-4 pt-6">
          <p className={`text-xs uppercase tracking-[0.2em] ${subtitleStyles}`}>Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold">My Chats</h1>
        </div>
        <div className="px-4 py-4">
          <Search value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
        <hr className={`border-t ${dividerStyles}`} />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <User searchTerm={searchTerm} userRole={userRole} />
      </div>
    </div>
    </>
  );

}
 
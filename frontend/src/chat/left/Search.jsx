import React from 'react';
import { useTheme } from '../../context/themeContext';

const Search = ({ value, onChange }) => {
  const { theme } = useTheme();

  const searchInputStyles = theme === 'dark'
    ? 'bg-neutral-800 border-neutral-700 text-neutral-200 placeholder-neutral-500'
    : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-500';

  const iconColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className="px-3 py-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search chats..."
          aria-label="Search chats"
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 pl-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${searchInputStyles}`}
        />
        <svg
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Search;
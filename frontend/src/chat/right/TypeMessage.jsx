import React from 'react';
import { useTheme } from '../../context/themeContext';
import { IoSend } from "react-icons/io5";
const TypeMessage = ({ className = '' }) => {
  const { theme } = useTheme();

  const wrapperStyles = theme === 'dark'
    ? 'bg-neutral-950 border-neutral-800'
    : 'bg-white border-neutral-200';
  const inputStyles = theme === 'dark'
    ? 'bg-neutral-900 text-white placeholder-neutral-500 border-neutral-800'
    : 'bg-neutral-50 text-neutral-900 placeholder-neutral-500 border-neutral-200';
  const buttonStyles = theme === 'dark'
    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
    : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  return (
    <div className={`border-t px-4 py-3 ${wrapperStyles} ${className}`}>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className={`flex-1 rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputStyles}`}
        />
        <button
          type="button"
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${buttonStyles}`}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default TypeMessage;
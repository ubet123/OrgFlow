import React, { useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { IoSend } from "react-icons/io5";
import useSendMessage from '../../hooks/useSendMessage';
const TypeMessage = ({ className = '' }) => {
  const { theme } = useTheme();
  const { sendMessage, loading } = useSendMessage();
  const [messageText, setMessageText] = useState('');

  const wrapperStyles = theme === 'dark'
    ? 'bg-neutral-950/80 border-neutral-800/80'
    : 'bg-white/80 border-neutral-200';
  const inputStyles = theme === 'dark'
    ? 'bg-neutral-900/80 text-white placeholder-neutral-500 border-neutral-800'
    : 'bg-neutral-50 text-neutral-900 placeholder-neutral-500 border-neutral-200';
  const buttonStyles = theme === 'dark'
    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
    : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) {
      return;
    }
    await sendMessage(trimmed);
    setMessageText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`border-t px-5 py-4 ${wrapperStyles} ${className}`}>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputStyles}`}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          aria-busy={loading}
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${buttonStyles} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <IoSend size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default TypeMessage;
import React, { useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { IoSend } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import useSendMessage from '../../hooks/useSendMessage';
import TaskRefPicker from './TaskRefPicker';

const TypeMessage = ({ className = '' }) => {
  const { theme } = useTheme();
  const { sendMessage, loading } = useSendMessage();
  const [messageText, setMessageText] = useState('');
  const [pendingTaskRef, setPendingTaskRef] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const wrapperStyles = theme === 'dark'
    ? 'bg-neutral-950/80 border-neutral-800/80'
    : 'bg-white/80 border-neutral-200';
  const inputStyles = theme === 'dark'
    ? 'bg-neutral-900/80 text-white placeholder-neutral-500 border-neutral-800'
    : 'bg-neutral-50 text-neutral-900 placeholder-neutral-500 border-neutral-200';
  const buttonStyles = theme === 'dark'
    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
    : 'bg-emerald-600 hover:bg-emerald-700 text-white';
  const atButtonStyles = theme === 'dark'
    ? 'text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800'
    : 'text-neutral-500 hover:text-emerald-600 hover:bg-neutral-100';
  const chipStyles = theme === 'dark'
    ? 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300'
    : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  const chipCloseStyles = theme === 'dark'
    ? 'text-emerald-500 hover:text-emerald-300'
    : 'text-emerald-500 hover:text-emerald-700';

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) {
      return;
    }
    await sendMessage(trimmed, pendingTaskRef);
    setMessageText('');
    setPendingTaskRef(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`border-t px-5 py-4 ${wrapperStyles} ${className}`}>
      {/* Task ref chip */}
      {pendingTaskRef && (
        <div className={`flex items-center gap-2 mb-2.5 px-3 py-1.5 rounded-xl border w-fit max-w-full ${chipStyles}`}>
          <span className="text-xs font-mono font-semibold truncate">@ {pendingTaskRef.taskId}</span>
          {pendingTaskRef.title && (
            <span className="text-xs truncate max-w-[160px] opacity-75">· {pendingTaskRef.title}</span>
          )}
          <button
            type="button"
            onClick={() => setPendingTaskRef(null)}
            className={`shrink-0 transition-colors ${chipCloseStyles}`}
            aria-label="Remove task reference"
          >
            <IoClose size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* @ button */}
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          title="Reference a task"
          className={`rounded-xl p-2 transition-colors ${atButtonStyles}`}
        >
          <MdAlternateEmail size={20} />
        </button>

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

      {showPicker && (
        <TaskRefPicker
          onSelect={(ref) => setPendingTaskRef(ref)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

export default TypeMessage;
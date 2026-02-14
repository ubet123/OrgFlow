import React from 'react';
import { useTheme } from '../../context/themeContext';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../statemanagement/useAuth';
import { useSocket } from '../../context/socketContext';

const ChatUser = ({ selectedConversation }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {onlineUsers} = useSocket();
  const currentUserRole = user?.role || '';
  const { userId } = useParams();

  const headerStyles = theme === 'dark'
    ? 'bg-neutral-950/80 border-neutral-800/80'
    : 'bg-white/80 border-neutral-200';
  const nameStyles = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const avatarStyles = theme === 'dark'
    ? 'bg-neutral-800 text-white'
    : 'bg-emerald-100 text-emerald-700';
  const headerHover = theme === 'dark' ? 'hover:bg-neutral-900/70' : 'hover:bg-neutral-100';

  if (!selectedConversation) {
    return (
      <div className={`h-full min-h-[calc(100vh-1rem)] flex items-center justify-center text-sm ${subTextStyles}`}>
        Select a user to start chatting.
      </div>
    );
  }

  const initials = selectedConversation.name
    ? selectedConversation.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : 'U';

  return (
    <div className={`shrink-0 ${currentUserRole === 'manager' ? 'cursor-pointer' : ''}`} onClick={() => {
      if (currentUserRole === 'manager') {
        navigate(`/manager-dashboard/employee-tasks/${selectedConversation.name}`);
      }
    }}>
      <div className={`sticky top-0 z-10 flex ${currentUserRole === 'manager' ? headerHover : ''} items-center gap-3 px-5 py-4 border-b backdrop-blur ${headerStyles}`}>
        {userId && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate('/chat');
            }}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10"
            aria-label="Back to chats"
          >
            <svg
              className="h-4 w-4"
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
          </button>
        )}
        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarStyles}`}>
          {selectedConversation.role === 'manager' ? 'M' : initials}
        </div>
        <div className="leading-tight">
          <h2 className={`text-lg font-semibold ${nameStyles}`}>{selectedConversation.role === 'manager' ? 'Manager' : selectedConversation.name}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${onlineUsers.includes(selectedConversation._id) ? 'bg-emerald-500' : 'bg-neutral-400/70'}`}
            />
            <p className={`text-xs ${subTextStyles}`}>{onlineUsers.includes(selectedConversation._id) ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>
      {/* <div className={`flex-1 p-4 ${subTextStyles}`}>
        Chat view goes here.
      </div> */}
    </div>
  );
};

export default ChatUser;
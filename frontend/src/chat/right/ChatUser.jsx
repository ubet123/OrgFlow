import React from 'react';
import { useTheme } from '../../context/themeContext';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../statemanagement/useAuth';

const ChatUser = ({ selectedConversation }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserRole = user?.role || '';

  const headerStyles = theme === 'dark'
    ? 'bg-neutral-950 border-neutral-800'
    : 'bg-white border-neutral-200';
  const nameStyles = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const avatarStyles = theme === 'dark'
    ? 'bg-neutral-800 text-white'
    : 'bg-emerald-100 text-emerald-700';
  const headerHover = theme === 'dark' ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800' : 'hover:bg-neutral-300';

  if (!selectedConversation) {
    return (
      <div className={`h-full flex items-center justify-center text-sm ${subTextStyles}`}>
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
      <div className={`flex ${currentUserRole === 'manager' ? headerHover : ''}  items-center gap-3 px-4 py-3 border-b ${headerStyles}`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarStyles}`}>
          {initials}
        </div>
        <div className="leading-tight">
          <h2 className={`text-lg font-semibold ${nameStyles}`}>{selectedConversation.name}</h2>
          <p className={`text-xs ${subTextStyles}`}>Online</p>
        </div>
      </div>
      {/* <div className={`flex-1 p-4 ${subTextStyles}`}>
        Chat view goes here.
      </div> */}
    </div>
  );
};

export default ChatUser;
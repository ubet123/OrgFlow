import React from 'react';
import { useTheme } from '../../context/themeContext';

const ChatUser = ({ selectedUser }) => {
  const { theme } = useTheme();
  const headerStyles = theme === 'dark'
    ? 'bg-neutral-950 border-neutral-800'
    : 'bg-white border-neutral-200';
  const nameStyles = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const avatarStyles = theme === 'dark'
    ? 'bg-neutral-800 text-white'
    : 'bg-emerald-100 text-emerald-700';

  if (!selectedUser) {
    return (
      <div className={`h-full flex items-center justify-center text-sm ${subTextStyles}`}>
        Select a user to start chatting.
      </div>
    );
  }

  const initials = selectedUser.name
    ? selectedUser.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : 'U';

  return (
    <div className="shrink-0">
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${headerStyles}`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${avatarStyles}`}>
          {initials}
        </div>
        <div className="leading-tight">
          <h2 className={`text-lg font-semibold ${nameStyles}`}>{selectedUser.name}</h2>
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
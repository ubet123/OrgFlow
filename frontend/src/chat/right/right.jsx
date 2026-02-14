import React from 'react';
import ChatUser from './ChatUser';
import { useTheme } from '../../context/themeContext';
import Messages from './Messages';
import TypeMessage from './TypeMessage';
import useConversation from '../../statemanagement/useConversation';

export default function Right() {
  const { theme } = useTheme();
  const { selectedConversation } = useConversation();
  const containerStyles = theme === 'dark'
    ? 'bg-neutral-950/80 text-white border-neutral-800/80 shadow-xl shadow-emerald-900/10'
    : 'bg-white/90 text-neutral-900 border-neutral-200 shadow-lg shadow-emerald-200/40';

  return (
    <>
    <div className={`flex-1 min-w-0 h-full rounded-2xl border ${containerStyles} flex flex-col overflow-hidden backdrop-blur`}>
      <ChatUser selectedConversation={selectedConversation} />
      <Messages className="flex-1 min-h-0 overflow-y-auto custom-scrollbar" />
     {selectedConversation&& <TypeMessage className="shrink-0" />}
     
    </div>
    </> 
  );

}
 
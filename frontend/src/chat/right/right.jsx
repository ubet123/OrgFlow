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
    ? 'bg-neutral-950 text-white border-neutral-800'
    : 'bg-white text-neutral-900 border-neutral-200';

  return (
    <>
    <div className={`flex-1 min-w-0 border-l ${containerStyles} flex flex-col h-full`}>
      <ChatUser selectedConversation={selectedConversation} />
      <Messages className="flex-1 min-h-0 overflow-y-auto custom-scrollbar" />
     {selectedConversation&& <TypeMessage className="shrink-0" />}
     
    </div>
    </> 
  );

}
 
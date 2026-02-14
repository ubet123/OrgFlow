import React, { useMemo , useRef , useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import useGetMessage from '../../context/useGetMessage';
import useAuth from '../../statemanagement/useAuth';
import useGetSocketMessage from '../../context/useGetSocketMessage';


const Messages = ({ className = '' }) => {
  const { theme } = useTheme();
  const lastMessageRef = useRef(null);
  const { messages, loading } = useGetMessage();
  useGetSocketMessage();
  const safeMessages = Array.isArray(messages) ? messages : [];
  const { user } = useAuth();
  const currentUserId = user?._id || '';

  

  const wrapperStyles = theme === 'dark'
    ? 'bg-[linear-gradient(180deg,_rgba(15,23,42,0.25),_rgba(3,7,18,0.35))]'
    : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.7),_rgba(241,245,249,0.7))]';
  const leftBubbleStyles = theme === 'dark'
    ? 'bg-neutral-800 text-neutral-100 border-neutral-700'
    : 'bg-white text-neutral-800 border-neutral-200';
  const rightBubbleStyles = theme === 'dark'
    ? 'bg-emerald-700 text-white border-emerald-600'
    : 'bg-emerald-600 text-white border-emerald-500';
  const timeStylesLeft = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';
  const timeStylesRight = 'text-white';

  const formattedMessages = useMemo(() => {
    return safeMessages.map((message) => {
      const senderId = message.senderId ? String(message.senderId) : '';
      const isMine = currentUserId && senderId === String(currentUserId);
      const timestamp = message.createdAt ? new Date(message.createdAt) : null;
      const timeLabel = timestamp
        ? `${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
        : '';
      return {
        ...message,
        isMine,
        timeLabel
      };
    });
  }, [currentUserId, safeMessages]);

  useEffect(() => {
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
    
  }, [formattedMessages])
  

 
  return (
    <>
      {loading ? (
        <div className={`h-full flex items-center justify-center text-sm ${timeStylesLeft}`}>
          Loading messages...
        </div>
      ) : (
        <div className={`flex flex-col gap-4 px-5 py-4 sm:px-6 ${wrapperStyles} ${className}`}>
          {!loading && safeMessages.length === 0 && (
            <div className={`text-center mt-7 text-xl ${timeStylesLeft}`}>
              No messages yet. Start the conversation!
            </div>
          )}

          {formattedMessages.map((message) => (
            <div ref={lastMessageRef} key={message._id || message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl border px-4 py-2 text-sm leading-relaxed shadow-sm ${
                  message.isMine ? rightBubbleStyles : leftBubbleStyles
                }`}
              >
                <p>{message.message}</p>
                <span className={`mt-1 block text-[11px] ${message.isMine ? timeStylesRight : timeStylesLeft} ${message.isMine ? 'text-right' : ''}`}>
                  {message.timeLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Messages;
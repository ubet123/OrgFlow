import React from 'react';
import { useTheme } from '../../context/themeContext';

const Messages = ({ className = '' }) => {
  const { theme } = useTheme();

  const wrapperStyles = theme === 'dark' ? 'bg-neutral-950' : 'bg-neutral-50';
  const leftBubbleStyles = theme === 'dark'
    ? 'bg-neutral-800 text-neutral-100 border-neutral-700'
    : 'bg-white text-neutral-800 border-neutral-200';
  const rightBubbleStyles = theme === 'dark'
    ? 'bg-emerald-700 text-white border-emerald-600'
    : 'bg-emerald-600 text-white border-emerald-500';
  const timeStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';

  const sampleMessages = [
    { id: 1, text: 'Hey, are we still on for the demo today?', time: '9:12 AM', mine: false },
    { id: 2, text: 'Yes. I will share the notes in 10 minutes.', time: '9:13 AM', mine: true },
    { id: 3, text: 'Perfect, thanks!', time: '9:14 AM', mine: false },
     { id: 1, text: 'Hey, are we still on for the demo today?', time: '9:12 AM', mine: false },
    { id: 2, text: 'Yes. I will share the notes in 10 minutes.', time: '9:13 AM', mine: true },
    { id: 3, text: 'Perfect, thanks!', time: '9:14 AM', mine: false },
     { id: 1, text: 'Hey, are we still on for the demo today?', time: '9:12 AM', mine: false },
    { id: 2, text: 'Yes. I will share the notes in 10 minutes.', time: '9:13 AM', mine: true },
    { id: 3, text: 'Perfect, thanks!', time: '9:14 AM', mine: false },
     { id: 1, text: 'Hey, are we still on for the demo today?', time: '9:12 AM', mine: false },
    { id: 2, text: 'Yes. I will share the notes in 10 minutes.', time: '9:13 AM', mine: true },
    { id: 3, text: 'Perfect, thanks!', time: '9:14 AM', mine: false },
     { id: 1, text: 'Hey, are we still on for the demo today?', time: '9:12 AM', mine: false },
    { id: 2, text: 'Yes. I will share the notes in 10 minutes.', time: '9:13 AM', mine: true },
    { id: 3, text: 'Perfect, thanks!', time: '9:14 AM', mine: false }
  ];

  return (
    <div className={`flex flex-col gap-3 p-4 ${wrapperStyles} ${className}`}>
      {sampleMessages.map((message) => (
        <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[70%] rounded-2xl border px-4 py-2 text-sm leading-relaxed shadow-sm ${
              message.mine ? rightBubbleStyles : leftBubbleStyles
            }`}
          >
            <p>{message.text}</p>
            <span className={`mt-1 block text-[11px] ${timeStyles} ${message.mine ? 'text-right' : ''}`}>
              {message.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
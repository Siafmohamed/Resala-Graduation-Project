import React from 'react';
import type { Message } from '../types/message';

interface MessageBubbleProps {
  message: Message;
  currentDonorId?: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentDonorId }) => {
  const isStaff = message.senderId === 'staff';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isStaff ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`
            px-4 py-2 rounded-2xl
            ${isStaff
              ? 'bg-blue-700 text-white rounded-br-md'
              : 'bg-white border border-blue-700 text-gray-900 rounded-bl-md'
            }
          `}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

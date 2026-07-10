import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { DonorListItem } from '../types/donor';
import type { Message } from '../types/message';

interface ChatWindowProps {
  donor?: DonorListItem;
  messages: Message[];
  onSend: (text: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  onReconnect?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  donor,
  messages,
  onSend,
  connectionStatus,
  onReconnect
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!donor) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-blue-50">
        <div className="p-8 bg-white rounded-3xl shadow-sm text-center">
          <MessageSquare size={64} className="text-blue-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">اختر متبرعاً لبدء المحادثة</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <ChatHeader
        donor={donor}
        connectionStatus={connectionStatus}
        onReconnect={onReconnect}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>لا توجد رسائل بعد</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentDonorId={donor.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput
        onSend={onSend}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
};

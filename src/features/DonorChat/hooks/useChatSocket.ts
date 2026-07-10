import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types/message';

const MOCK_REPLIES = [
  "شكرًا جزيلًا على رسالتك، سأقوم بالرد عليك قريبًا.",
  "حاضر، سأقوم بالتحقق من طلبك.",
  "نرجو منك الانتظار قليلًا، سنتواصل معك في أقرب وقت.",
  "شكرًا لاتصالك، سنرد عليك في أقرب فرصة."
];

export const useChatSocket = (donorId?: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (!donorId) return;

    setConnectionStatus('connecting');
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => {
      clearTimeout(timer);
      setConnectionStatus('disconnected');
    };
  }, [donorId]);

  const sendMessage = useCallback((text: string) => {
    if (!donorId) return;

    const newMessage: Message = {
      id: uuidv4(),
      senderId: 'staff',
      text,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      const randomReply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      const replyDelay = 2000 + Math.random() * 2000;

      setTimeout(() => {
        const donorReply: Message = {
          id: uuidv4(),
          senderId: donorId,
          text: randomReply,
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, donorReply]);
      }, replyDelay);
    }, 500);
  }, [donorId]);

  const reconnect = useCallback(() => {
    if (!donorId) return;
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);
  }, [donorId]);

  return {
    messages,
    sendMessage,
    connectionStatus,
    reconnect
  };
};

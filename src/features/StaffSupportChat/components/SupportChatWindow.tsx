import React, { useEffect, useRef } from 'react';
import { MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { SupportChatHeader } from './SupportChatHeader';
import { SupportChatMessageBubble, ChatDateDivider } from './SupportChatMessageBubble';
import { SupportChatMessageInput } from './SupportChatMessageInput';
import type { SupportChatMessage, SupportChatUser } from '../types/support';
import type { ConnectionStatus } from '../services/supportSignalR';
import { formatDateDivider, shouldShowDateDivider } from '../utils/formatChatDate';

interface SupportChatWindowProps {
  user?: SupportChatUser;
  messages: SupportChatMessage[];
  onSend: (text: string) => void;
  connectionStatus: ConnectionStatus;
  onReconnect?: () => void;
  isLoadingHistory?: boolean;
  onBack?: () => void;
}

export const SupportChatWindow: React.FC<SupportChatWindowProps> = ({
  user,
  messages,
  onSend,
  connectionStatus,
  onReconnect,
  isLoadingHistory,
  onBack,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)]">
        <div className="p-10 bg-white rounded-3xl shadow-[0_12px_48px_rgba(0,84,154,0.08)] text-center max-w-sm mx-6 border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#00549A]/10 flex items-center justify-center">
            <MessageSquare size={32} className="text-[#00549A]" />
          </div>
          <h2 className="font-[Cairo] font-bold text-lg text-[#101727] mb-2">اختر محادثة للبدء</h2>
          <p className="font-[Cairo] text-sm text-[#697282] leading-relaxed">
            اختر متبرعاً من القائمة لعرض سجل المحادثة والرد بشكل احترافي
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-5 text-[#00549A]">
            <Sparkles size={14} />
            <span className="font-[Cairo] text-xs font-bold">مركز دعم المتبرعين</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)]">
      <SupportChatHeader
        user={user}
        connectionStatus={connectionStatus}
        onReconnect={onReconnect}
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {isLoadingHistory ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="text-[#00549A] animate-spin mb-3" size={32} />
            <p className="font-[Cairo] text-sm text-[#697282]">جاري تحميل سجل المحادثة...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="p-4 rounded-2xl bg-white shadow-sm mb-4 border border-gray-100">
              <MessageSquare size={28} className="text-[#00549A]/40" />
            </div>
            <p className="font-[Cairo] font-bold text-sm text-[#101727]">لا توجد رسائل بعد</p>
            <p className="font-[Cairo] text-xs text-[#697282] mt-1 max-w-xs">
              ابدأ المحادثة بتحية مهنية واسأل المتبرع عن استفساره
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const previous = index > 0 ? messages[index - 1].createdOn : undefined;
              const showDivider = shouldShowDateDivider(message.createdOn, previous);

              return (
                <React.Fragment key={message.id}>
                  {showDivider && <ChatDateDivider label={formatDateDivider(message.createdOn)} />}
                  <SupportChatMessageBubble message={message} donorName={user.name} />
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <SupportChatMessageInput onSend={onSend} disabled={connectionStatus !== 'connected'} />
    </div>
  );
};

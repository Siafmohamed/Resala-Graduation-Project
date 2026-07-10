import React from 'react';
import { Headphones } from 'lucide-react';
import type { SupportChatMessage } from '../types/support';
import { formatMessageTime } from '../utils/formatChatDate';

interface SupportChatMessageBubbleProps {
  message: SupportChatMessage;
  donorName?: string;
  showAvatar?: boolean;
}

export const SupportChatMessageBubble: React.FC<SupportChatMessageBubbleProps> = ({
  message,
  donorName,
  showAvatar = true,
}) => {
  const isStaff = message.isFromStaff;
  const displayName = isStaff ? 'فريق الدعم' : donorName || message.senderName || 'المتبرع';

  return (
    <div className={`flex gap-2.5 mb-3 ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-[11px] font-bold font-[Cairo]
            ${isStaff
              ? 'bg-gradient-to-br from-[#00549A] to-[#0070c0] text-white'
              : 'bg-[#e6eff7] text-[#00549A]'
            }`}
        >
          {isStaff ? <Headphones size={14} /> : displayName[0]?.toUpperCase()}
        </div>
      )}

      <div className={`flex flex-col max-w-[78%] ${isStaff ? 'items-end' : 'items-start'}`}>
        <span className="font-[Cairo] text-[10px] font-bold text-[#94a3b8] mb-1 px-1">
          {displayName}
        </span>

        <div
          className={`
            px-4 py-2.5 shadow-sm font-[Cairo] text-sm leading-relaxed
            ${isStaff
              ? 'bg-gradient-to-br from-[#00549A] to-[#0066b3] text-white rounded-2xl rounded-bl-md'
              : 'bg-white text-[#101727] border border-gray-100 rounded-2xl rounded-br-md'
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{message.messageText}</p>
        </div>

        <span className="font-[Cairo] text-[10px] text-[#94a3b8] mt-1 px-1">
          {formatMessageTime(message.createdOn)}
          {message.isRead && isStaff && <span className="mr-1.5 text-[#00549A]">· تم القراءة</span>}
        </span>
      </div>
    </div>
  );
};

export function ChatDateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="font-[Cairo] text-[11px] font-bold text-[#94a3b8] px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

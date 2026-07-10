import React from 'react';
import type { SupportChatUser } from '../types/support';
import { formatRelativeMessageTime } from '../utils/formatChatDate';

interface SupportChatUserCardProps {
  user: SupportChatUser;
  isActive?: boolean;
  onClick: () => void;
}

export const SupportChatUserCard: React.FC<SupportChatUserCardProps> = ({ user, isActive, onClick }) => {
  const firstLetter = user.name[0]?.toUpperCase() || '?';
  const previewPrefix = user.lastMessageFromStaff ? 'أنت: ' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all duration-200
        ${isActive
          ? 'bg-[#00549A]/8 ring-1 ring-[#00549A]/15 shadow-sm'
          : 'hover:bg-white hover:shadow-sm'
        }
      `}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-[Cairo] font-bold text-sm shrink-0
          ${isActive
            ? 'bg-gradient-to-br from-[#00549A] to-[#0070c0] text-white shadow-md shadow-[#00549A]/20'
            : 'bg-gradient-to-br from-[#e6eff7] to-[#f0f7ff] text-[#00549A]'
          }`}
      >
        {firstLetter}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`font-[Cairo] font-bold text-sm truncate ${isActive ? 'text-[#00549A]' : 'text-[#101727]'}`}>
            {user.name}
          </p>
          {user.lastMessageAt && (
            <span className="font-[Cairo] text-[10px] text-[#94a3b8] shrink-0">
              {formatRelativeMessageTime(user.lastMessageAt)}
            </span>
          )}
        </div>

        <p className={`font-[Cairo] text-[11px] mt-0.5 truncate ${user.unreadCount ? 'text-[#101727] font-semibold' : 'text-[#94a3b8]'}`}>
          {user.lastMessageText
            ? `${previewPrefix}${user.lastMessageText}`
            : `متبرع · #${user.id}`}
        </p>
      </div>

      {user.unreadCount && user.unreadCount > 0 ? (
        <div className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-[#F04930] text-white rounded-full text-[10px] font-bold font-[Cairo] shadow-sm">
          {user.unreadCount > 9 ? '9+' : user.unreadCount}
        </div>
      ) : user.lastMessageAt ? (
        <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-[#00549A]' : 'bg-emerald-400'}`} />
      ) : (
        <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-[#00549A]' : 'bg-gray-200'}`} />
      )}
    </button>
  );
};

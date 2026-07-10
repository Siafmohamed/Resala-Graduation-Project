import React from 'react';
import { Search, MessageCircle, Loader2, AlertCircle, Users } from 'lucide-react';
import { Pagination } from '@/shared/components/ui/Pagination';
import { SupportChatUserCard } from './SupportChatUserCard';
import type { SupportChatUser } from '../types/support';

interface SupportChatUserListProps {
  users: SupportChatUser[];
  activeUserId?: string;
  onUserSelect: (user: SupportChatUser) => void;
  isLoading: boolean;
  error?: unknown;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

export const SupportChatUserList: React.FC<SupportChatUserListProps> = ({
  users,
  activeUserId,
  onUserSelect,
  isLoading,
  error,
  search,
  onSearchChange,
  page,
  totalRows,
  onPageChange,
}) => {
  const pageSize = 20;
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <div className="flex flex-col h-full bg-[#fafbfc]">
      <div className="px-5 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00549A]/10">
              <MessageCircle size={18} className="text-[#00549A]" />
            </div>
            <div>
              <h2 className="font-[Cairo] font-bold text-base text-[#101727]">المحادثات</h2>
              <p className="font-[Cairo] text-[11px] text-[#697282]">{totalRows} متبرع</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-[Cairo] text-[10px] font-bold">متصل</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={17} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو رقم المتبرع..."
            dir="rtl"
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/80 focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] focus:bg-white font-[Cairo] text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2.5 w-1/3 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 px-6 text-center">
            <AlertCircle size={40} className="mb-3 opacity-80" />
            <p className="font-[Cairo] font-bold text-sm">حدث خطأ أثناء تحميل المتبرعين</p>
            <p className="font-[Cairo] text-xs text-red-400 mt-1">يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#697282] px-6 text-center">
            <div className="p-5 bg-white rounded-2xl shadow-sm mb-4">
              <Users size={36} className="text-[#00549A]/30" />
            </div>
            <p className="font-[Cairo] font-bold text-sm text-[#101727]">لا توجد محادثات</p>
            <p className="font-[Cairo] text-xs mt-1">ابحث عن متبرع لبدء مراسلته</p>
          </div>
        ) : (
          <div className="p-2 space-y-0.5">
            {users.map((user) => (
              <SupportChatUserCard
                key={user.id}
                user={user}
                isActive={activeUserId === user.id}
                onClick={() => onUserSelect(user)}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 bg-white">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Bell, Menu } from "lucide-react";
import { useAuthStore, useUserRole, Role } from "@/features/authentication";

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
  userName?: string;
  userRole?: string;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle = "",
  pageSubtitle = "",
  toggleSidebar,
}) => {
  const session = useAuthStore((s: any) => s.session);
  const userRole = useUserRole();

  return (
    <header className="flex w-full min-h-[80px] md:h-[100px] items-center bg-transparent px-4 md:px-10 py-4 md:py-0" dir="rtl">
      <div className="flex items-center justify-between w-full">
        {/* Right side: Menu Toggle, Page Title and Subtitle */}
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            className="lg:hidden p-2 -mr-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-[Cairo] font-bold text-[#101727] text-[20px] md:text-[28px] tracking-tight line-clamp-1">
              {pageTitle}
            </h1>
            <p className="font-[Cairo] text-[#697282] text-[12px] md:text-[14px] opacity-80 hidden sm:block">
              {pageSubtitle}
            </p>
          </div>
        </div>

        {/* Left side: User Profile & Notification */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <span className="font-[Cairo] font-bold text-[14px] md:text-[15px] text-[#101727] whitespace-nowrap">
                {session?.name || 'أحمد السيد'}
              </span>
              <span className="font-[Cairo] text-[11px] md:text-[12px] text-[#697282] whitespace-nowrap">
                {userRole === Role.RECEPTIONIST ? 'موظف استقبال' : 'مدير النظام'}
              </span>
            </div>
            <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-[#EEF3FB] flex items-center justify-center text-[#00549A] font-bold font-[Cairo] text-base md:text-lg shadow-sm shrink-0">
              <span className="text-sm md:text-base">أ</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[7px] md:text-[9px] text-white font-bold italic">i</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="relative p-2 md:p-3 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 shrink-0"
          >
            <Bell className="w-5 h-5 md:w-5.5 md:h-5.5 text-[#697282]" strokeWidth={2} />
            <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
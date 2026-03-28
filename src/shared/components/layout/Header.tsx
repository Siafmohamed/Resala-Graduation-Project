import React from "react";
import { Bell } from "lucide-react";
import { useAuthStore, useUserRole, Role } from "@/features/authentication";

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
  userName?: string;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle = "",
  pageSubtitle = "",
}) => {
  const session = useAuthStore((s: any) => s.session);
  const userRole = useUserRole();

  return (
    <header className="flex w-full h-[100px] items-center bg-transparent px-10" dir="rtl">
      <div className="flex items-center justify-between w-full">
        {/* Right side: Page Title and Subtitle */}
        <div className="flex flex-col items-start gap-1.5">
          <h1 className="font-[Cairo] font-bold text-[#101727] text-[28px] tracking-tight">
            {pageTitle}
          </h1>
          <p className="font-[Cairo] text-[#697282] text-[14px] opacity-80">
            {pageSubtitle}
          </p>
        </div>

        {/* Left side: User Profile & Notification */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-[Cairo] font-bold text-[15px] text-[#101727]">
                {session?.name || 'أحمد السيد'}
              </span>
              <span className="font-[Cairo] text-[12px] text-[#697282]">
                {userRole === Role.RECEPTIONIST ? 'موظف استقبال' : 'مدير النظام'}
              </span>
            </div>
            <div className="relative w-11 h-11 rounded-2xl bg-[#EEF3FB] flex items-center justify-center text-[#00549A] font-bold font-[Cairo] text-lg shadow-sm">
              <span className="text-base">أ</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[9px] text-white font-bold italic">i</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="relative p-3 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
          >
            <Bell className="w-5.5 h-5.5 text-[#697282]" strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
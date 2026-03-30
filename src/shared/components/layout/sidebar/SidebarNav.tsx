import React, { useState, useMemo } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { getNavConfigForRole } from "./navigationConfig";
import { authService } from "@/features/authentication/services/authService";
import { useAuthStore, useUserRole, Role } from "@/features/authentication";
import { ROLE_LABELS_AR } from "@/features/authentication/types/role.types";
import type { NavItem, NavGroup } from "./types";

const RisalaLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="103"
    height="46"
    viewBox="0 0 103 46"
    fill="none"
    aria-label="شعار جمعية رسالة"
  >
    <g clipPath="url(#risala-clip)">
      <path d="M54.2245 10.0526V19.7468H52.7992H51.3739V14.0444V8.34188H46.756C39.9147 8.34188 39.9717 8.28486 39.9717 15.7551V22.0278H49.3785H58.7854V11.1931V0.35841H56.5049H54.2245V10.0526ZM46.699 15.1278C46.813 18.5493 46.642 20.089 46.1289 20.3741C44.6466 21.2865 43.9625 19.6898 43.9625 15.1849C43.9625 10.6229 44.1905 9.88155 45.6728 10.1667C46.3569 10.3377 46.585 11.3642 46.699 15.1278Z" fill="#F04930"/>
      <path d="M61.636 11.1931V22.0278H75.0336H88.4882L88.3172 15.2989L88.1461 8.627H85.8657H83.5852L83.4142 14.1584C83.3002 18.6063 83.0721 19.7468 82.445 19.7468C81.7609 19.7468 81.5899 18.6634 81.5899 14.0444V8.34188H79.3094H77.029V14.0444C77.029 19.3477 76.972 19.7468 75.8888 19.7468C74.8626 19.7468 74.7485 19.2906 74.6345 14.1584L74.4635 8.627L72.3541 8.45593L70.1876 8.28486V14.0444V19.8039L68.3633 19.6328L66.4819 19.4617L66.3679 14.8997C66.3109 12.3906 66.2539 8.11378 66.2539 5.31957L66.1969 0.35841H63.9164H61.636V11.1931Z" fill="#F04930"/>
      <path d="M8.90057 4.23605C-0.620278 8.74101 -2.90072 19.3476 3.99762 27.16L5.76496 29.1559L6.79116 27.7873C7.87437 26.4187 7.87437 26.4187 6.16404 23.6815C4.68175 21.2294 4.51072 20.6022 4.73876 17.2377C4.9098 14.1584 5.25186 13.1319 6.73415 11.3641C8.61552 9.02613 10.8389 7.48646 13.2904 6.91622L14.8867 6.51704L15.0008 22.3699L15.1718 38.2799H16.5971C18.2504 38.2799 18.1934 38.8501 18.2504 18.7203L18.3074 6.57407L20.7589 6.91622C22.6402 7.14431 23.4384 6.97324 24.5786 6.11787C25.6618 5.2625 25.8329 4.8063 25.3768 4.3501C24.3506 3.32365 20.7019 2.69638 16.312 2.63935C13.1194 2.63935 11.6371 2.9815 8.90057 4.23605Z" fill="#00549A"/>
      <path d="M38.4325 3.77985C33.6436 5.4906 27.9425 8.74101 24.6928 11.5352C21.8993 13.9873 21.7283 14.2724 21.7283 16.7815L21.7853 19.4617L22.9825 17.7509C25.1489 14.6716 31.6482 8.56993 34.4988 6.91622C36.0381 6.00382 38.8316 4.69225 40.77 4.00795C42.9364 3.15258 43.7345 2.69638 42.8224 2.69638C42.0242 2.69638 40.0858 3.2096 38.4325 3.77985Z" fill="#F04930"/>
      <path d="M42.6512 5.26255C41.8531 6.06089 42.2521 6.68817 43.3924 6.51709C44.0765 6.40304 44.5896 6.06089 44.5896 5.77577C44.5896 5.09147 43.2213 4.74932 42.6512 5.26255Z" fill="#F04930"/>
      <path d="M47.3832 5.49055C46.699 5.94675 46.699 6.0608 47.5542 6.40294C48.0673 6.57402 48.9795 6.57402 49.4926 6.40294C50.3477 6.0608 50.3477 5.94675 49.6636 5.49055C49.2075 5.1484 48.6944 4.9203 48.5234 4.9203C48.3523 4.9203 47.8392 5.1484 47.3832 5.49055Z" fill="#F04930"/>
      <path d="M93.4481 16.1544L93.2771 24.0238L91.2817 24.9932C89.6284 25.7916 89.4573 25.9626 90.3125 26.3048C92.0798 27.0461 96.0706 26.1907 97.0968 24.8792C97.952 23.7957 98.123 22.4271 98.123 15.9833V8.34199H95.8426H93.6191L93.4481 16.1544Z" fill="#F04930"/>
      <path d="M31.5912 13.0179C30.622 14.1584 30.4509 14.8998 30.679 18.0361C30.85 21.0014 30.679 22.0849 29.7668 23.5105C28.3415 25.7915 25.377 28.0725 22.5264 29.0419C21.3292 29.4981 20.303 30.0684 20.303 30.2965C20.36 30.5246 22.6404 34.1741 25.434 38.3369L30.565 45.9212L33.8716 45.9783H37.1212L31.7052 39.0212C26.2891 32.1212 26.2891 32.1212 27.5434 31.2659C32.2753 28.1295 35.4109 23.5105 35.4109 19.8039C35.4109 16.8386 34.1567 12.2196 33.3015 11.9345C33.0164 11.8204 32.2753 12.3336 31.5912 13.0179Z" fill="#00549A"/>
      <path d="M52.6281 28.6428C50.9178 29.7833 50.9748 32.5205 52.6851 34.0031C57.4741 38.2229 57.7591 38.5651 57.075 39.4205C56.2198 40.4469 53.0272 40.5609 52.058 39.5915C51.5449 39.0783 51.3739 39.3064 51.3739 40.618V42.3857L54.6235 41.8725C58.5003 41.2452 59.3554 40.675 59.3554 38.5081C59.3554 37.1965 58.8423 36.5122 56.961 35.1436C53.2553 32.5775 53.0272 32.2924 53.1982 30.9808C53.3693 29.5552 56.1628 28.8709 57.246 29.9543C58.1012 30.8097 58.7853 30.7527 58.7853 29.7262C58.7853 28.8138 56.6189 27.7304 54.9086 27.7304C54.3385 27.7304 53.3123 28.1295 52.6281 28.6428Z" fill="#00549A"/>
      <path d="M77.77 34.8585V41.9866H80.7346C83.3001 41.9866 85.0104 41.3023 85.0104 40.2758C85.0104 40.1048 83.9272 39.9907 82.616 39.9907H80.1645V33.832C80.2215 27.9585 80.1645 27.7304 79.0243 27.7304C77.827 27.7304 77.77 27.9585 77.77 34.8585Z" fill="#00549A"/>
      <path d="M39.9717 35.1435V42.0435L43.5064 41.8724C45.6728 41.7583 47.0981 41.4162 47.2691 40.96C47.3831 40.5038 46.756 40.2757 45.1597 40.2757H42.8222V37.9947C42.8222 36.1699 43.0503 35.7137 43.9054 35.7137C44.4756 35.7137 45.2737 35.3145 45.6728 34.8583C46.2999 34.117 46.1289 34.003 44.5896 34.003C42.8792 34.003 42.8222 33.8889 42.8222 31.6649V29.3269L44.7606 29.6691C46.1859 29.9542 46.756 29.8401 47.0411 29.1559C47.2691 28.4716 46.756 28.3005 43.6774 28.3005H39.9717V35.1435Z" fill="#00549A"/>
      <path d="M64.2015 34.6304C62.3201 38.0519 60.7238 41.1312 60.6098 41.4733C60.4958 41.7585 61.1229 41.9866 62.0351 41.9866C63.4033 41.9866 63.8024 41.6444 64.2015 40.1048C64.7146 38.394 64.9426 38.28 67.5652 38.1089C70.5867 37.9378 72.4681 39.0213 72.4681 40.9601C72.4681 41.7014 72.9242 41.9866 74.2355 41.9866C75.2046 41.9866 75.8888 41.7585 75.7748 41.5304C75.0336 39.7626 68.3063 28.3006 68.0212 28.3006C67.7932 28.3576 66.0829 31.1519 64.2015 34.6304ZM68.7054 33.775C69.2755 35.2576 69.1045 35.7138 67.9072 35.7138C67.2801 35.7138 66.767 35.4857 66.767 35.2006C66.767 34.2312 67.4511 32.8626 67.9072 32.8626C68.1353 32.8626 68.5343 33.2618 68.7054 33.775Z" fill="#00549A"/>
      <path d="M89.7423 34.7444C87.7469 38.28 86.1506 41.3593 86.1506 41.5874C86.1506 41.8155 86.9488 41.9866 87.861 41.9866C89.2862 41.9866 89.5713 41.7585 89.5713 40.675C89.5713 38.7362 90.6545 37.9948 93.5621 37.9948C96.3556 37.9948 98.123 39.1924 98.123 41.0172C98.123 41.7014 98.6361 41.9866 99.8903 41.9866H101.658L99.8333 38.6791C95.4434 30.9238 93.8471 28.3006 93.5621 28.3006C93.391 28.3006 91.6807 31.2089 89.7423 34.7444ZM94.0182 35.5998C92.4789 35.8849 92.1938 35.4857 92.992 33.9461L93.7331 32.6915L94.4743 34.0601C95.1014 35.3147 95.1014 35.4287 94.0182 35.5998Z" fill="#00549A"/>
      <path d="M1.77441 44.4386C1.77441 45.294 10.3831 45.9783 20.7021 45.9783C25.263 45.9783 25.7761 45.8642 25.605 44.9518C25.434 44.0965 24.3508 43.9824 13.5757 43.8113C3.88382 43.6973 1.77441 43.8113 1.77441 44.4386Z" fill="#F04930"/>
      <path d="M40.3138 44.5526C40.5988 45.2939 44.6466 45.408 71.9549 45.408C99.4913 45.408 103.197 45.2939 102.912 44.5526C102.627 43.8113 98.5791 43.6972 71.2708 43.6972C43.7344 43.6972 40.0287 43.8113 40.3138 44.5526Z" fill="#F04930"/>
    </g>
    <defs>
      <clipPath id="risala-clip">
        <rect width="103" height="46" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export const SidebarNavigationSection = (): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const clearAuth = useAuthStore((s: any) => s.clearAuth);
  const userRole = useUserRole();
  const currentUser = useAuthStore((s: any) => s.session);
  const queryClient = useQueryClient();

  const navConfig = useMemo(() => 
    userRole ? getNavConfigForRole(userRole) : [], 
    [userRole]
  );

  // Derived active state from current location
  const activeItem = useMemo(() => {
    const currentPath = location.pathname;
    
    for (const item of navConfig) {
      if ('items' in item) {
        const foundChild = item.items.find(child => child.path === currentPath);
        if (foundChild) return foundChild.id;
      } else if (item.path === currentPath) {
        return item.id;
      }
    }
    
    // Fallback: Check for partial matches or parent paths if needed
    // For example, if on /sponsorships/edit/1, we might still want 'sponsorships' active
    const matchingItem = navConfig.find(item => 
      !('items' in item) && currentPath.startsWith(item.path) && item.path !== '/'
    );
    
    return (matchingItem as NavItem)?.id || "dashboard";
  }, [location.pathname, navConfig]);

  const handleNavClick = (id: string, path: string) => {
    navigate(path);
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
    }
    clearAuth();
    queryClient.clear();
    // Force a full page reload to clear all in-memory state and caches
    window.location.href = "/login";
  };

  return (
    <nav
      className="flex flex-col w-[280px] h-full bg-white border-l border-gray-100"
      dir="rtl"
    >
      {/* ── Header: Logo + branding ── */}
      <div className="flex flex-col items-center gap-4 px-8 py-12">
        <RisalaLogo />
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-[Cairo] font-bold text-[#101727] text-[20px] leading-tight text-center tracking-tight">
            جمعية رسالة
          </h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-[12px] leading-relaxed text-center opacity-70">
            فرع الزقازيق - الإدارة
          </p>
        </div>
      </div>

      {/* ── Navigation Items ── */}
      <ScrollArea className="flex-1 w-full">
        <ul className="flex flex-col w-full">
          {navConfig.map((item) => {
            if ('items' in item) {
              const group = item as NavGroup;
              const isOpen = openGroups.includes(group.id);
              const GroupIcon = group.icon;
              const hasActiveChild = group.items.some(child => activeItem === child.id);

              return (
                <li key={group.id} className="w-full flex flex-col">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`
                      flex w-full items-center gap-3 px-6 py-4
                      transition-all duration-200 group
                      ${hasActiveChild && !isOpen ? "text-[#00549a]" : "text-[#495565] hover:bg-[#f8fafc] hover:text-[#00549a]"}
                    `}
                  >
                    {GroupIcon && (
                      <GroupIcon
                        className={`w-5 h-5 flex-shrink-0 transition-colors ${hasActiveChild ? "text-[#00549a]" : "text-[#697282] group-hover:text-[#00549a]"}`}
                        strokeWidth={1.5}
                      />
                    )}
                    <span className="font-[Cairo] font-bold text-[14px] leading-5 flex-1 text-right">
                      {group.label}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 text-[#94a3b8] ${isOpen ? "rotate-180" : ""}`} 
                      strokeWidth={2}
                    />
                  </button>
                  
                  {isOpen && (
                    <ul className="flex flex-col mt-1 pr-8">
                      {group.items.map((child) => {
                        const isChildActive = activeItem === child.id;
                        const ChildIcon = child.icon;
                        return (
                          <li key={child.id} className="w-full relative">
                            {isChildActive && (
                              <div className="absolute right-[-32px] top-1 bottom-1 w-1 bg-[#00549a] rounded-l-full" />
                            )}
                            <button
                              onClick={() => handleNavClick(child.id, child.path)}
                              className={`
                                flex w-full items-center gap-3 py-3
                                transition-all duration-200 group/child
                                ${isChildActive
                                  ? "text-[#00549a] font-bold"
                                  : "text-[#697282] hover:text-[#00549a]"
                                }
                              `}
                            >
                              {ChildIcon && (
                                <ChildIcon
                                  className={`w-4 h-4 flex-shrink-0 transition-colors ${isChildActive ? "text-[#00549a]" : "text-[#94a3b8] group-hover/child:text-[#00549a]"}`}
                                  strokeWidth={1.5}
                                />
                              )}
                              <span className="font-[Cairo] text-[13px] leading-5 flex-1 text-right">
                                {child.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const navItem = item as NavItem;
            const isActive = activeItem === navItem.id;
            const Icon = navItem.icon;
            return (
              <li key={navItem.id} className="w-full">
                <button
                  onClick={() => handleNavClick(navItem.id, navItem.path)}
                  className={`
                    flex w-full items-center gap-4 px-8 py-4
                    transition-all duration-200 group
                    ${isActive
                      ? "bg-[#EEF3FB] text-[#00549A] border-r-4 border-[#00549A]"
                      : "bg-transparent text-[#495565] hover:bg-[#f8fafc] hover:text-[#00549A] border-r-4 border-transparent"
                    }
                  `}
                >
                  {Icon && (
                    <div className="relative">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-[#00549A]" : "text-[#697282] group-hover:text-[#00549A]"}`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {navItem.id === 'notifications' && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>
                  )}
                  <span className={`font-[Cairo] font-bold text-[14px] leading-5 flex-1 text-right ${isActive ? "text-[#00549A]" : "text-[#495565]"}`}>
                    {navItem.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>

      {/* ── Footer: User Info + Logout ── */}
      <div className="px-8 py-10 mt-auto border-t border-gray-100 bg-[#FBFBFC]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#EEF3FB] flex items-center justify-center text-[#00549A] font-bold font-[Cairo] text-lg shadow-sm">
            {currentUser?.name?.[0] || 'م'}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-[Cairo] font-bold text-[15px] text-[#101727] leading-tight">
              {currentUser?.name || 'مستخدم'}
            </span>
            <span className="font-[Cairo] text-[12px] text-[#697282] opacity-80">
              {ROLE_LABELS_AR[userRole as Role] || '—'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-[#F04930] hover:bg-red-50/50 transition-all font-[Cairo] font-bold text-[14px] active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5 rotate-180" strokeWidth={2.5} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </nav>
  );
};

export default SidebarNavigationSection;
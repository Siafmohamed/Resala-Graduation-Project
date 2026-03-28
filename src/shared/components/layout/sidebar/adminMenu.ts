import { 
  LayoutDashboard, 
  Search,
  HeartHandshake,
  BarChart3, 
  Settings, 
} from "lucide-react";
import { Role } from '@/features/authentication';
import type { NavConfig } from './types';

export const adminMenu: NavConfig = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
    roles: [Role.ADMIN],
  },
  {
    id: "findings",
    label: "إدارة المكتشفات",
    path: "/donors",
    icon: Search,
    roles: [Role.ADMIN],
  },
  {
    id: "aids",
    label: "إدارة المساعدات",
    path: "/sponsorships",
    icon: HeartHandshake,
    roles: [Role.ADMIN],
  },
  {
    id: "reports",
    label: "التقارير والإحصائيات",
    path: "/reports",
    icon: BarChart3,
    roles: [Role.ADMIN],
  },
  {
    id: "settings",
    label: "إعدادات النظام",
    path: "/settings",
    icon: Settings,
    roles: [Role.ADMIN],
  },
];
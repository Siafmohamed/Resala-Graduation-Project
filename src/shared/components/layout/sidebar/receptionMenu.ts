import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Bell,
  Settings,
  Package
} from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavConfig } from './types';

export const receptionMenu: NavConfig = [
  {
    id: 'dashboard',
    label: 'لوحة الاستقبال',
    path: '/reception-dashboard',
    icon: LayoutDashboard,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'donors',
    label: 'المتبرعين',
    path: '/donors',
    icon: Users,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'add-donor',
    label: 'إضافة متبرع',
    path: '/register-new-donor',
    icon: UserPlus,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'register-donation',
    label: 'تسجيل تبرع عيني',
    path: '/donations',
    icon: FileText,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'in-kind-donations',
    label: 'قائمة التبرعات العينية',
    path: '/in-kind-donations',
    icon: Package,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    path: '/notifications',
    icon: Bell,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    path: '/reception-settings',
    icon: Settings,
    roles: [Role.RECEPTIONIST, Role.ADMIN],
  },
];


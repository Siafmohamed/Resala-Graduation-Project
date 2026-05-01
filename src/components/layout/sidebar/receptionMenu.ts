import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Bell,
  Settings,
  Package,
  HeartHandshake
} from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavConfig } from './types';

export const receptionMenu: NavConfig = [
  {
    id: 'dashboard',
    label: 'لوحة الاستقبال',
    path: '/reception-dashboard',
    icon: LayoutDashboard,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'donors',
    label: 'المتبرعين',
    path: '/donors',
    icon: Users,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'add-donor',
    label: 'إضافة متبرع',
    path: '/register-new-donor',
    icon: UserPlus,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'register-donation',
    label: 'تسجيل تبرع عيني',
    path: '/donations',
    icon: FileText,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'in-kind-donations',
    label: 'قائمة التبرعات العينية',
    path: '/in-kind-donations',
    icon: Package,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    path: '/notifications',
    icon: Bell,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'emergency-payments',
    label: 'دفعات الطوارئ',
    path: '/emergency-payments',
    icon: HeartHandshake,
    roles: [Role.RECEPTIONIST],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    path: '/reception-settings',
    icon: Settings,
    roles: [Role.RECEPTIONIST],
  },
];


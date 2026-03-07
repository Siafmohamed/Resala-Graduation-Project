import { ShieldCheck, BarChart3, FileChartColumnIncreasing, Bell, Settings, Users } from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavGroup } from './types';

export const adminMenu: NavGroup[] = [
  {
    id: 'admin-analytics',
    label: 'تحليلات الإدارة',
    roles: [Role.ADMIN],
    icon: BarChart3,
    items: [
      {
        id: 'admin-analytics-page',
        label: 'لوحة التحليلات',
        path: '/admin-analytics',
        icon: BarChart3,
        roles: [Role.ADMIN],
      },
      {
        id: 'admin-reports',
        label: 'تقارير الإدارة',
        path: '/admin-reports',
        icon: FileChartColumnIncreasing,
        roles: [Role.ADMIN],
      },
    ],
  },
  {
    id: 'accounts',
    label: 'حسابات المستخدمين',
    roles: [Role.ADMIN],
    icon: Users,
    items: [
      {
        id: 'account-management',
        label: 'إدارة الحسابات والصلاحيات',
        path: '/account-management',
        icon: ShieldCheck,
        roles: [Role.ADMIN],
      },
    ],
  },
  {
    id: 'system',
    label: 'النظام',
    roles: [Role.ADMIN],
    icon: Settings,
    items: [
      {
        id: 'notifications',
        label: 'الإشعارات',
        path: '/notifications',
        icon: Bell,
        roles: [Role.ADMIN],
      },
      {
        id: 'settings',
        label: 'إعدادات النظام',
        path: '/settings',
        icon: Settings,
        roles: [Role.ADMIN],
      },
    ],
  },
];


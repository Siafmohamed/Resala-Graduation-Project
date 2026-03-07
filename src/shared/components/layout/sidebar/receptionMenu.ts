import { LayoutDashboard, Users, UserPlus, FileText, CheckSquare, ClipboardList } from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavGroup } from './types';

export const receptionMenu: NavGroup[] = [
  {
    id: 'reception-dashboard',
    label: 'الاستقبال',
    roles: [Role.RECEPTIONIST, Role.ADMIN],
    icon: LayoutDashboard,
    items: [
      {
        id: 'dashboard',
        label: 'لوحة الاستقبال',
        path: '/dashboard',
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
        label: 'تسجيل متبرع جديد',
        path: '/register-new-donor',
        icon: UserPlus,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
      {
        id: 'donations',
        label: 'تسجيل تبرع عيني',
        path: '/donations',
        icon: FileText,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
      {
        id: 'receipt-verification',
        label: 'مراجعة التحويلات',
        path: '/receipt-verification',
        icon: CheckSquare,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
      {
        id: 'representative-orders',
        label: 'طلبات المندوبين',
        path: '/representative-orders',
        icon: ClipboardList,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
    ],
  },
];


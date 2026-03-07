import { Users, FlagTriangleRight, Activity } from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavGroup } from './types';

export const donorMenu: NavGroup[] = [
  {
    id: 'sponsorship',
    label: 'كفالات وحالات',
    roles: [Role.RECEPTIONIST, Role.ADMIN],
    icon: Users,
    items: [
      {
        id: 'sponsorship-cases',
        label: 'إدارة حالات الكفالة',
        path: '/sponsorship-cases',
        icon: FlagTriangleRight,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
      {
        id: 'urgent-cases',
        label: 'الحالات العاجلة',
        path: '/urgent-cases',
        icon: Activity,
        roles: [Role.RECEPTIONIST, Role.ADMIN],
      },
    ],
  },
];


import { FileText, PieChart } from 'lucide-react';
import { Role } from '@/features/authentication';
import type { NavGroup } from './types';

export const formsMenu: NavGroup[] = [
  {
    id: 'forms',
    label: 'النماذج والمتابعة',
    roles: [Role.FORM_MANAGER, Role.ADMIN],
    icon: FileText,
    items: [
      {
        id: 'forms-dashboard',
        label: 'لوحة متابعة النماذج',
        path: '/forms-dashboard',
        icon: PieChart,
        roles: [Role.FORM_MANAGER, Role.ADMIN],
      },
    ],
  },
];


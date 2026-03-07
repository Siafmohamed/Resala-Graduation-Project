import type { Representative } from '../types/representatives.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_REPRESENTATIVES: Representative[] = [
  {
    id: 'R-001',
    name: 'محمد سامي',
    phone: '01012345678',
    area: 'الزقازيق - أول',
    activeCases: 24,
    status: 'active',
  },
  {
    id: 'R-002',
    name: 'محمود علي',
    phone: '01123456789',
    area: 'الزقازيق - ثان',
    activeCases: 18,
    status: 'active',
  },
  {
    id: 'R-003',
    name: 'أحمد يوسف',
    phone: '01234567890',
    area: 'قرى مركز الزقازيق',
    activeCases: 12,
    status: 'inactive',
  },
];

export const representativesService = {
  async getAll(): Promise<Representative[]> {
    await delay(250);
    return MOCK_REPRESENTATIVES;
  },
};


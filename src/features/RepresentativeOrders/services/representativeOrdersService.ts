import type { RepresentativeOrder } from '../types/representativeOrders.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ORDERS: RepresentativeOrder[] = [
  {
    id: 'RO-1001',
    representativeName: 'مندوب الزقازيق 1',
    area: 'الزقازيق - أول',
    itemsCount: 12,
    createdAt: '2026-03-01 09:30',
    status: 'new',
  },
  {
    id: 'RO-1002',
    representativeName: 'مندوب الزقازيق 2',
    area: 'الزقازيق - ثان',
    itemsCount: 8,
    createdAt: '2026-03-01 10:10',
    status: 'in_progress',
  },
  {
    id: 'RO-1003',
    representativeName: 'مندوب القرى',
    area: 'قرى مركز الزقازيق',
    itemsCount: 20,
    createdAt: '2026-02-29 17:05',
    status: 'completed',
  },
];

export const representativeOrdersService = {
  async getAll(): Promise<RepresentativeOrder[]> {
    await delay(250);
    return MOCK_ORDERS;
  },
};


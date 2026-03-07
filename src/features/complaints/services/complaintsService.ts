import type { Complaint } from '../types/complaints.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'C-1001',
    complainantName: 'متبرع - أحمد محمد',
    source: 'donor',
    subject: 'استفسار عن حالة عدم ظهور التبرع',
    createdAt: '2026-03-01 09:20',
    status: 'new',
  },
  {
    id: 'C-1002',
    complainantName: 'مستفيد - أسرة علي',
    source: 'beneficiary',
    subject: 'تأخر في استلام الكفالة الشهرية',
    createdAt: '2026-02-28 17:45',
    status: 'in_review',
  },
  {
    id: 'C-1003',
    complainantName: 'مندوب - محمد سامي',
    source: 'representative',
    subject: 'مشكلة في اعتماد إيصالات التبرعات',
    createdAt: '2026-02-27 15:10',
    status: 'resolved',
  },
];

export const complaintsService = {
  async getAll(): Promise<Complaint[]> {
    await delay(250);
    return MOCK_COMPLAINTS;
  },
};


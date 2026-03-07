export type SponsorshipCategory = 'orphan' | 'family' | 'student' | 'medical';

export type SponsorshipStatus = 'active' | 'pending' | 'completed' | 'paused';

export interface SponsorshipCase {
  id: string;
  donorName: string;
  caseName: string;
  category: SponsorshipCategory;
  monthlyAmount: number;
  startDate: string;
  nextDueDate: string;
  status: SponsorshipStatus;
}


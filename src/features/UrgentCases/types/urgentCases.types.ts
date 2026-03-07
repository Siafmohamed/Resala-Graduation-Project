export type UrgentPriority = 'high' | 'medium' | 'low';

export interface UrgentCase {
  id: string;
  title: string;
  category: 'medical' | 'housing' | 'food';
  priority: UrgentPriority;
  requestedAmount: number;
  collectedAmount: number;
  createdAt: string;
}


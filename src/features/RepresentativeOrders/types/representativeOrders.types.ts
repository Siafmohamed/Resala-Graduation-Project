export type RepresentativeOrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface RepresentativeOrder {
  id: string;
  representativeName: string;
  area: string;
  itemsCount: number;
  createdAt: string;
  status: RepresentativeOrderStatus;
}


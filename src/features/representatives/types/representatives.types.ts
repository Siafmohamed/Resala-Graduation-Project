export interface Representative {
  id: string;
  name: string;
  phone: string;
  area: string;
  activeCases: number;
  status: 'active' | 'inactive';
}


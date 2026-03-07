export interface StatCardData {
  id: string;
  title: string;
  value: string;
  trendPercent: number;
  helperText?: string;
}

export interface MonthlyDonationPoint {
  month: string;
  amount: number;
}

export interface SponsorshipTypePoint {
  type: string;
  label: string;
  value: number;
}

export interface PaymentMethodPoint {
  method: string;
  label: string;
  value: number;
}

export interface AppUsersPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: StatCardData[];
  monthlyDonations: MonthlyDonationPoint[];
  sponsorshipTypes: SponsorshipTypePoint[];
  paymentMethods: PaymentMethodPoint[];
  appUsers: AppUsersPoint[];
}


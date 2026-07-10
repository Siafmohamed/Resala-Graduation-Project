export interface ActiveDonor {
  donorId: number;
  fullName: string;
  totalAmount: number;
}

export interface FinancialSummaryData {
  totalUsers: number;
  totalActiveSponsors: number;
  totalRemainingRevenue: number;
  totalMonthlyExpectedRevenue?: number;
  totalCollectedRevenue?: number;
  totalEmergencyDonationsAmount?: number;
  totalInKindDonationsQuantity?: number;
  usersWithDelayedPayments: number;
  mostActiveDonors?: ActiveDonor[];
  mostActiveSponsors?: ActiveDonor[];
}

export interface MonthlyDonationData {
  month: string;
  amount: number;
  paymentsCount: number;
}

export interface UsersStatusData {
  subscribedUsers: number;
  nonSubscribedUsers: number;
}

export interface OverviewData {
  totalDonations: number;
  totalDonors: number;
  totalActiveCases?: number;
  totalActiveSponsorships?: number;
}

export interface Sponsorship {
  sponsorshipId: number;
  title: string;
  collectedAmount: number;
  targetAmount: number;
  donorsCount: number;
}

export interface SponsorshipStatsData {
  topSponsorships: Sponsorship[];
}

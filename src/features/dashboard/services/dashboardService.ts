import type {
  DashboardData,
  MonthlyDonationPoint,
  SponsorshipTypePoint,
  PaymentMethodPoint,
  AppUsersPoint,
  StatCardData,
} from '../types/dashboard.types';
import { formatNumber } from '@/shared/utils/formatters';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MONTHLY_DONATIONS: MonthlyDonationPoint[] = [
  { month: 'يناير', amount: 120_000 },
  { month: 'فبراير', amount: 98_500 },
  { month: 'مارس', amount: 135_200 },
  { month: 'أبريل', amount: 128_900 },
  { month: 'مايو', amount: 149_300 },
  { month: 'يونيو', amount: 160_750 },
];

const SPONSORSHIP_TYPES: SponsorshipTypePoint[] = [
  { type: 'orphan', label: 'كفالة يتيم', value: 45 },
  { type: 'family', label: 'كفالة أسرة', value: 28 },
  { type: 'student', label: 'كفالة طالب علم', value: 15 },
  { type: 'medical', label: 'حالات طبية', value: 12 },
];

const PAYMENT_METHODS: PaymentMethodPoint[] = [
  { method: 'vodafone_cash', label: 'فودافون كاش', value: 52 },
  { method: 'branch', label: 'سداد بالفرع', value: 31 },
  { method: 'instapay', label: 'إنستاباي', value: 17 },
];

const APP_USERS: AppUsersPoint[] = [
  { label: 'مشترك في الإشعارات', value: 68 },
  { label: 'غير مشترك', value: 32 },
];

const STATS: StatCardData[] = [
  {
    id: 'total-donations',
    title: 'إجمالي التبرعات هذا الشهر',
    value: `${formatNumber(160_750)} جنيه`,
    trendPercent: 18,
    helperText: 'مقارنة بالشهر الماضي',
  },
  {
    id: 'active-sponsorships',
    title: 'الكفالات النشطة',
    value: formatNumber(365),
    trendPercent: 9,
    helperText: 'زيادة في عدد الكفالات',
  },
  {
    id: 'new-donors',
    title: 'متبرعين جدد',
    value: formatNumber(42),
    trendPercent: 5,
    helperText: 'منذ بداية الشهر',
  },
];

const DASHBOARD_DATA: DashboardData = {
  stats: STATS,
  monthlyDonations: MONTHLY_DONATIONS,
  sponsorshipTypes: SPONSORSHIP_TYPES,
  paymentMethods: PAYMENT_METHODS,
  appUsers: APP_USERS,
};

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    await delay(350);
    return DASHBOARD_DATA;
  },
};


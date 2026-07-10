import React, { useMemo } from 'react';
import { 
  Users, 
  Wallet,
  Briefcase,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { 
  useFinancialSummary, 
  useMonthlyDonations, 
  useUsersStatus,
  useSponsorshipStats
} from '../../hooks/useDashboard';
import RevenueChart from '../charts/RevenueChart';
import UserStatusChart from '../charts/UserStatusChart';
import SponsorshipDistributionChart from '../charts/SponsorshipDistributionChart';

// ── Types ──────────────────────────────────────────────────────────────────

interface KPIData {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface UserStatusData extends ChartData {
  percent: string;
  color: string;
}

// ── Constants & Styles ──────────────────────────────────────────────────────

const TOOLTIP_STYLE = { 
  borderRadius: '16px', 
  border: 'none', 
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', 
  direction: 'rtl' as const 
};

// ── Mock Data (for payment method chart only) ─────────────────────────────

const PAYMENT_DATA = [
  { name: 'فودافون كاش', value: 50, color: '#74A6D1' },
  { name: 'مندوب', value: 19, color: '#F04930' },
  { name: 'بالفرع', value: 31, color: '#00549A' },
];

// ── Optimized Sub-components ───────────────────────────────────────────────

const KPICards = React.memo(({ data }: { data: KPIData[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {data.map((kpi, i) => (
      <Card key={i} className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-[Cairo] font-medium text-[#697282] text-[13px] mb-1">{kpi.title}</span>
              <span className="font-[Cairo] font-bold text-[#101727] text-2xl md:text-3xl mb-1">{kpi.value}</span>
            </div>
            <div 
              className="p-3 md:p-4 rounded-2xl shrink-0" 
              style={{ backgroundColor: kpi.bgColor, color: kpi.color }}
            >
              <kpi.icon size={24} strokeWidth={2} />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));

const PaymentMethodChart = React.memo(() => (
  <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
    <CardHeader className="pt-6 px-6 md:pt-8 md:px-8 pb-2">
      <CardTitle className="font-[Cairo] font-bold text-base md:text-lg text-[#101727] text-right">توزيع طرق الدفع</CardTitle>
    </CardHeader>
    <CardContent className="p-6 md:p-8 flex flex-col items-center">
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PAYMENT_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
            >
              {PAYMENT_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {PAYMENT_DATA.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-[Cairo] text-[14px] text-[#697282]">{entry.name}</span>
            <span className="font-[Cairo] font-bold text-[14px] text-[#101727]">{entry.value}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

// ── Component ───────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const { data: financialSummary, isLoading: isFinancialLoading, isError: isFinancialError } = useFinancialSummary();
  const { data: monthlyDonations, isLoading: isMonthlyLoading, isError: isMonthlyError } = useMonthlyDonations();
  const { data: usersStatus, isLoading: isUsersLoading, isError: isUsersError } = useUsersStatus();
  const { data: sponsorshipStats, isLoading: isSponsorshipLoading, isError: isSponsorshipError } = useSponsorshipStats();

  // Memoize KPI data from API
  const kpiData = useMemo(() => {
    if (!financialSummary) {
      return [
        {
          title: 'إجمالي المتبرعين',
          value: '0',
          icon: Users,
          color: '#00549A',
          bgColor: '#EEF3FB',
        },
        {
          title: 'إجمالي الكفالات النشطة',
          value: '0',
          icon: Briefcase,
          color: '#00549A',
          bgColor: '#EEF3FB',
        },
        {
          title: 'إجمالي المبالغ المحصلة',
          value: '0 ج.م',
          icon: Wallet,
          color: '#00549A',
          bgColor: '#EEF3FB',
        },
      ];
    }

    return [
      {
        title: 'إجمالي المتبرعين',
        value: financialSummary.totalUsers.toLocaleString(),
        icon: Users,
        color: '#00549A',
        bgColor: '#EEF3FB',
      },
      {
        title: 'إجمالي الكفالات النشطة',
        value: financialSummary.totalActiveSponsors.toLocaleString(),
        icon: Briefcase,
        color: '#00549A',
        bgColor: '#EEF3FB',
      },
      {
        title: 'إجمالي المبالغ المحصلة',
        value: `${financialSummary.totalRemainingRevenue.toLocaleString()} ج.م`,
        icon: Wallet,
        color: '#00549A',
        bgColor: '#EEF3FB',
      },
    ].reverse(); // To match original layout
  }, [financialSummary]);

  // Memoize monthly donations chart data
  const monthlyChartData = useMemo(() => {
    if (!monthlyDonations) {
      return [];
    }

    return monthlyDonations.map((item) => ({
      name: item.month,
      value: item.amount,
    }));
  }, [monthlyDonations]);

  // Memoize users status chart data
  const userStatusChartData = useMemo(() => {
    if (!usersStatus) {
      return [
        { name: 'مشتركين في كفالة', value: 0, percent: '0%', color: '#00549A' },
        { name: 'غير مشتركين في كفالة', value: 0, percent: '0%', color: '#EEF3FB' },
      ];
    }

    const total = usersStatus.subscribedUsers + usersStatus.nonSubscribedUsers;
    const subscribedPercent = total > 0 ? `${Math.round((usersStatus.subscribedUsers / total) * 100)}%` : '0%';
    const nonSubscribedPercent = total > 0 ? `${Math.round((usersStatus.nonSubscribedUsers / total) * 100)}%` : '0%';

    return [
      { name: 'مشتركين في كفالة', value: usersStatus.subscribedUsers, percent: subscribedPercent, color: '#00549A' },
      { name: 'غير مشتركين في كفالة', value: usersStatus.nonSubscribedUsers, percent: nonSubscribedPercent, color: '#EEF3FB' },
    ];
  }, [usersStatus]);

  // Memoize sponsorship distribution chart data
  const sponsorshipChartData = useMemo(() => {
    console.log('sponsorshipStats:', sponsorshipStats);
    if (!sponsorshipStats?.topSponsorships || !Array.isArray(sponsorshipStats.topSponsorships)) {
      return [];
    }
    return sponsorshipStats.topSponsorships.map((s) => ({
      name: s.title,
      value: s.collectedAmount,
    }));
  }, [sponsorshipStats]);

  if (isFinancialLoading || isMonthlyLoading || isUsersLoading || isSponsorshipLoading) {
    return (
      <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isFinancialError || isMonthlyError || isUsersError || isSponsorshipError) {
    return (
      <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="font-[Cairo] text-[#F04930] text-xl">حدث خطأ أثناء تحميل البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Charts Section 1: Line Chart */}
      <RevenueChart data={monthlyChartData} />

      {/* Row 3: User Status and Case Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <UserStatusChart data={userStatusChartData} />
        <SponsorshipDistributionChart data={sponsorshipChartData} />
      </div>

      {/* Row 4: Distribution Pie (Assuming it's similar to Row 3) */}
      <PaymentMethodChart />
    </div>
  );
};

export default AdminDashboard;

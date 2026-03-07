import { LayoutDashboard, HandHeart, Users, Wallet } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatCard } from './StatCard';
import { DonationsChart } from './DonationsChart';
import { SponsorshipTypesChart } from './SponsorshipTypesChart';
import { PaymentMethodsChart } from './PaymentMethodsChart';
import { AppUsersChart } from './AppUsersChart';

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardData();

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <LayoutDashboard className="h-4 w-4 text-primary" />
          <span>لوحة التحكم الرئيسية</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          نظرة عامة على أداء التبرعات
        </h1>
        <p className="text-sm text-muted-foreground">
          متابعة لحظية للتبرعات، الكفالات، والحالات العاجلة عبر فروع الجمعية.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          جاري تحميل بيانات لوحة التحكم...
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          حدث خطأ أثناء تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.
        </div>
      )}

      {data && !isLoading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.stats.map((stat) => {
              let icon;
              if (stat.id === 'total-donations') {
                icon = <Wallet className="h-4 w-4" />;
              } else if (stat.id === 'active-sponsorships') {
                icon = <HandHeart className="h-4 w-4" />;
              } else {
                icon = <Users className="h-4 w-4" />;
              }

              return (
                <StatCard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  trendPercent={stat.trendPercent}
                  helperText={stat.helperText}
                  icon={icon}
                />
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DonationsChart data={data.monthlyDonations} />
            </div>
            <div>
              <AppUsersChart data={data.appUsers} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SponsorshipTypesChart data={data.sponsorshipTypes} />
            </div>
            <div>
              <PaymentMethodsChart data={data.paymentMethods} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';

export function AdminAnalyticsPage() {
  const { data, isLoading, isError } = useAdminAnalytics();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة تحليلات الإدارة</h1>
        <p className="text-sm text-muted-foreground">
          مؤشرات أداء رئيسية وتحليلات متقدمة لسلوك المتبرعين على مستوى الفروع.
        </p>
      </div>

      {isError && !isLoading && (
        <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          حدث خطأ أثناء تحميل بيانات التحليلات.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {data?.kpis.map((kpi) => {
          const isPositive = kpi.changePercent >= 0;
          return (
            <Card key={kpi.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-slate-500">
                  {kpi.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between pt-0">
                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.changePercent).toFixed(1)}%
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            توزيع التبرعات على مدار الأسبوع
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-0">
          {isLoading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              جاري تحميل الرسم البياني...
            </div>
          )}
          {data && !isLoading && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.dailyDonations}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v / 1000}k`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0F766E"
                  strokeWidth={2.4}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


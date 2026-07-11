import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ChevronDown, Loader2 } from 'lucide-react';

interface SponsorshipDistributionChartProps {
  data: { name: string; value: number }[];
  /** When supplied, an inline period selector is rendered inside the card header */
  period?: number;
  onPeriodChange?: (period: number) => void;
  isLoading?: boolean;
}

const PERIOD_OPTIONS = [
  { value: 1, label: 'آخر أسبوع' },
  { value: 2, label: 'آخر شهر' },
  { value: 3, label: 'آخر 6 أشهر' },
  { value: 4, label: 'آخر سنة' },
  { value: 5, label: 'كل الأوقات' },
];

// Function to truncate long text
const truncateText = (text: string, maxLength: number = 15) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Custom angled tick component
const AngledTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="end"
        transform="rotate(-35)"
        fill="#94a3b8"
        fontSize={10}
        fontFamily="Cairo"
      >
        {truncateText(payload.value, 10)}
      </text>
    </g>
  );
};

const BAR_CHART_MARGIN = { top: 12, right: 8, left: 16, bottom: 40 };
const TICK_STYLE = { fill: '#94a3b8', fontSize: 10, fontFamily: 'Cairo' };
const TOOLTIP_STYLE = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
  direction: 'rtl' as const,
};

const SponsorshipDistributionChart: React.FC<SponsorshipDistributionChartProps> = ({
  data,
  period,
  onPeriodChange,
  isLoading = false,
}) => {
  const hasOwnFilter = period !== undefined && onPeriodChange !== undefined;

  const chartData = (data ?? [])
    .map((item) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }))
    .reverse();

  return (
    <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
      <CardHeader className="pt-6 px-6 md:pt-8 md:px-8 pb-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-[Cairo] font-bold text-base md:text-lg text-[#101727] text-right">
            توزيع أنواع الكفالات
          </CardTitle>

          {/* Inline period selector — only rendered when props are supplied (ReportsPage) */}
          {hasOwnFilter && (
            <div className="relative flex-shrink-0">
              <select
                className="pr-3 pl-8 py-1.5 rounded-xl border border-gray-100 bg-[#f8fafc] appearance-none font-[Cairo] text-xs font-semibold text-[#697282] focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A]/30 transition-all cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                value={period}
                onChange={(e) => onPeriodChange(Number(e.target.value))}
                disabled={isLoading}
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[#697282] pointer-events-none"
                size={13}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 relative">
        {/* Loading overlay — animates over the chart while refetching */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-b-3xl backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="animate-spin text-[#00549A]" />
              <span className="font-[Cairo] text-xs text-[#697282]">جاري التحديث...</span>
            </div>
          </div>
        )}

        {chartData.length === 0 && !isLoading ? (
          <div className="h-[240px] md:h-[280px] flex items-center justify-center text-[#94a3b8] font-[Cairo] text-sm">
            لا توجد بيانات متاحة لعرض التوزيع
          </div>
        ) : (
          <div className="h-[240px] md:h-[280px] min-h-[240px] md:min-h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={BAR_CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={<AngledTick />}
                  interval={0}
                  height={70}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={TICK_STYLE}
                  domain={[0, 'auto']}
                  width={45}
                  tickFormatter={(value: number) => value.toLocaleString()}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => [value.toLocaleString(), 'المبلغ المحصل']}
                  labelFormatter={(label) => `نوع الكفالة: ${label}`}
                />
                <Bar
                  dataKey="value"
                  fill="#F8A492"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                  animationDuration={400}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorshipDistributionChart;

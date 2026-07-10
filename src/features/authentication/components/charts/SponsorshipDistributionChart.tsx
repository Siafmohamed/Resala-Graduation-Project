import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

interface SponsorshipDistributionChartProps {
  data: { name: string; value: number }[];
}

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

const BAR_CHART_MARGIN = { top: 12, right: 8, left: 16, bottom: 40 }; // Increased bottom and left margins
const TICK_STYLE = { fill: '#94a3b8', fontSize: 10, fontFamily: 'Cairo' }; // For YAxis
const TOOLTIP_STYLE = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
  direction: 'rtl' as const,
};

const SponsorshipDistributionChart: React.FC<SponsorshipDistributionChartProps> = ({ data }) => {
  const chartData = (data ?? [])
    .map((item) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }))
    .reverse(); // Fix: reverse for RTL order (biggest on right)

  return (
    <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
      <CardHeader className="pt-6 px-6 md:pt-8 md:px-8 pb-2">
        <CardTitle className="font-[Cairo] font-bold text-base md:text-lg text-[#101727] text-right">
          توزيع أنواع الكفالات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        {chartData.length === 0 ? (
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
                  tick={<AngledTick />} // Use custom angled tick component
                  interval={0} // Fix: force all ticks to show
                  height={70} // Increased height to accommodate angled text
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

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
import type { MonthlyDonationPoint } from '../types/dashboard.types';

interface DonationsChartProps {
  data: MonthlyDonationPoint[];
}

export function DonationsChart({ data }: DonationsChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          تطور التبرعات الشهرية
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) =>
                [`${Number(value ?? 0).toLocaleString()} جنيه`, 'المبلغ'] as [string, string]
              }
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#1B4B8F"
              strokeWidth={2.4}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


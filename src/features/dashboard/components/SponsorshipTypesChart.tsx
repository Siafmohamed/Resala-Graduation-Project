import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import type { SponsorshipTypePoint } from '../types/dashboard.types';

interface SponsorshipTypesChartProps {
  data: SponsorshipTypePoint[];
}

export function SponsorshipTypesChart({ data }: SponsorshipTypesChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          توزيع أنواع الكفالات
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import type { AppUsersPoint } from '../types/dashboard.types';

const COLORS = ['#16A34A', '#E5E7EB'];

interface AppUsersChartProps {
  data: AppUsersPoint[];
}

export function AppUsersChart({ data }: AppUsersChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          مستخدمو التطبيق
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="left" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import type { PaymentMethodPoint } from '../types/dashboard.types';

const COLORS = ['#1B4B8F', '#F97316', '#10B981'];

interface PaymentMethodsChartProps {
  data: PaymentMethodPoint[];
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          طرق الدفع المفضلة
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
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.method} fill={COLORS[index % COLORS.length]} />
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


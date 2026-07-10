import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

interface RevenueChartProps {
  data: { name: string; value: number }[];
}

const CHART_MARGIN = { top: 20, right: 30, left: 0, bottom: 20 };
const TICK_STYLE = { fill: '#94a3b8', fontSize: 11, fontFamily: 'Cairo' };
const TOOLTIP_STYLE = { 
  borderRadius: '16px', 
  border: 'none', 
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', 
  direction: 'rtl' as const 
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => (
  <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
    <CardHeader className="pb-4 pt-6 px-6 md:pt-8 md:px-8">
      <CardTitle className="font-[Cairo] font-bold text-base md:text-lg text-[#101727] text-right">
        اتجاه المبالغ المحصلة شهرياً
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 md:px-8 pb-6 md:pb-8">
      <div className="h-[300px] md:h-[400px] min-h-[300px] md:min-h-[400px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={TICK_STYLE}
              dy={15}
              minTickGap={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={TICK_STYLE}
              tickFormatter={(value) => `${value / 1000}k`}
              width={40}
            />
            <Tooltip 
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ fontFamily: 'Cairo', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#00549A" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#00549A', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#00549A', strokeWidth: 4, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default RevenueChart;

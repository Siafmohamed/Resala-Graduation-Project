import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

interface UserStatusData {
  name: string;
  value: number;
  percent: string;
  color: string;
}

interface UserStatusChartProps {
  data: UserStatusData[];
}

const UserStatusChart: React.FC<UserStatusChartProps> = ({ data }) => (
  <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
    <CardHeader className="pt-6 px-6 md:pt-8 md:px-8 pb-2">
      <CardTitle className="font-[Cairo] font-bold text-base md:text-lg text-[#101727] text-right">
        حالة مستخدمي التطبيق
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 md:p-8 flex flex-col items-center">
      <div className="h-[200px] md:h-[250px] min-h-[200px] md:min-h-[250px] w-full relative min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full mt-4 space-y-4">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-[Cairo] text-[14px] text-[#697282]">{entry.name}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-[Cairo] font-bold text-[14px] text-[#101727]">{entry.value.toLocaleString()}</span>
              <span className="font-[Cairo] text-[12px] text-[#94a3b8]">({entry.percent})</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default UserStatusChart;

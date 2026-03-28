import React from 'react';
import { 
  Users, 
  Wallet,
  Briefcase,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

// ── Mock Data ───────────────────────────────────────────────────────────────

const kpiData = [
  {
    title: 'إجمالي المتبرعين',
    value: '1,247',
    change: '+12.5%',
    isUp: true,
    icon: Users,
    color: '#00549A',
    bgColor: '#EEF3FB',
  },
  {
    title: 'إجمالي الكفالات النشطة',
    value: '856',
    change: '+8.3%',
    isUp: true,
    icon: Briefcase,
    color: '#00549A',
    bgColor: '#EEF3FB',
  },
  {
    title: 'إجمالي المبالغ المحصلة',
    value: '425,000 ج.م',
    change: '+15.2%',
    isUp: true,
    icon: Wallet,
    color: '#00549A',
    bgColor: '#EEF3FB',
  },
];

const lineData = [
  { name: 'يناير', value: 40000 },
  { name: 'فبراير', value: 43000 },
  { name: 'مارس', value: 41000 },
  { name: 'أبريل', value: 46000 },
  { name: 'مايو', value: 49000 },
  { name: 'يونيو', value: 53000 },
  { name: 'يوليو', value: 50000 },
  { name: 'أغسطس', value: 55000 },
  { name: 'سبتمبر', value: 52000 },
  { name: 'أكتوبر', value: 57000 },
  { name: 'نوفمبر', value: 54000 },
  { name: 'ديسمبر', value: 60000 },
];

const barData = [
  { name: 'كفالة أسرة', value: 320 },
  { name: 'كفالة طالب علم', value: 280 },
  { name: 'كفالة يتيم', value: 180 },
  { name: 'كفالة مريض', value: 80 },
];

const paymentData = [
  { name: 'فودافون كاش', value: 50, color: '#74A6D1' },
  { name: 'مندوب', value: 19, color: '#F04930' },
  { name: 'بالفرع', value: 31, color: '#00549A' },
];

const userSponsorshipData = [
  { name: 'مشتركين في كفالة', value: 1024, percent: '36%', color: '#00549A' },
  { name: 'غير مشتركين في كفالة', value: 1823, percent: '64%', color: '#EEF3FB' },
];

// ── Component ───────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...kpiData].reverse().map((kpi, i) => (
          <Card key={i} className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <span className="font-[Cairo] font-medium text-[#697282] text-[13px] mb-1">{kpi.title}</span>
                  <span className="font-[Cairo] font-bold text-[#101727] text-3xl mb-1">{kpi.value}</span>
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#00549A]">
                    <TrendingUp size={14} />
                    <span>{kpi.change}</span>
                    <span className="text-[#94a3b8] font-normal mr-1">عن الشهر الماضي</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl" 
                  style={{ backgroundColor: kpi.bgColor, color: kpi.color }}
                >
                  <kpi.icon size={24} strokeWidth={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section 1: Line Chart */}
      <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
        <CardHeader className="pb-4 pt-8 px-8">
          <CardTitle className="font-[Cairo] font-bold text-lg text-[#101727] text-right">اتجاه المبالغ المحصلة شهرياً</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="h-[400px] min-h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo' }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo' }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', direction: 'rtl' }}
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

      {/* Row 3: User Status and Case Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Status Doughnut */}
        <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
          <CardHeader className="pt-8 px-8 pb-2">
            <CardTitle className="font-[Cairo] font-bold text-lg text-[#101727] text-right">حالة مستخدمي التطبيق</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center">
            <div className="h-[250px] min-h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={userSponsorshipData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {userSponsorshipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-4">
              {userSponsorshipData.map((entry, i) => (
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

        {/* Sponsorship Types Bar Chart */}
        <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
          <CardHeader className="pt-8 px-8 pb-2">
            <CardTitle className="font-[Cairo] font-bold text-lg text-[#101727] text-right">توزيع أنواع الكفالات</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[280px] min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={barData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo' }}
                    domain={[0, 320]}
                    ticks={[0, 80, 160, 240, 320]}
                  />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#F8A492" 
                    radius={[6, 6, 0, 0]} 
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Distribution Pie */}
      <Card className="border-none shadow-[0px_10px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white">
        <CardHeader className="pt-8 px-8 pb-2">
          <CardTitle className="font-[Cairo] font-bold text-lg text-[#101727] text-right">توزيع طرق الدفع</CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center">
          <div className="h-[320px] min-h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`}
                  labelLine={true}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

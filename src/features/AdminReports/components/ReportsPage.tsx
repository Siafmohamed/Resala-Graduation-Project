import { 
  Users, 
  HandCoins, 
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  AlertCircle,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react';
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

// ── Mock Data (Reused from Dashboard) ───────────────────────────────────────

const kpiData = [
  {
    title: 'إجمالي المتبرعين',
    value: '1,247',
    change: '+12.5%',
    isUp: true,
    icon: Users,
    color: '#00549A',
    bgColor: '#e6eff7',
  },
  {
    title: 'إجمالي الحالات النشطة',
    value: '856',
    change: '-2.4%',
    isUp: false,
    icon: LayoutDashboard,
    color: '#F04930',
    bgColor: '#fdeceb',
  },
  {
    title: 'إجمالي المبالغ المحصلة',
    value: '425,000 ج.م',
    change: '+8.2%',
    isUp: true,
    icon: HandCoins,
    color: '#22c55e',
    bgColor: '#e9f9ef',
  },
];

const lineData = [
  { name: 'يناير', value: 35 },
  { name: 'فبراير', value: 38 },
  { name: 'مارس', value: 37 },
  { name: 'أبريل', value: 40 },
  { name: 'مايو', value: 42 },
  { name: 'يونيو', value: 45 },
  { name: 'يوليو', value: 44 },
  { name: 'أغسطس', value: 46 },
  { name: 'سبتمبر', value: 45 },
  { name: 'أكتوبر', value: 48 },
  { name: 'نوفمبر', value: 46 },
  { name: 'ديسمبر', value: 50 },
];

const exportReports = [
  { title: 'تقرير أداء الكفالات', type: 'ملف Excel', icon: FileSpreadsheet },
  { title: 'تقرير اتجاهات الدفع', type: 'ملف PDF', icon: FileText },
  { title: 'تقرير التأخيرات', type: 'ملف Excel', icon: FileSpreadsheet },
];

const insights = [
  { 
    title: 'نمو مستمر في التبرعات', 
    desc: 'شهدت الفترة الأخيرة زيادة بنسبة 12.5% في إجمالي التبرعات مقارنة بالفترة السابقة.',
    color: '#22c55e',
    bgColor: '#e9f9ef',
    icon: TrendingUpIcon
  },
  { 
    title: 'زيادة في قاعدة المتبرعين', 
    desc: 'انضم 48 متبرع جديد خلال الشهر الأخير، مما يعكس نجاح الحملات التسويقية.',
    color: '#00549A',
    bgColor: '#e6eff7',
    icon: Users
  },
  { 
    title: 'توصية: متابعة الحالات المتأخرة', 
    desc: 'هناك 12 حالة تتطلب متابعة عاجلة نظراً لوجود تأخير في سداد مبالغ الكفالة.',
    color: '#F04930',
    bgColor: '#fdeceb',
    icon: AlertCircle
  }
];

// ── Component ───────────────────────────────────────────────────────────────

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">التقارير والإحصائيات</h1>
        <p className="font-[Cairo] font-medium text-[#697282] text-sm">تقارير شاملة لدعم اتخاذ القرار</p>
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <label className="text-xs font-bold text-[#697282] font-[Cairo] mr-1">نوع التقرير</label>
            <div className="relative">
              <select className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-gray-100 bg-[#f8fafc] appearance-none font-[Cairo] text-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10">
                <option>تقارير عامة</option>
                <option>تقارير مالية</option>
                <option>تقارير الكفالات</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-[#697282]" size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <label className="text-xs font-bold text-[#697282] font-[Cairo] mr-1">الفترة الزمنية</label>
            <div className="relative">
              <select className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-gray-100 bg-[#f8fafc] appearance-none font-[Cairo] text-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10">
                <option>آخر 6 شهور</option>
                <option>آخر سنة</option>
                <option>تخصيص...</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-[#697282]" size={16} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards (Imported Design from Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <span className="font-[Cairo] font-semibold text-[#697282] text-sm">{kpi.title}</span>
                  <span className="font-[Cairo] font-bold text-[#101727] text-2xl">{kpi.value}</span>
                  <div className={`flex items-center gap-1 text-xs font-bold ${kpi.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{kpi.change}</span>
                    <span className="text-[#94a3b8] font-normal mr-1">عن الشهر الماضي</span>
                  </div>
                </div>
                <div 
                  className="p-3 rounded-xl" 
                  style={{ backgroundColor: kpi.bgColor, color: kpi.color }}
                >
                  <kpi.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Line Chart (Imported Design from Dashboard) */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="font-[Cairo] font-bold text-lg text-[#101727]">اتجاه المبالغ المحصلة شهرياً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontFamily: 'Cairo', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00549A" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#00549A', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Export Reports Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-[Cairo] font-bold text-lg text-[#101727] mr-1">تصدير التقارير</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exportReports.map((report, i) => (
            <Card key={i} className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl cursor-pointer hover:shadow-md transition-all group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-50 text-[#697282] group-hover:bg-[#e6eff7] group-hover:text-[#00549A] transition-all">
                    <report.icon size={24} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-[Cairo] font-bold text-sm text-[#101727]">{report.title}</span>
                    <span className="font-[Cairo] text-xs text-[#697282]">{report.type}</span>
                  </div>
                </div>
                <FileDown size={20} className="text-[#94a3b8] group-hover:text-[#00549A]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-[Cairo] font-bold text-lg text-[#101727] mr-1">رؤى وتوصيات</h2>
        <div className="flex flex-col gap-4">
          {insights.map((insight, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl border flex items-start gap-4 transition-all"
              style={{ backgroundColor: insight.bgColor, borderColor: `${insight.color}20` }}
            >
              <div className="p-2.5 rounded-lg bg-white shadow-sm" style={{ color: insight.color }}>
                <insight.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-[Cairo] font-bold text-sm" style={{ color: insight.color }}>{insight.title}</h4>
                <p className="font-[Cairo] text-xs text-[#495565] leading-relaxed opacity-90">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

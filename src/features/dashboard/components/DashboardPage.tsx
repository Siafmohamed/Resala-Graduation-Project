import {
  DollarSign,
  Users,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";

// ─── Data ────────────────────────────────────────────────────────────────────

const metricCards = [
  {
    Icon: DollarSign,
    label: "إجمالي المبالغ المحصلة",
    value: "425,000 ج.م",
    change: "+15.2%",
    changeLabel: "عن الشهر الماضي",
    iconBg: "bg-[#dbeafe]",
    iconColor: "text-[#1d4ed8]",
  },
  {
    Icon: HeartHandshake,
    label: "إجمالي الكفالات النشطة",
    value: "856",
    change: "+8.3%",
    changeLabel: "عن الشهر الماضي",
    iconBg: "bg-[#dcfce7]",
    iconColor: "text-[#15803d]",
  },
  {
    Icon: Users,
    label: "إجمالي المتبرعين",
    value: "1,247",
    change: "+12.5%",
    changeLabel: "عن الشهر الماضي",
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
  },
];

const monthlyData = [
  { month: "يناير",  amount: 28000 },
  { month: "فبراير", amount: 32000 },
  { month: "مارس",   amount: 27000 },
  { month: "أبريل",  amount: 38000 },
  { month: "مايو",   amount: 35000 },
  { month: "يونيو",  amount: 42000 },
  { month: "يوليو",  amount: 39000 },
  { month: "أغسطس",  amount: 45000 },
  { month: "سبتمبر", amount: 41000 },
  { month: "أكتوبر", amount: 48000 },
  { month: "نوفمبر", amount: 52000 },
  { month: "ديسمبر", amount: 58000 },
];

const appUsersData = [
  { name: "مشتركين في كفالة",     value: 1024, color: "#00549a" },
  { name: "غير مشتركين في كفالة", value: 1823, color: "#ecf2f8" },
];

const sponsorshipData = [
  { type: "يتيم",      count: 320 },
  { type: "أرملة",     count: 185 },
  { type: "أسرة",      count: 210 },
  { type: "طالب",      count: 141 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatK = (v: number) => (v >= 1000 ? `${v / 1000}k` : String(v));

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 shadow-sm text-sm font-[Cairo]" dir="rtl">
      <p className="text-[#495565] mb-0.5 text-right">{label}</p>
      <p className="text-[#00549a] font-bold text-right">{payload[0].value.toLocaleString("ar-EG")} ج.م</p>
    </div>
  );
};

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#00549a" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-[10px] font-[Cairo]">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

export const MetricsDashboardSection = () => {
  return (
    <div className="flex flex-col w-full items-start gap-6 px-6 py-3.5 bg-gray-50">

      {/* ── Top 3 metric cards ── */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {metricCards.map(({ Icon, label, value, change, changeLabel, iconBg, iconColor }, i) => (
          <Card
            key={i}
            className="bg-[#ecf2f8] rounded-[10px] border border-solid border-[#e2e8f0] shadow-none"
          >
            <CardContent className="pt-[25px] pb-4 px-[25px]">
              <div className="flex items-start gap-4 w-full" dir="rtl">
                {/* Icon badge */}
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={1.75} />
                </div>

                {/* Text content */}
                <div className="flex flex-col items-end gap-1 flex-1 min-w-0">
                  <span className="font-[Cairo] font-normal text-[#495565] text-sm leading-5 whitespace-nowrap">
                    {label}
                  </span>
                  <span className="font-[Cairo] font-bold text-[#101727] text-2xl leading-8 whitespace-nowrap">
                    {value}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-[Cairo] font-normal text-[#697282] text-sm leading-5">
                      {changeLabel}
                    </span>
                    <span className="font-[Cairo] font-normal text-[#00549a] text-sm leading-5 font-semibold">
                      {change}
                    </span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#00549a]" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Monthly collected amounts trend chart ── */}
      <Card className="w-full bg-white rounded-[10px] border border-solid border-[#f2f4f6] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
        <CardHeader className="pt-[25px] pb-0 px-[25px]">
          <CardTitle
            className="font-[Tajawal] font-bold text-[#101727] text-xl leading-7 text-right"
            dir="rtl"
          >
            اتجاه المبالغ المحصلة شهريًا
          </CardTitle>
        </CardHeader>
        <CardContent className="px-[25px] pb-4 pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis
                dataKey="month"
                tick={{ fontFamily: "Cairo, sans-serif", fontSize: 11, fill: "#697282" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatK}
                tick={{ fontFamily: "Cairo, sans-serif", fontSize: 11, fill: "#697282" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip 
                content={<CustomLineTooltip />} 
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#00549a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#00549a", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#00549a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Two side-by-side cards ── */}
      <div className="grid grid-cols-2 gap-6 w-full">

        {/* App users status */}
        <Card className="bg-white rounded-[10px] border border-solid border-[#f2f4f6] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
          <CardHeader className="pt-[25px] pb-0 px-[25px]">
            <CardTitle
              className="font-[Tajawal] font-bold text-[#101727] text-xl leading-7 text-right"
              dir="rtl"
            >
              حالة مستخدمي التطبيق
            </CardTitle>
          </CardHeader>
          <CardContent className="px-[25px] pb-4 pt-4 flex flex-col items-center gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={appUsersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                  strokeWidth={0}
                >
                  {appUsersData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => [v?.toLocaleString("ar-EG") || "0", ""]}
                  contentStyle={{ fontFamily: "Cairo, sans-serif", fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-col gap-3 w-full" dir="rtl">
              {appUsersData.map((item, i) => {
                const total = appUsersData.reduce((s, d) => s + d.value, 0);
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={i} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-[#e2e8f0]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-[Tajawal] font-normal text-[#354152] text-sm leading-5 whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-[Tajawal] font-bold text-[#101727] text-base leading-6 whitespace-nowrap">
                        {item.value.toLocaleString("ar-EG")}
                      </span>
                      <span className="font-[Tajawal] font-normal text-[#697282] text-sm leading-5 whitespace-nowrap">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sponsorship types */}
        <Card className="bg-white rounded-[10px] border border-solid border-[#f2f4f6] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
          <CardHeader className="pt-[25px] pb-0 px-[25px]">
            <CardTitle
              className="font-[Tajawal] font-bold text-[#101727] text-xl leading-7 text-right"
              dir="rtl"
            >
              أنواع الكفالات
            </CardTitle>
          </CardHeader>
          <CardContent className="px-[25px] pb-4 pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={sponsorshipData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                <XAxis
                  dataKey="type"
                  tick={{ fontFamily: "Cairo, sans-serif", fontSize: 12, fill: "#697282" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "Cairo, sans-serif", fontSize: 11, fill: "#697282" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  formatter={(v: any) => [v || "0", "عدد الكفالات"]}
                  contentStyle={{ fontFamily: "Cairo, sans-serif", fontSize: 13 }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="count" fill="#00549a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default MetricsDashboardSection;
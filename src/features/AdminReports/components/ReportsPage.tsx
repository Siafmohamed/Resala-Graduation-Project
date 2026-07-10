import { useState, useMemo, useCallback } from 'react';
import {
  Users,
  HandCoins,
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import {
  useMonthlyDonations,
  useSponsorshipStats,
  useFinancialSummary,
} from '@/features/authentication/hooks/useDashboard';
import RevenueChart from '@/features/authentication/components/charts/RevenueChart';
import SponsorshipDistributionChart from '@/features/authentication/components/charts/SponsorshipDistributionChart';
import { downloadFile } from '@/shared/utils/downloadFile';
import { generateExcelFile, generatePDFFile } from '../utils/generateReportFiles';

type ExportKey = 'sponsorship' | 'monthly' | 'delayed';

// ── Export Reports Component ──────────────────────────────────────────────

const ExportReportCard = ({
  title,
  type,
  icon: Icon,
  onClick,
  isLoading,
  errorMessage,
}: {
  title: string;
  type: string;
  icon: any;
  onClick: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}) => (
  <div className="flex flex-col gap-2">
    <Card
      className={`border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl transition-all group ${
        isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'
      }`}
      onClick={isLoading ? undefined : onClick}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gray-50 text-[#697282] group-hover:bg-[#e6eff7] group-hover:text-[#00549A] transition-all">
            {isLoading ? (
              <Loader2 size={24} strokeWidth={2} className="animate-spin" />
            ) : (
              <Icon size={24} strokeWidth={2} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-[Cairo] font-bold text-sm text-[#101727]">
              {title}
            </span>
            <span className="font-[Cairo] text-xs text-[#697282]">{type}</span>
          </div>
        </div>
        {isLoading ? (
          <Loader2 size={20} className="animate-spin text-[#94a3b8]" />
        ) : (
          <FileDown
            size={20}
            className="text-[#94a3b8] group-hover:text-[#00549A]" />
        )}
      </CardContent>
    </Card>
    {errorMessage && (
      <p className="font-[Cairo] text-xs text-[#F04930] px-1">{errorMessage}</p>
    )}
  </div>
);

// ── KPI Cards Component ─────────────────────────────────────────────

interface KPIData {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
}

const KPICards = ({ data }: { data: KPIData[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {data.map((kpi, i) => (
      <Card
        key={i}
        className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-[Cairo] font-semibold text-[#697282] text-sm">
                {kpi.title}
              </span>
              <span className="font-[Cairo] font-bold text-[#101727] text-2xl">
                {kpi.value}
              </span>
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
);

// ── Component ─────────────────────────────────────────────────────

export function ReportsPage() {
  const [period, setPeriod] = useState<number>(2); // Default to last month
  const [loadingStates, setLoadingStates] = useState<Record<ExportKey, boolean>>({
    sponsorship: false,
    monthly: false,
    delayed: false,
  });
  const [exportErrors, setExportErrors] = useState<Partial<Record<ExportKey, string>>>({});

  const {
    data: monthlyDonations,
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
  } = useMonthlyDonations({ period });

  const {
    data: sponsorshipStats,
    isLoading: isSponsorshipLoading,
    isError: isSponsorshipError,
  } = useSponsorshipStats({ period });

  const {
    data: financialSummary,
    isLoading: isFinancialLoading,
    isError: isFinancialError,
  } = useFinancialSummary();

  // Memoize KPI data from financial summary
  const kpiData = useMemo((): KPIData[] => {
    if (!financialSummary) {
      return [
        {
          title: 'إجمالي الحالات النشطة',
          value: '0',
          icon: LayoutDashboard,
          color: '#00549A',
          bgColor: '#e6eff7',
        },
        {
          title: 'إجمالي المتبرعين',
          value: '0',
          icon: Users,
          color: '#F04930',
          bgColor: '#fdeceb',
        },
        {
          title: 'إجمالي المبالغ المحصلة',
          value: '0 ج.م',
          icon: HandCoins,
          color: '#22c55e',
          bgColor: '#e9f9ef',
        },
      ];
    }
    return [
      {
        title: 'إجمالي الحالات النشطة',
        value: financialSummary.totalActiveSponsors.toLocaleString(),
        icon: LayoutDashboard,
        color: '#00549A',
        bgColor: '#e6eff7',
      },
      {
        title: 'إجمالي المتبرعين',
        value: financialSummary.totalUsers.toLocaleString(),
        icon: Users,
        color: '#F04930',
        bgColor: '#fdeceb',
      },
      {
        title: 'إجمالي المبالغ المحصلة',
        value: `${financialSummary.totalCollectedRevenue?.toLocaleString() ?? '0'} ج.م`,
        icon: HandCoins,
        color: '#22c55e',
        bgColor: '#e9f9ef',
      },
    ];
  }, [financialSummary]);

  // Memoize monthly chart data
  const monthlyChartData = useMemo(() => {
    if (!monthlyDonations) {
      return [];
    }
    return monthlyDonations.map((item) => ({
      name: item.month,
      value: item.amount,
    }));
  }, [monthlyDonations]);

  // Memoize sponsorship chart data
  const sponsorshipChartData = useMemo(() => {
    if (!sponsorshipStats?.topSponsorships) {
      return [];
    }
    return sponsorshipStats.topSponsorships.map((s) => ({
      name: s.title,
      value: s.collectedAmount,
    }));
  }, [sponsorshipStats]);

  const generateSponsorshipReport = useCallback(() => {
    if (!sponsorshipStats?.topSponsorships?.length) {
      throw new Error('لا توجد بيانات لتحميل التقرير');
    }

    const data = sponsorshipStats.topSponsorships.map((item) => ({
      'العنوان': item.title,
      'المبلغ المحصّل': item.collectedAmount,
      'المبلغ المستهدف': item.targetAmount,
      'عدد المتبرعين': item.donorsCount,
    }));

    generateExcelFile(data, 'تقرير أداء الكفالات.xlsx');
  }, [sponsorshipStats]);

  const generateMonthlyReport = useCallback(() => {
    if (!monthlyDonations?.length) {
      throw new Error('لا توجد بيانات لتحميل التقرير');
    }

    const data = monthlyDonations.map((item) => ({
      'الشهر': item.month,
      'المبلغ': item.amount,
      'عدد الدفعات': item.paymentsCount,
    }));

    generatePDFFile(
      data,
      ['الشهر', 'المبلغ', 'عدد الدفعات'],
      'تقرير اتجاه الدفع.pdf',
      'تقرير اتجاه الدفع',
    );
  }, [monthlyDonations]);

  const generateDelayedPaymentsReport = useCallback(() => {
    if (!financialSummary) {
      throw new Error('لا توجد بيانات لتحميل التقرير');
    }

    const data = [
      {
        'المبلغ المتبقي': financialSummary.totalRemainingRevenue,
        'المستخدمون المتأخرون': financialSummary.usersWithDelayedPayments,
      },
    ];

    generateExcelFile(data, 'تقرير التأخيرات.xlsx');
  }, [financialSummary]);

  const runExport = useCallback(
    async (
      key: ExportKey,
      url: string,
      filename: string,
      expectedType: 'excel' | 'pdf',
      fallback: () => void,
    ) => {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));
      setExportErrors((prev) => ({ ...prev, [key]: undefined }));

      try {
        await downloadFile(url, filename, expectedType);
        toast.success('تم تحميل التقرير بنجاح');
      } catch (error) {
        console.error(`[ReportsPage] Export failed for ${key}:`, error);

        try {
          fallback();
          toast.success('تم إنشاء التقرير من البيانات المحملة');
        } catch (fallbackError) {
          const message =
            fallbackError instanceof Error
              ? fallbackError.message
              : error instanceof Error
                ? error.message
                : 'فشل تحميل التقرير';

          setExportErrors((prev) => ({ ...prev, [key]: message }));
          toast.error(message);
        }
      } finally {
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    },
    [],
  );

  const downloadSponsorshipReport = () => {
    void runExport(
      'sponsorship',
      `/v1/admin/dashboard/sponsorships-stats/export?period=${period}`,
      'تقرير أداء الكفالات.xlsx',
      'excel',
      generateSponsorshipReport,
    );
  };

  const downloadMonthlyReport = () => {
    void runExport(
      'monthly',
      `/v1/admin/dashboard/monthly-donations/export?period=${period}`,
      'تقرير اتجاه الدفع.pdf',
      'pdf',
      generateMonthlyReport,
    );
  };

  const downloadDelayedPaymentsReport = () => {
    void runExport(
      'delayed',
      '/v1/staff/dashboard/financial-summary/export',
      'تقرير التأخيرات.xlsx',
      'excel',
      generateDelayedPaymentsReport,
    );
  };

  if (isFinancialLoading || isMonthlyLoading || isSponsorshipLoading) {
    return (
      <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isFinancialError || isMonthlyError || isSponsorshipError) {
    return (
      <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="font-[Cairo] text-[#F04930] text-xl">
            حدث خطأ أثناء تحميل البيانات
          </p>
        </div>
      </div>
      );
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Period Filter */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <label className="text-xs font-bold text-[#697282] font-[Cairo] mr-1">
              الفترة الزمنية
            </label>
            <div className="relative">
              <select
                className="w-full pr-4 pl-10 py-2.5 rounded-xl border border-gray-100 bg-[#f8fafc] appearance-none font-[Cairo] text-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                <option value={1}>اخر اسبوع</option>
                <option value={2}>اخر الشهر</option>
                <option value={3}>اخر 6 شهور</option>
                <option value={4}>اخر السنه</option>
                <option value={5}>كل الاوقات</option>
              </select>
              <ChevronDown
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#697282]"
                size={16}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Line Chart */}
      <RevenueChart data={monthlyChartData} />

      {/* Sponsorship performance chart */}
      <SponsorshipDistributionChart data={sponsorshipChartData} />

      {/* Export Reports Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-[Cairo] font-bold text-lg text-[#101727] mr-1">
          تصدير التقارير
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExportReportCard
            title="تقرير أداء الكفالات"
            type="ملف Excel"
            icon={FileSpreadsheet}
            onClick={downloadSponsorshipReport}
            isLoading={loadingStates.sponsorship}
            errorMessage={exportErrors.sponsorship}
          />
          <ExportReportCard
            title="تقرير اتجاه الدفع"
            type="ملف PDF"
            icon={FileText}
            onClick={downloadMonthlyReport}
            isLoading={loadingStates.monthly}
            errorMessage={exportErrors.monthly}
          />
          <ExportReportCard
            title="تقرير التأخيرات"
            type="ملف Excel"
            icon={FileSpreadsheet}
            onClick={downloadDelayedPaymentsReport}
            isLoading={loadingStates.delayed}
            errorMessage={exportErrors.delayed}
          />
        </div>
      </div>

      {/* New Summary Cards from Image */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-[Cairo] font-bold text-2xl text-[#101727] text-center">
            رؤى وتوصيات
          </h2>
        </div>
        <div className="flex flex-col gap-6">
        {/* نمو مستمر في التبرعات */}
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-[#e6f9ee]">
          <CardContent className="p-6 flex items-center justify-between">
            {/* Description on RIGHT */}
            <div className="flex flex-col gap-2">
              <p className="font-[Cairo] text-sm text-[#64748b]">
                شهدت الفترة الأخيرة زيادة بنسبة 12.5% في إجمالي التبرعات مقارنة بالفترة السابقة.
              </p>
            </div>
            {/* Title + Icon on LEFT */}
            <div className="flex items-center gap-4">
              <h3 className="font-[Cairo] font-bold text-xl text-[#15803d]">
                نمو مستمر في التبرعات
              </h3>
              <div className="p-3 rounded-xl bg-white text-[#15803d] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* زيادة في قاعدة المتبرعين */}
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-[#e0effd]">
          <CardContent className="p-6 flex items-center justify-between">
            {/* Description on RIGHT */}
            <div className="flex flex-col gap-2">
              <p className="font-[Cairo] text-sm text-[#64748b]">
                انضم 48 متبرع جديد خلال الشهر الأخير، مما يعكس نجاح الحملات التسويقية.
              </p>
            </div>
            {/* Title + Icon on LEFT */}
            <div className="flex items-center gap-4">
              <h3 className="font-[Cairo] font-bold text-xl text-[#0369a1]">
                زيادة في قاعدة المتبرعين
              </h3>
              <div className="p-3 rounded-xl bg-white text-[#0369a1] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6"/>
                  <path d="M23 11h-6"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* توصية: متابعة الحالات المتأخرة */}
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-[#ffe8e8]">
          <CardContent className="p-6 flex items-center justify-between">
            {/* Description on RIGHT */}
            <div className="flex flex-col gap-2">
              <p className="font-[Cairo] text-sm text-[#64748b]">
                هناك 12 حالة تتطلب متابعة عاجلة نظراً لوجود تأخر في سداد مبالغ الكفالة.
              </p>
            </div>
            {/* Title + Icon on LEFT */}
            <div className="flex items-center gap-4">
              <h3 className="font-[Cairo] font-bold text-xl text-[#dc2626]">
                توصية: متابعة الحالات المتأخرة
              </h3>
              <div className="p-3 rounded-xl bg-white text-[#dc2626] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

    </div>
  );
}

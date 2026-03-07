import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/formatters';
import { useAdminReports } from '../hooks/useAdminReports';

export function AdminReportsPage() {
  const { data, isLoading, isError } = useAdminReports();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">تقارير الإدارة</h1>
          <p className="text-sm text-muted-foreground">
            إنشاء وتحميل تقارير مالية وإحصائية مفصلة عن أداء التبرعات.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90">
          إنشاء تقرير جديد
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              تقارير تم توليدها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-slate-900">
              {data?.generatedReports ?? (isLoading ? '...' : 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              تقارير قيد التصدير
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-slate-900">
              {data?.pendingExports ?? (isLoading ? '...' : 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              آخر تقرير تم توليده
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-800">
              {data?.lastGeneratedAt ?? (isLoading ? '...' : 'لا يوجد')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">ملخص التقارير</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات التقارير...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات التقارير.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">رقم التقرير</th>
                    <th className="px-3 py-2">عنوان التقرير</th>
                    <th className="px-3 py-2">الفترة</th>
                    <th className="px-3 py-2">إجمالي التبرعات</th>
                    <th className="px-3 py-2">عدد التبرعات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {row.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {row.period}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(row.totalAmount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {row.donationsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


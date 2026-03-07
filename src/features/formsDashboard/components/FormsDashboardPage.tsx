import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useFormStats } from '../hooks/useFormStats';

export function FormsDashboardPage() {
  const { data, isLoading, isError } = useFormStats();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة متابعة النماذج</h1>
        <p className="text-sm text-muted-foreground">
          مراقبة أداء نماذج التسجيل الإلكترونية ومعدلات الإكمال اليومية والشهرية.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">إحصائيات النماذج</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات النماذج...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات النماذج.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">اسم النموذج</th>
                    <th className="px-3 py-2">إدخالات اليوم</th>
                    <th className="px-3 py-2">إدخالات هذا الشهر</th>
                    <th className="px-3 py-2">معدل الإكمال</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((f) => (
                    <tr key={f.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="px-3 py-2 font-medium text-slate-900">{f.name}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {f.todaySubmissions}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {f.monthSubmissions}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {f.completionRate}%
                        </span>
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


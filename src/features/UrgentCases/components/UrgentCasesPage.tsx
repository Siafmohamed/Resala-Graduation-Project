import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/formatters';
import { useUrgentCases } from '../hooks/useUrgentCases';

export function UrgentCasesPage() {
  const { data, isLoading, isError } = useUrgentCases();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">الحالات العاجلة</h1>
        <p className="text-sm text-muted-foreground">
          متابعة أولويات جمع التبرعات للحالات العاجلة ذات الأولوية المرتفعة.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة الحالات العاجلة</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات الحالات...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات الحالات.
            </div>
          )}

          {data && !isLoading && data.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              لا توجد حالات عاجلة حالياً
            </div>
          )}

          {data && !isLoading && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">عنوان الحالة</th>
                    <th className="px-3 py-2">الوصف</th>
                    <th className="px-3 py-2">المبلغ المستهدف</th>
                    <th className="px-3 py-2">المبلغ المحصّل</th>
                    <th className="px-3 py-2">الحالة</th>
                    <th className="px-3 py-2">تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="px-3 py-2 font-medium text-slate-900">{c.title}</td>
                      <td className="px-3 py-2 text-slate-700 max-w-xs truncate">{c.description}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(c.targetAmount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(c.collectedAmount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            c.isActive
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'inline-flex rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700'
                          }
                        >
                          {c.isActive ? 'نشطة' : 'غير نشطة'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {new Date(c.createdOn).toLocaleDateString('ar-EG')}
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

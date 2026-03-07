import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useSponsorshipCases } from '../hooks/useSponsorshipCases';
import { formatNumber } from '@/shared/utils/formatters';

export function SponsorshipManagementPage() {
  const { data, isLoading, isError } = useSponsorshipCases();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة حالات الكفالة</h1>
          <p className="text-sm text-muted-foreground">
            متابعة جميع حالات الكفالة النشطة والمعلقة ومراقبة المدفوعات الشهرية.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90">
          إضافة حالة كفالة جديدة
        </button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة حالات الكفالة</CardTitle>
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

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">رقم الحالة</th>
                    <th className="px-3 py-2">اسم المتبرع</th>
                    <th className="px-3 py-2">اسم الحالة</th>
                    <th className="px-3 py-2">نوع الكفالة</th>
                    <th className="px-3 py-2">القسط الشهري</th>
                    <th className="px-3 py-2">تاريخ البدء</th>
                    <th className="px-3 py-2">الاستحقاق القادم</th>
                    <th className="px-3 py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                        {item.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {item.donorName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {item.caseName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                          {item.category === 'orphan' && 'كفالة يتيم'}
                          {item.category === 'family' && 'كفالة أسرة'}
                          {item.category === 'student' && 'كفالة طالب'}
                          {item.category === 'medical' && 'حالة طبية'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(item.monthlyAmount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {item.startDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {item.nextDueDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            item.status === 'active'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : item.status === 'pending'
                              ? 'inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
                              : item.status === 'completed'
                              ? 'inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700'
                              : 'inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700'
                          }
                        >
                          {item.status === 'active' && 'نشطة'}
                          {item.status === 'pending' && 'في الانتظار'}
                          {item.status === 'completed' && 'مكتملة'}
                          {item.status === 'paused' && 'موقوفة مؤقتاً'}
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


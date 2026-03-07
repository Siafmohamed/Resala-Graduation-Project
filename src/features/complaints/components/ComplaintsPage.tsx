import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useComplaints } from '../hooks/useComplaints';

export function ComplaintsPage() {
  const { data, isLoading, isError } = useComplaints();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">شكاوى واقتراحات</h1>
        <p className="text-sm text-muted-foreground">
          متابعة الشكاوى والاقتراحات الواردة من المتبرعين والمستفيدين والمندوبين.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            قائمة الشكاوى والاقتراحات
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات الشكاوى...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات الشكاوى.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">رقم الشكوى</th>
                    <th className="px-3 py-2">صاحب الشكوى</th>
                    <th className="px-3 py-2">مصدر الشكوى</th>
                    <th className="px-3 py-2">الموضوع</th>
                    <th className="px-3 py-2">تاريخ الإنشاء</th>
                    <th className="px-3 py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                        {c.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {c.complainantName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {c.source === 'donor' && 'متبرع'}
                        {c.source === 'beneficiary' && 'مستفيد'}
                        {c.source === 'representative' && 'مندوب'}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{c.subject}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {c.createdAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            c.status === 'new'
                              ? 'inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700'
                              : c.status === 'in_review'
                              ? 'inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
                              : c.status === 'resolved'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700'
                          }
                        >
                          {c.status === 'new' && 'جديدة'}
                          {c.status === 'in_review' && 'قيد المراجعة'}
                          {c.status === 'resolved' && 'تم الحل'}
                          {c.status === 'closed' && 'مغلقة'}
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


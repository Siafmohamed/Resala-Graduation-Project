import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/formatters';
import { useReceipts } from '../hooks/useReceipts';

export function ReceiptVerificationPage() {
  const { data, isLoading, isError } = useReceipts();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مراجعة التحويلات</h1>
          <p className="text-sm text-muted-foreground">
            مراجعة وإثبات التحويلات المالية الواردة من المتبرعين قبل اعتمادها في النظام.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          تحديث قائمة التحويلات
        </button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة التحويلات</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات التحويلات...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات التحويلات.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">رقم التحويل</th>
                    <th className="px-3 py-2">اسم المتبرع</th>
                    <th className="px-3 py-2">المبلغ</th>
                    <th className="px-3 py-2">طريقة الدفع</th>
                    <th className="px-3 py-2">وقت الاستلام</th>
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
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(item.amount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {item.method === 'vodafone_cash' && 'فودافون كاش'}
                        {item.method === 'instapay' && 'إنستاباي'}
                        {item.method === 'bank' && 'تحويل بنكي'}
                        {item.method === 'branch' && 'سداد بالفرع'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {item.receivedAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            item.status === 'pending'
                              ? 'inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
                              : item.status === 'verified'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700'
                          }
                        >
                          {item.status === 'pending' && 'في الانتظار'}
                          {item.status === 'verified' && 'تم الاعتماد'}
                          {item.status === 'rejected' && 'مرفوض'}
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


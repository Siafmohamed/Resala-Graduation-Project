import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/formatters';
import { useBranchPayments } from '../hooks/useBranchPayments';

export function BranchPaymentsPage() {
  const { data, isLoading, isError } = useBranchPayments();

  const totalAmount =
    data?.reduce((sum, p) => {
      return sum + p.amount;
    }, 0) ?? 0;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">مدفوعات الفروع</h1>
        <p className="text-sm text-muted-foreground">
          مراجعة وتسوية المدفوعات اليومية الواردة من الفروع المختلفة.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-slate-500">
            إجمالي المدفوعات المعروضة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-2xl font-bold text-slate-900">
            {formatNumber(totalAmount)} جنيه
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة مدفوعات الفروع</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات المدفوعات...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات المدفوعات.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">الفرع</th>
                    <th className="px-3 py-2">أمين الخزينة</th>
                    <th className="px-3 py-2">المبلغ</th>
                    <th className="px-3 py-2">تاريخ السداد</th>
                    <th className="px-3 py-2">مرجع الدفتر / الإيصالات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {p.branchName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {p.cashierName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {formatNumber(p.amount)} جنيه
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {p.paymentDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {p.reference}
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


import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useRepresentativeOrders } from '../hooks/useRepresentativeOrders';

export function RepresentativeOrdersPage() {
  const { data, isLoading, isError } = useRepresentativeOrders();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">طلبات المندوبين</h1>
          <p className="text-sm text-muted-foreground">
            متابعة طلبات تسليم واستلام التبرعات للمندوبين حسب المناطق.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          إضافة طلب جديد
        </button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات الطلبات...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات الطلبات.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">رقم الطلب</th>
                    <th className="px-3 py-2">اسم المندوب</th>
                    <th className="px-3 py-2">المنطقة</th>
                    <th className="px-3 py-2">عدد الإيصالات</th>
                    <th className="px-3 py-2">تاريخ الإنشاء</th>
                    <th className="px-3 py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((order) => (
                    <tr key={order.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {order.representativeName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {order.area}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {order.itemsCount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {order.createdAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            order.status === 'new'
                              ? 'inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700'
                              : order.status === 'in_progress'
                              ? 'inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
                              : order.status === 'completed'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700'
                          }
                        >
                          {order.status === 'new' && 'جديد'}
                          {order.status === 'in_progress' && 'قيد التنفيذ'}
                          {order.status === 'completed' && 'مكتمل'}
                          {order.status === 'cancelled' && 'ملغى'}
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


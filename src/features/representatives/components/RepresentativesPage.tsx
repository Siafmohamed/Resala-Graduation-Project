import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useRepresentatives } from '../hooks/useRepresentatives';

export function RepresentativesPage() {
  const { data, isLoading, isError } = useRepresentatives();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">إدارة المندوبين</h1>
        <p className="text-sm text-muted-foreground">
          عرض حالة المندوبين وتوزيع الحالات النشطة على المناطق المختلفة.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">قائمة المندوبين</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات المندوبين...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات المندوبين.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">اسم المندوب</th>
                    <th className="px-3 py-2">رقم الهاتف</th>
                    <th className="px-3 py-2">المنطقة</th>
                    <th className="px-3 py-2">حالات نشطة</th>
                    <th className="px-3 py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((rep) => (
                    <tr key={rep.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {rep.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {rep.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {rep.area}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-900">
                        {rep.activeCases}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            rep.status === 'active'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700'
                          }
                        >
                          {rep.status === 'active' ? 'نشط' : 'غير نشط'}
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


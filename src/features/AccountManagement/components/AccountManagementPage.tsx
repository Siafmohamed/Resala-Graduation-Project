import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ROLE_LABELS_AR } from '@/features/authentication';
import { useAccounts } from '../hooks/useAccounts';
import type { Role } from '@/features/authentication/types/role.types';

export function AccountManagementPage() {
  const { data, isLoading, isError } = useAccounts();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة حسابات المستخدمين</h1>
          <p className="text-sm text-muted-foreground">
            عرض وتحديث صلاحيات المستخدمين العاملين على النظام.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90">
          إنشاء حساب جديد
        </button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">حسابات النظام</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل بيانات الحسابات...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              حدث خطأ أثناء تحميل بيانات الحسابات.
            </div>
          )}

          {data && !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">المستخدم</th>
                    <th className="px-3 py-2">البريد الإلكتروني</th>
                    <th className="px-3 py-2">اسم المستخدم</th>
                    <th className="px-3 py-2">الدور</th>
                    <th className="px-3 py-2">الحالة</th>
                    <th className="px-3 py-2">آخر تسجيل دخول</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr key={user.id} className="rounded-md bg-white text-sm shadow-sm">
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {user.fullName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                          {ROLE_LABELS_AR[user.role as Role]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={
                            user.status === 'active'
                              ? 'inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : user.status === 'inactive'
                              ? 'inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700'
                              : 'inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700'
                          }
                        >
                          {user.status === 'active' && 'نشط'}
                          {user.status === 'inactive' && 'غير نشط'}
                          {user.status === 'locked' && 'مقفول'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {user.lastLoginAt}
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


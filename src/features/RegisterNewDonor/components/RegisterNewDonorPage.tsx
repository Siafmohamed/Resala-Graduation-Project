import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { AddDonorForm } from '@/features/donors/components/AddDonorForm';

export function RegisterNewDonorPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">تسجيل متبرع جديد</h1>
        <p className="text-sm text-muted-foreground">
          إدخال بيانات المتبرع الجديد وربطها بنوع الكفالة المناسب حسب تعليمات الاستقبال.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">بيانات المتبرع</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AddDonorForm />
        </CardContent>
      </Card>
    </div>
  );
}


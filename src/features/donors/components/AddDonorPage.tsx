import { AddDonorForm } from './AddDonorForm';

export function AddDonorPage() {
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-2">إضافة متبرع جديد</h1>
      <p className="text-muted-foreground mb-6">
        تسجيل متبرع جديد في النظام
      </p>
      <AddDonorForm />
    </div>
  );
}

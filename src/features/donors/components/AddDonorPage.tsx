import { AddDonorForm } from './AddDonorForm';
import { Info } from 'lucide-react';

export function AddDonorPage() {
  return (
    <div className="flex flex-col gap-8 p-10 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header with Profile and Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50 text-[#00549A]">
            <Info size={20} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-[Cairo] font-bold text-sm text-[#101727]">أحمد السيد</span>
            <span className="font-[Cairo] text-[11px] text-[#697282]">موظف استقبال</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إضافة متبرع جديد</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm opacity-70">تسجيل متبرع جديد في النظام</p>
        </div>
      </div>

      <div className="flex justify-center">
        <AddDonorForm />
      </div>
    </div>
  );
}

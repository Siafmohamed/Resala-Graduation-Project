import { 
  LayoutDashboard,
} from 'lucide-react';
import PendingPaymentsDashboard from '@/features/PendingPayments/components/PendingPaymentsDashboard';

const ReceptionDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-10" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[#00549A] mb-1">
            <LayoutDashboard size={20} />
            <span className="font-[Cairo] font-bold text-xs uppercase tracking-wider">لوحة التحكم</span>
          </div>
          <h1 className="font-[Cairo] font-bold text-3xl text-[#101727]">مرحباً بك، موظف الاستقبال</h1>
          <p className="font-[Cairo] text-[#697282] text-sm">إليك ملخص سريع لنشاط الجمعية اليوم</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-6">
        <PendingPaymentsDashboard />
      </div>
    </div>
  );
};

export default ReceptionDashboard;

import { 
  LayoutDashboard,
} from 'lucide-react';
import PendingPaymentsDashboard from '@/features/PendingPayments/components/PendingPaymentsDashboard';

const ReceptionDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-10" dir="rtl">
      {/* Main Content Area */}
      <div className="mx-6">
        <PendingPaymentsDashboard />
      </div>
    </div>
  );
};

export default ReceptionDashboard;

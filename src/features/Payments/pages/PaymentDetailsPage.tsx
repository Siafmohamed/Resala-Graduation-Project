import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePaymentDetails } from '../hooks/usePayments';
import { UnifiedPaymentDetails } from '../components/details/UnifiedPaymentDetails';
import { FullPageSpinner } from '@/features/authentication/components/FullPageSpinner';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import type { PaymentType } from '../types/payments.types';

export default function PaymentDetailsPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const id = Number(paymentId);
  
  // Determine type from URL path
  const paymentType: PaymentType = location.pathname.includes('emergency') 
    ? 'emergency' 
    : 'subscription';

  const { data: payment, isLoading, isError } = usePaymentDetails(paymentType, id);

  if (isLoading) return <FullPageSpinner />;
  
  if (isError || !payment) {
    return (
      <div className="p-8">
        <ErrorMessage error="فشل تحميل تفاصيل الدفعة. ربما تم تأكيدها أو رفضها بالفعل." />
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-[#00549A] font-bold font-[Cairo] underline"
        >
          العودة للقائمة
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <UnifiedPaymentDetails 
        payment={payment} 
        paymentType={paymentType} 
      />
    </div>
  );
}

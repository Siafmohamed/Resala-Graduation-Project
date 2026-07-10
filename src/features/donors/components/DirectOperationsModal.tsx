import React, { useState, useEffect } from 'react';
import {
  Plus,
  CreditCard,
  User,
  Calendar,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import {
  useDonorSubscriptions,
  useAllSponsorships,
  useProcessPayment,
  useDirectSubscribe,
} from '../hooks/useDonors';
import type { DonorSubscription } from '../types/donors.types';
import type { SponsorshipProgram } from '@/shared/api/services/sponsorshipService';

interface DirectOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: {
    id: string | number;
    fullName: string;
    phone: string;
  };
}

type OperationType = 'payment' | 'subscribe';
type PaymentType = 'subscription' | 'general';

export const DirectOperationsModal = ({
  isOpen,
  onClose,
  donor,
}: DirectOperationsModalProps) => {
  const [operationType, setOperationType] = useState<OperationType>('payment');
  const [paymentType, setPaymentType] = useState<PaymentType>('subscription');
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  const [selectedSponsorship, setSelectedSponsorship] = useState<number | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<1 | 2 | 3 | 4>(1);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [subscribeAmount, setSubscribeAmount] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: subscriptions = [], isLoading: subscriptionsLoading, error: subscriptionsError } = useDonorSubscriptions(
    donor.id
  );
  const { data: sponsorships = [], isLoading: sponsorshipsLoading } = useAllSponsorships();

  const { mutate: processPayment, isPending: processingPayment } = useProcessPayment();
  const { mutate: directSubscribe, isPending: subscribing } = useDirectSubscribe();

  useEffect(() => {
    if (isOpen) {
      setOperationType('payment');
      setPaymentType('subscription');
      setSelectedSubscription(null);
      setSelectedSponsorship(null);
      setSelectedCycle(1);
      setPaymentAmount('');
      setSubscribeAmount('');
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const amount = Number(paymentAmount);
    if (!paymentAmount || amount <= 0) {
      setErrorMessage('يجب إدخال مبلغ أكبر من صفر');
      return;
    }

    if (paymentType === 'subscription' && !selectedSubscription) {
      setErrorMessage('يجب اختيار اشتراك');
      return;
    }

    // Prepare payload
    const payload: any = {
      donorId: Number(donor.id),
      amount: amount,
    };

    if (paymentType === 'subscription') {
      payload.subscriptionId = selectedSubscription;
    } else {
      // general donation - we'll leave it as is unless API requires specific field
      // The API expects either subscriptionId or generalDonationId
      // For now, we'll just send without those for general donation
    }

    processPayment(payload, {
      onSuccess: () => {
        setSuccessMessage('تمت معالجة الدفعة بنجاح!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 2000);
      },
      onError: (error: any) => {
        console.error('Payment error:', error);
        setErrorMessage(error?.response?.data?.message || 'حدث خطأ أثناء معالجة الدفعة');
      },
    });
  };

  const handleDirectSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const amount = Number(subscribeAmount);
    if (!subscribeAmount || amount <= 0) {
      setErrorMessage('يجب إدخال مبلغ أكبر من صفر');
      return;
    }

    if (!selectedSponsorship) {
      setErrorMessage('يجب اختيار برنامج الكفالة');
      return;
    }

    directSubscribe(
      {
        donorId: Number(donor.id),
        sponsorshipId: selectedSponsorship,
        amount: amount,
        cycle: selectedCycle,
      },
      {
        onSuccess: () => {
          setSuccessMessage('تمت الاشتراك بنجاح!');
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Subscribe error:', error);
          setErrorMessage(error?.response?.data?.message || 'حدث خطأ أثناء الاشتراك');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="العمليات المباشرة" maxWidth="max-w-3xl">
      <div className="p-6" dir="rtl">
        {/* Donor Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {donor.fullName?.charAt(0) || 'م'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">{donor.fullName}</span>
              <span className="text-sm text-gray-500">{donor.phone}</span>
              <span className="text-xs text-gray-400 mt-0.5">معرف المتبرع: #{donor.id}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={20} />
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-700 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Operation Type Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setOperationType('payment')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              operationType === 'payment'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CreditCard size={20} />
            تسوية دفعة
          </button>
          <button
            onClick={() => setOperationType('subscribe')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              operationType === 'subscribe'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Plus size={20} />
            اشتراك جديد
          </button>
        </div>

        {/* Payment Form */}
        {operationType === 'payment' && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            {/* Payment Type Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                نوع الدفعة <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('subscription')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                    paymentType === 'subscription'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  دفعة لاشتراك
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('general')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                    paymentType === 'general'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  تبرع عام
                </button>
              </div>
            </div>

            {/* Subscription Selector - Only if payment type is subscription */}
            {paymentType === 'subscription' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاشتراك <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubscription || ''}
                  onChange={(e) =>
                    setSelectedSubscription(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">اختر الاشتراك</option>
                  {subscriptionsLoading ? (
                    <option disabled>جاري التحميل...</option>
                  ) : subscriptionsError ? (
                    <option disabled>حدث خطأ أثناء تحميل الاشتراكات</option>
                  ) : subscriptions.length === 0 ? (
                    <option disabled>لا توجد اشتراكات لهذا المتبرع</option>
                  ) : (
                    subscriptions.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.sponsorshipTitle || sub.sponsorshipName || 'اشتراك'} - {sub.amount?.toLocaleString() || 0} ج.م
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                المبلغ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="أدخل المبلغ"
                min="1"
                step="0.01"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={processingPayment}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
            >
              {processingPayment ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  جاري المعالجة...
                </div>
              ) : (
                'تسوية الدفعة'
              )}
            </Button>
          </form>
        )}

        {/* Subscribe Form */}
        {operationType === 'subscribe' && (
          <form onSubmit={handleDirectSubscribe} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                برنامج الكفالة <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSponsorship || ''}
                onChange={(e) =>
                  setSelectedSponsorship(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              >
                <option value="">اختر برنامج الكفالة</option>
                {sponsorshipsLoading ? (
                  <option disabled>جاري التحميل...</option>
                ) : (
                  sponsorships.map((sponsorship: any) => (
                    <option key={sponsorship.id} value={sponsorship.id}>
                      {sponsorship.name || sponsorship.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                المبلغ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={subscribeAmount}
                onChange={(e) => setSubscribeAmount(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="أدخل المبلغ"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                دورة الدفع <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(Number(e.target.value) as 1 | 2 | 3 | 4)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              >
                <option value={1}>شهري</option>
                <option value={2}>ربع سنوي</option>
                <option value={3}>نصف سنوي</option>
                <option value={4}>سنوي</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={subscribing}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all"
            >
              {subscribing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  جاري الاشتراك...
                </div>
              ) : (
                'إنشاء اشتراك'
              )}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

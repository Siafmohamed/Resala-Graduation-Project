import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useVerifyPayment, 
  useRejectPayment 
} from '../../hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import {
  ArrowLeft, Calendar, Clock, DollarSign, Phone,
  Smartphone, User, Building2, Zap, Check, XCircle, MapPin,
  AlertCircle, Receipt, Info
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Modal } from '@/shared/components/ui/Modal';
import { Label } from '@/shared/components/ui/Label';
import type { UnifiedPayment, PaymentType } from '../../types/payments.types';

interface UnifiedPaymentDetailsProps {
  payment: UnifiedPayment;
  paymentType: PaymentType;
  onBack?: () => void;
}

export function UnifiedPaymentDetails({ payment, paymentType, onBack }: UnifiedPaymentDetailsProps) {
  const navigate = useNavigate();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment(paymentType);
  const { mutate: rejectPayment, isPending: isRejecting } = useRejectPayment(paymentType);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const method = (payment.method || '').toLowerCase();

  const handleVerify = () => {
    verifyPayment(payment.id, {
      onSuccess: () => navigate(-1)
    });
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      rejectPayment({ id: payment.id, reason: rejectionReason }, {
        onSuccess: () => {
          setShowRejectModal(false);
          navigate(-1);
        }
      });
    }
  };

  const getMethodLabel = () => {
    if (method.includes('vodafone')) return 'فودافون كاش';
    if (method.includes('instapay')) return 'إنستا باي';
    if (method.includes('branch') || method.includes('فرع')) return 'فرع';
    if (method.includes('representative') || method.includes('مندوب')) return 'مندوب';
    return payment.method;
  };

  const getMethodIcon = () => {
    if (method.includes('vodafone')) return <Smartphone size={20} className="text-[#E60000]" />;
    if (method.includes('instapay')) return <Zap size={20} className="text-[#8e44ad]" />;
    if (method.includes('branch') || method.includes('فرع')) return <Building2 size={20} className="text-[#00549A]" />;
    if (method.includes('representative') || method.includes('مندوب')) return <User size={20} className="text-[#27ae60]" />;
    return <DollarSign size={20} />;
  };

  return (
    <div className="flex flex-col gap-8 pb-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack || (() => navigate(-1))}
          className="text-[#00549A] hover:bg-[#00549A]/10"
        >
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="font-[Cairo] font-bold text-3xl text-[#101727]">تفاصيل الدفعة</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-[Cairo] ${paymentType === 'emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#00549A]'}`}>
              {paymentType === 'emergency' ? 'حالة عاجلة' : 'كفالة مستمرة'}
            </span>
            <span className="text-xs text-gray-400 font-[Cairo]">#{payment.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="shadow-sm border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
              <CardTitle className="font-[Cairo] text-xl font-bold text-[#101727] flex items-center gap-2">
                <Receipt size={20} className="text-[#00549A]" />
                بيانات عملية الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-[#00549A]">{getMethodIcon()}</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 font-[Cairo]">طريقة الدفع</span>
                  <span className="font-bold text-[#101727] font-[Cairo]">{getMethodLabel()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-[#00549A]"><Calendar size={20} /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 font-[Cairo]">تاريخ الطلب</span>
                  <span className="font-bold text-[#101727] font-[Cairo]">
                    {payment.createdOn && isValid(new Date(payment.createdOn))
                      ? format(new Date(payment.createdOn), 'dd MMMM yyyy', { locale: ar })
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-green-50 text-green-600"><DollarSign size={20} /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 font-[Cairo]">المبلغ</span>
                  <span className="font-bold text-[#00549A] text-2xl font-[Cairo]">{payment.amount.toLocaleString()} ج.م</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-orange-50 text-orange-600"><Check size={20} /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 font-[Cairo]">حالة الدفع</span>
                  <span className="font-bold text-[#101727] font-[Cairo]">{payment.status}</span>
                </div>
              </div>

              {/* Method Specific Fields */}
              {method.includes('branch') && payment.scheduledDate && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 text-[#00549A]"><Clock size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 font-[Cairo]">تاريخ الاستلام المقرر</span>
                    <span className="font-bold text-[#101727] font-[Cairo]">
                      {isValid(new Date(payment.scheduledDate)) 
                        ? format(new Date(payment.scheduledDate), 'dd MMMM yyyy - hh:mm a', { locale: ar })
                        : payment.scheduledDate}
                    </span>
                  </div>
                </div>
              )}

              {(method.includes('vodafone') || method.includes('instapay')) && payment.senderPhoneNumber && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 text-[#00549A]"><Phone size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 font-[Cairo]">رقم المرسل</span>
                    <span className="font-bold text-[#101727] font-[Cairo] font-mono">{payment.senderPhoneNumber}</span>
                  </div>
                </div>
              )}

              {method.includes('representative') && (
                <>
                  {payment.deliveryAreaName && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-blue-50 text-[#00549A]"><Building2 size={20} /></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 font-[Cairo]">منطقة التوصيل</span>
                        <span className="font-bold text-[#101727] font-[Cairo]">{payment.deliveryAreaName}</span>
                      </div>
                    </div>
                  )}
                  {payment.address && (
                    <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <MapPin size={20} className="text-[#00549A] mt-1" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 font-[Cairo]">عنوان الاستلام</span>
                        <span className="font-bold text-[#101727] font-[Cairo] text-sm">{payment.address}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Receipt Image */}
          {payment.receiptImageUrl && (
            <Card className="shadow-sm border-none rounded-3xl overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                <CardTitle className="font-[Cairo] text-xl font-bold text-[#101727] flex items-center gap-2">
                  <Image size={20} className="text-[#00549A]" />
                  صورة الإيصال
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-video w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                  <img src={payment.receiptImageUrl} alt="Receipt" className="w-full h-full object-contain" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
              <CardTitle className="font-[Cairo] text-xl font-bold text-[#101727] flex items-center gap-2">
                <User size={20} className="text-[#00549A]" />
                بيانات المتبرع
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gray-50 text-gray-500"><User size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 font-[Cairo]">الاسم الكامل</span>
                  <span className="font-bold text-[#101727] font-[Cairo] text-sm">{payment.userName}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gray-50 text-gray-500"><Phone size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 font-[Cairo]">رقم الهاتف</span>
                  <span className="font-bold text-[#101727] font-[Cairo] text-sm font-mono">{payment.phone}</span>
                </div>
              </div>
              {paymentType === 'subscription' && payment.subscriptionId && (
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <div className="p-2 rounded-xl bg-white text-[#00549A] shadow-sm"><Info size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#00549A] font-[Cairo]">رقم الاشتراك</span>
                    <span className="font-bold text-[#00549A] font-[Cairo] text-sm">#{payment.subscriptionId}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {paymentType === 'emergency' && payment.emergencyCaseTitle && (
            <Card className="shadow-sm border-none rounded-3xl overflow-hidden border-2 border-red-50">
              <CardHeader className="bg-red-50/50 border-b border-red-100 p-6">
                <CardTitle className="font-[Cairo] text-lg font-bold text-[#F04930] flex items-center gap-2">
                  <AlertCircle size={20} />
                  الحالة الحرجة المستهدفة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="font-bold text-[#101727] font-[Cairo] text-sm mb-2">{payment.emergencyCaseTitle}</p>
                <div className="text-xs text-[#697282] font-[Cairo] flex items-center gap-1">
                  <span>ID:</span>
                  <span className="font-mono">#{payment.emergencyCaseId}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-[#00549A] text-white hover:bg-[#004077] font-[Cairo] font-bold py-6 rounded-2xl shadow-lg shadow-blue-200"
              onClick={handleVerify}
              disabled={isVerifying || isRejecting}
            >
              <Check size={20} className="ml-2" />
              تأكيد الدفعة
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white text-red-600 border-red-100 hover:bg-red-50 font-[Cairo] font-bold py-6 rounded-2xl"
              onClick={() => setShowRejectModal(true)}
              disabled={isVerifying || isRejecting}
            >
              <XCircle size={20} className="ml-2" />
              رفض الدفعة
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="رفض الدفعة"
        maxWidth="max-w-[425px]"
      >
        <div className="space-y-4 py-4" dir="rtl">
          <div className="space-y-2">
            <Label htmlFor="reason" className="font-[Cairo] text-[#495565]">سبب الرفض</Label>
            <textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full font-[Cairo] min-h-[120px] p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00549A] transition-all"
              placeholder="الرجاء إدخال سبب الرفض بوضوح للمتبرع..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowRejectModal(false)} className="font-[Cairo] font-bold rounded-xl">
              إلغاء
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 font-[Cairo] font-bold rounded-xl px-6"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'جاري الرفض...' : 'تأكيد الرفض'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

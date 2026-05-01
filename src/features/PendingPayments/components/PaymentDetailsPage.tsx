import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentDetails } from '../hooks/usePaymentDetails';
import { useVerifyPendingPayment } from '../hooks/useVerifyPendingPayment';
import { useRejectPendingPayment } from '../hooks/useRejectPendingPayment';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Modal } from '@/shared/components/ui/Modal';
import { Label } from '@/shared/components/ui/Label';
import {
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  Smartphone,
  User,
  Building2,
  Zap,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Hash,
  AlertCircle
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FullPageSpinner } from '@/features/authentication/components/FullPageSpinner';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';

const PaymentDetailsPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const id = Number(paymentId);

  const { data: payment, isLoading, isError } = usePaymentDetails(id);
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPendingPayment();
  const { mutateAsync: rejectPayment, isPending: isRejecting } = useRejectPendingPayment();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerify = async () => {
    await verifyPayment(id);
    navigate('/reception-dashboard');
  };

  const handleReject = async () => {
    if (rejectionReason.trim()) {
      await rejectPayment({ paymentId: id, reason: rejectionReason });
      setShowRejectModal(false);
      navigate('/reception-dashboard');
    } else {
      alert('الرجاء إدخال سبب الرفض.');
    }
  };

  if (isLoading) return <FullPageSpinner />;
  if (isError || !payment) return <ErrorMessage error="فشل تحميل تفاصيل الدفعة." />;

  // Derive once — always a string, never undefined
  const method = (payment.method ?? '').toLowerCase();

  const getMethodLabel = () => {
    if (method.includes('vodafone')) return 'فودافون كاش';
    if (method.includes('instapay')) return 'إنستا باي';
    if (method.includes('branch') || method.includes('فرع')) return 'فرع';
    if (method.includes('representative') || method.includes('مندوب')) return 'مندوب';
    return payment.method || 'غير محدد';
  };

  const getMethodBadgeColor = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('vodafone')) return 'bg-red-100 text-red-700 border-red-200';
    if (m.includes('instapay')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (m.includes('branch') || m.includes('فرع')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (m.includes('representative') || m.includes('مندوب')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#00549A] mb-2 transition-colors font-[Cairo]"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            <span>العودة للوحة التحكم</span>
          </button>
          <h1 className="text-3xl font-bold text-[#101727] font-[Cairo]">تفاصيل الدفعة</h1>
          <p className="text-gray-500 font-[Cairo]">معلومات كاملة عن المتبرع وحالة الدفع لبرنامج الكفالة</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-600 hover:bg-red-50 font-[Cairo] h-11 px-6 rounded-xl"
            onClick={() => setShowRejectModal(true)}
            disabled={isVerifying || isRejecting}
          >
            <XCircle className="w-4 h-4 ml-2" />
            رفض العملية
          </Button>
          <Button 
            className="bg-[#00549A] hover:bg-[#004077] text-white px-8 h-11 rounded-xl shadow-lg shadow-[#00549A]/20 transition-all font-bold font-[Cairo]"
            onClick={handleVerify}
            disabled={isVerifying || isRejecting}
          >
            <CheckCircle className="w-4 h-4 ml-2" />
            {isVerifying ? 'جاري التأكيد...' : 'تأكيد العملية'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Payment Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-none shadow-sm rounded-3xl">
            <h3 className="text-lg font-bold text-[#101727] mb-6 flex items-center font-[Cairo]">
              <CreditCard className="w-5 h-5 ml-2 text-[#00549A]" />
              تفاصيل عملية الدفع
            </h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-[Cairo] text-sm">طريقة الدفع</span>
                <Badge className={`${getMethodBadgeColor(method)} font-[Cairo] border px-3 py-1 rounded-lg`}>
                  {getMethodLabel()}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-[Cairo] text-sm">تاريخ الطلب</span>
                <span className="font-bold text-[#101727] font-[Cairo]">
                  {payment.createdOn ? formatDate(payment.createdOn) : '—'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-[Cairo] text-sm">المبلغ</span>
                <span className="text-2xl font-black text-[#00549A] font-[Cairo]">
                  {payment.amount.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-50 pt-5">
                <span className="text-gray-500 font-[Cairo] text-sm">حالة الدفع</span>
                <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-[Cairo] px-3 py-1 rounded-lg">
                  {payment.status || 'قيد المراجعة'}
                </Badge>
              </div>
            </div>

            {/* Dynamic Details based on Method */}
            {(method.includes('vodafone') || method.includes('instapay')) && (
              <div className="mt-8 p-5 bg-gray-50 rounded-2xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm mb-2 font-[Cairo]">تفاصيل التحويل</h4>
                {payment.senderPhoneNumber && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-[Cairo]">رقم المرسل</span>
                    <span className="font-bold font-[Cairo]">{payment.senderPhoneNumber}</span>
                  </div>
                )}
                {payment.receiptImageUrl && (
                  <div className="pt-2">
                    <span className="text-xs text-gray-500 block mb-2 font-[Cairo]">إثبات التحويل</span>
                    <a 
                      href={payment.receiptImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative block aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-white"
                    >
                      <img src={payment.receiptImageUrl} alt="Receipt" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon className="text-white w-6 h-6" />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )}

            {method.includes('branch') && payment.scheduledDate && (
              <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <h4 className="font-bold text-[#00549A] text-sm mb-3 font-[Cairo]">تفاصيل الموعد بالفرع</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00549A] shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-[Cairo]">تاريخ الاستلام المقرر</p>
                    <p className="font-bold text-[#101727] font-[Cairo]">
                      {formatDate(payment.scheduledDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Donor and Case Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Info Card */}
            <Card className="p-6 border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-bold text-[#101727] mb-6 flex items-center font-[Cairo]">
                <User className="w-5 h-5 ml-2 text-[#00549A]" />
                بيانات المتبرع
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center ml-4 shadow-sm text-[#00549A]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-[Cairo]">اسم المتبرع</p>
                    <p className="font-bold text-[#101727] font-[Cairo]">{payment.userName}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center ml-4 shadow-sm text-[#00549A]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-[Cairo]">رقم الهاتف</p>
                    <p className="font-bold text-[#101727] font-[Cairo]">{payment.phone}</p>
                  </div>
                </div>

                {method.includes('representative') && (
                  <>
                    <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center ml-4 shadow-sm text-[#00549A]">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-[Cairo]">عنوان الاستلام</p>
                        <p className="font-bold text-[#101727] font-[Cairo] truncate">{payment.address || 'غير محدد'}</p>
                      </div>
                    </div>
                    {payment.contactPhone && (
                      <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center ml-4 shadow-sm text-[#00549A]">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-[Cairo]">هاتف جهة الاتصال</p>
                          <p className="font-bold text-[#101727] font-[Cairo]">{payment.contactPhone}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Case/Sponsorship Info Card */}
            <Card className="p-6 border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-bold text-[#101727] mb-6 flex items-center font-[Cairo]">
                <FileText className="w-5 h-5 ml-2 text-[#00549A]" />
                تفاصيل الكفالة
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-[Cairo]">برنامج الكفالة</p>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="font-bold text-[#00549A] text-lg font-[Cairo]">
                      {payment.emergencyCaseTitle || 'كفالة شهرية'}
                    </p>
                    {payment.subscriptionId && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#00549A]/70 font-bold font-[Cairo]">
                        <Hash size={12} />
                        <span>رقم الاشتراك: {payment.subscriptionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {payment.representativeNotes && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-amber-700">
                      <MessageSquare size={16} />
                      <span className="text-xs font-bold font-[Cairo]">ملاحظات المندوب</span>
                    </div>
                    <p className="text-sm text-amber-800 font-[Cairo] leading-relaxed">
                      {payment.representativeNotes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="رفض عملية الدفع"
        maxWidth="max-w-[425px]"
      >
        <div className="space-y-6 py-4" dir="rtl">
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-[Cairo] flex items-center gap-3">
            <AlertCircle size={20} />
            يرجى توضيح سبب الرفض ليتم إرساله للمتبرع
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reason" className="font-bold text-[#101727] font-[Cairo] pr-1">سبب الرفض</Label>
            <textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full font-[Cairo] min-h-[120px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none text-sm"
              placeholder="اكتب سبب الرفض هنا بالتفصيل..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => setShowRejectModal(false)} 
              className="font-bold font-[Cairo] text-gray-500 hover:bg-gray-100 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-bold font-[Cairo] px-8 rounded-xl shadow-lg shadow-red-600/20 transition-all"
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
};

export default PaymentDetailsPage;
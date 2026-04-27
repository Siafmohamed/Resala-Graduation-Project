import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle,
  Hash,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useEmergencyPayments } from '../hooks/useEmergencyPayments';
import { useVerifyEmergencyPayment } from '../hooks/useVerifyEmergencyPayment';
import { useRejectEmergencyPayment } from '../hooks/useRejectEmergencyPayment';
import {LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';

const EmergencyPaymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const paymentId = parseInt(id || '0');
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // We fetch all to find the specific one (simulating getById if not available)
  const { data: payments, isLoading, error } = useEmergencyPayments('All');
  const payment = payments?.find(p => p.id === paymentId);

  const verifyMutation = useVerifyEmergencyPayment();
  const rejectMutation = useRejectEmergencyPayment();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="فشل في تحميل بيانات الدفعة" />;
  if (!payment) return <ErrorMessage message="الدفعة غير موجودة" />;

  const handleApprove = async () => {
    await verifyMutation.mutateAsync(paymentId);
    navigate('/emergency-payments');
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    await rejectMutation.mutateAsync({ paymentId, reason: rejectionReason });
    setIsRejectModalOpen(false);
    navigate('/emergency-payments');
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'vodafonecash': return 'bg-red-100 text-red-700 border-red-200';
      case 'instapay': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'branch': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'representative': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'vodafonecash': return 'فودافون كاش';
      case 'instapay': return 'إنستا باي';
      case 'branch': return 'فرع';
      case 'representative': return 'مندوب';
      default: return method;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/emergency-payments')}
            className="flex items-center text-gray-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            <span>العودة للوحة التحكم</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الدفعة</h1>
          <p className="text-gray-500">معلومات كاملة عن المتبرع وحالة الدفع لحالة الطوارئ</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={verifyMutation.isPending || rejectMutation.isPending}
          >
            <XCircle className="w-4 h-4 ml-2" />
            رفض العملية
          </Button>
          <Button 
            className="bg-[#00549A] hover:bg-[#004077] text-white px-8 h-11 rounded-xl shadow-lg shadow-[#00549A]/20 transition-all font-bold"
            onClick={handleApprove}
            disabled={verifyMutation.isPending || rejectMutation.isPending}
          >
            <CheckCircle className="w-4 h-4 ml-2" />
            تأكيد العملية
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Payment Process Details */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-5 border-none shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 ml-2 text-primary" />
              تفاصيل عملية الدفع
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">طريقة الدفع</span>
                <Badge className={getMethodBadgeColor(payment.method)}>
                  {getMethodLabel(payment.method)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">تاريخ الطلب</span>
                <span className="font-medium text-gray-900">{formatDate(payment.createdOn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">المبلغ</span>
                <span className="text-xl font-bold text-primary">{payment.amount.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-500">حالة الدفع</span>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  قيد المراجعة
                </Badge>
              </div>
            </div>

            {/* Dynamic Transfer Details */}
            {(payment.method.toLowerCase() === 'vodafonecash' || payment.method.toLowerCase() === 'instapay') && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3">
                <h4 className="font-bold text-gray-800 text-sm mb-2">تفاصيل التحويل</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">رقم المحول</span>
                  <span className="font-medium">{payment.senderPhoneNumber || 'غير متوفر'}</span>
                </div>
                {payment.receiptImageUrl && (
                  <div className="pt-2">
                    <span className="text-xs text-gray-500 block mb-1">إثبات التحويل</span>
                    <a 
                      href={payment.receiptImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-xs flex items-center hover:underline"
                    >
                      <ImageIcon className="w-3 h-3 ml-1" />
                      عرض الصورة
                    </a>
                  </div>
                )}
              </div>
            )}

            {payment.method.toLowerCase() === 'branch' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3">
                <h4 className="font-bold text-gray-800 text-sm mb-2">تفاصيل الموعد</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 text-xs">تاريخ الموعد المجدول</span>
                  <span className="font-bold text-[#00549A]">
                    {payment.scheduledDate ? formatDate(payment.scheduledDate) : 'غير محدد'}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Middle/Right Column: Donor and Case Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Info Card */}
            <Card className="p-5 border-none shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 ml-2 text-primary" />
                بيانات المتبرع
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ml-3 shadow-sm text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">الاسم</p>
                    <p className="font-bold text-gray-900">{payment.userName}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ml-3 shadow-sm text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">رقم الهاتف</p>
                    <p className="font-bold text-gray-900">{payment.phone}</p>
                  </div>
                </div>
                
                {/* Dynamic Representative Fields */}
                {payment.method.toLowerCase() === 'representative' && (
                  <>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ml-3 shadow-sm text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">العنوان</p>
                        <p className="font-bold text-gray-900">{payment.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ml-3 shadow-sm text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">هاتف جهة الاتصال</p>
                        <p className="font-bold text-gray-900">{payment.contactPhone}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Emergency Case Info Card */}
            <Card className="p-5 border-none shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 ml-2 text-primary" />
                تفاصيل حالة الطوارئ
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">اسم الحالة</p>
                  <p className="font-bold text-gray-900 text-lg">{payment.emergencyCaseTitle}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-primary font-medium">مبلغ الدفع</span>
                  <span className="text-xl font-bold text-primary">{payment.amount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 ml-1" />
                  <span>منطقة التوصيل: {payment.deliveryAreaName}</span>
                </div>
                {payment.representativeNotes && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold mb-1 flex items-center">
                      <MessageSquare className="w-3 h-3 ml-1" />
                      ملاحظات المندوب:
                    </p>
                    <p className="text-sm text-orange-800 italic">{payment.representativeNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Receipt Image Preview if available */}
          {payment.receiptImageUrl && (
            <Card className="p-5 border-none shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 ml-2 text-primary" />
                إيصال الدفع المرفوع من المتبرع
              </h3>
              <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative group">
                <img 
                  src={payment.receiptImageUrl} 
                  alt="Receipt" 
                  className="max-h-full max-w-full object-contain"
                />
                <a 
                  href={payment.receiptImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
                >
                  عرض بالحجم الكامل
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="رفض عملية الدفع"
      >
        <div className="space-y-4 py-4" dir="rtl">
          <div className="space-y-2">
            <Label htmlFor="reason">سبب الرفض</Label>
            <Input
              id="reason"
              placeholder="اكتب سبب رفض العملية هنا..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? 'جاري الرفض...' : 'تأكيد الرفض'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmergencyPaymentDetails;

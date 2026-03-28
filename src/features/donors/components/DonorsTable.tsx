import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, MapPin, X, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Donor } from '../types/donor.types';
import {
  getSponsorshipTypeLabel,
} from '../utils/donorHelpers';
import { DonorStatusBadge } from './DonorStatusBadge';
import { donorService } from '../services/donorService';
import { Card, CardContent } from '@/shared/components/ui/Card';

interface DonorsTableProps {
  donors: Donor[];
  isLoading?: boolean;
}

export function DonorsTable({ donors, isLoading }: DonorsTableProps) {
  const navigate = useNavigate();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'branch' | 'vodafone_cash'>('branch');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestPayment = async () => {
    if (!selectedDonor || !amount) return;
    
    setIsSubmitting(true);
    try {
      await donorService.requestPayment(selectedDonor.id, Number(amount), method);
      toast.success(`تم إرسال طلب الدفع للمتبرع ${selectedDonor.name} بنجاح`);
      setSelectedDonor(null);
      setAmount('');
    } catch (err) {
      toast.error('فشل إرسال طلب الدفع');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground" dir="rtl">
        لا يوجد متبرعون
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-lg border border-[#E0E7EE]">
        <table className="w-full text-sm" dir="rtl">
          <thead>
            <tr className="bg-[#ECF2F8] h-14">
              <th className="px-4 text-right font-bold font-[Cairo]">اسم المتبرع</th>
              <th className="px-4 text-center font-bold font-[Cairo]">نوع الكفالة</th>
              <th className="px-4 text-center font-bold font-[Cairo]">حالة الدفع</th>
              <th className="px-4 text-center font-bold font-[Cairo]">المبلغ</th>
              <th className="px-4 text-center font-bold font-[Cairo]">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr
                key={donor.id}
                className="border-b last:border-b-0 hover:bg-muted/30 transition-colors h-16"
              >
                <td className="px-4 py-3 font-bold font-[Cairo] text-[#101727]">{donor.name}</td>
                <td className="px-4 py-3 text-center font-[Cairo] text-[#697282]">
                  {getSponsorshipTypeLabel(donor.sponsorshipType)}
                </td>
                <td className="px-4 py-3 text-center">
                  <DonorStatusBadge status={donor.paymentStatus} />
                </td>
                <td className="px-4 py-3 text-center font-bold text-[#00549A] font-[Cairo]">
                  {donor.amount} ج.م
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/donors/${donor.id}`)}
                      className="px-4 py-2 rounded-xl border border-[#E0E7EE] text-[#00549A] font-bold font-[Cairo] text-xs hover:bg-[#F8FAFC] transition-all"
                    >
                      التفاصيل
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDonor(donor)}
                      className="px-4 py-2 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-xs hover:bg-[#004077] transition-all flex items-center gap-2"
                    >
                      <CreditCard size={14} />
                      طلب دفع
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Request Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-[24px] overflow-hidden bg-white animate-in zoom-in-95 duration-200" dir="rtl">
            <CardContent className="p-0">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#00549A]/10 text-[#00549A]">
                    <Wallet size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-[Cairo] font-bold text-lg text-[#101727]">طلب دفع جديد</h3>
                    <p className="font-[Cairo] text-xs text-[#697282]">{selectedDonor.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDonor(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-[#697282] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 flex flex-col gap-6">
                {/* Amount Input */}
                <div className="flex flex-col gap-2">
                  <label className="font-[Cairo] font-bold text-sm text-[#101727] text-right">المبلغ المطلوب (ج.م)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-5 py-4 rounded-xl border-none bg-[#F8FAFC] font-[Cairo] text-lg font-bold text-center focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 transition-all"
                  />
                </div>

                {/* Method Selection */}
                <div className="flex flex-col gap-3">
                  <label className="font-[Cairo] font-bold text-sm text-[#101727] text-right">طريقة الدفع</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMethod('branch')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        method === 'branch' 
                          ? 'border-[#00549A] bg-[#00549A]/5 text-[#00549A]' 
                          : 'border-gray-100 bg-white text-[#697282] hover:bg-gray-50'
                      }`}
                    >
                      <MapPin size={24} />
                      <span className="font-[Cairo] font-bold text-xs">في المقر</span>
                    </button>
                    <button
                      onClick={() => setMethod('vodafone_cash')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        method === 'vodafone_cash' 
                          ? 'border-[#E60000] bg-[#E60000]/5 text-[#E60000]' 
                          : 'border-gray-100 bg-white text-[#697282] hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#E60000] flex items-center justify-center text-white font-bold text-[10px]">V</div>
                      <span className="font-[Cairo] font-bold text-xs">فودافون كاش</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-[#F8FAFC] border-t border-gray-100 flex flex-col gap-3">
                <button
                  disabled={!amount || isSubmitting}
                  onClick={handleRequestPayment}
                  className="w-full py-4 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-base hover:bg-[#004077] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00549A]/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      إرسال الطلب
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

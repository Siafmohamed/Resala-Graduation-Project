import React, { useState, useEffect } from 'react';
import { Phone, Wallet, Smartphone, Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { usePaymentNumbers, useUpsertPaymentNumber } from '../hooks/usePaymentSettings';
import { PaymentNumberType } from '../types/paymentSettings.types';

export function PaymentMethodsSettings() {
  const { data: paymentNumbers, isLoading } = usePaymentNumbers();
  const upsertMutation = useUpsertPaymentNumber();

  const [vodafoneNumber, setVodafoneNumber] = useState('');
  const [vodafoneActive, setVodafoneActive] = useState(true);
  
  const [instapayNumber, setInstapayNumber] = useState('');
  const [instapayActive, setInstapayActive] = useState(true);

  // Track which payment method is currently being saved
  const [savingType, setSavingType] = useState<PaymentNumberType | null>(null);

  useEffect(() => {
    // Always treat as array
    const safePaymentNumbers = Array.isArray(paymentNumbers) ? paymentNumbers : [];
    console.log('safePaymentNumbers:', safePaymentNumbers);
    if (safePaymentNumbers.length > 0) {
      const vCash = safePaymentNumbers.find(n => n.type === PaymentNumberType.VODAFONE_CASH);
      if (vCash) {
        setVodafoneNumber(vCash.number);
        setVodafoneActive(vCash.isActive);
      }

      const iPay = safePaymentNumbers.find(n => n.type === PaymentNumberType.INSTAPAY);
      if (iPay) {
        setInstapayNumber(iPay.number);
        setInstapayActive(iPay.isActive);
      }
    }
  }, [paymentNumbers]);

  const handleUpsert = async (type: PaymentNumberType) => {
    const number = type === PaymentNumberType.VODAFONE_CASH ? vodafoneNumber : instapayNumber;
    const isActive = type === PaymentNumberType.VODAFONE_CASH ? vodafoneActive : instapayActive;

    if (!number) return;

    setSavingType(type);
    try {
      await upsertMutation.mutateAsync({
        type,
        number,
        isActive
      });
    } finally {
      setSavingType(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#00549A]" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-[#00549A] py-4 px-6">
        <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
          <Wallet className="w-5 h-5" />
          طرق الدفع المتاحة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="font-[Cairo] font-medium text-[#697282] text-sm mb-6">إدارة أرقام التحويل لفودافون كاش وإنستاباي</p>

        <div className="flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vodafone Cash Card */}
        <Card className="border-2 border-[#E0E9F4] shadow-none rounded-2xl overflow-hidden bg-white hover:border-[#00549A]/20 transition-colors">
            <CardHeader className="bg-[#EEF3FB] border-none p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#00549A]">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <Smartphone size={24} />
                  </div>
                  <CardTitle className="font-[Cairo] font-bold text-lg">فودافون كاش</CardTitle>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${
                  vodafoneActive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {vodafoneActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {vodafoneActive ? 'نشط' : 'معطل'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-[Cairo] text-sm font-bold text-[#495565]">رقم المحفظة</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                  <input
                    type="text"
                    value={vodafoneNumber}
                    onChange={(e) => setVodafoneNumber(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#f8fafc] border border-[#E0E9F4] focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-mono text-base tracking-widest"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={savingType === PaymentNumberType.VODAFONE_CASH || !vodafoneNumber}
                onClick={() => handleUpsert(PaymentNumberType.VODAFONE_CASH)}
                className="w-full py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[Cairo] text-sm disabled:opacity-50"
              >
                {savingType === PaymentNumberType.VODAFONE_CASH ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                حفظ التعديلات
              </button>
            </CardContent>
        </Card>

        {/* InstaPay Card */}
        <Card className="border-2 border-[#E0E9F4] shadow-none rounded-2xl overflow-hidden bg-white hover:border-[#00549A]/20 transition-colors">
            <CardHeader className="bg-[#f0f9ff] border-none p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#0ea5e9]">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <Wallet size={24} />
                  </div>
                  <CardTitle className="font-[Cairo] font-bold text-lg">إنستاباي (InstaPay)</CardTitle>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${
                  instapayActive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {instapayActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {instapayActive ? 'نشط' : 'معطل'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-[Cairo] text-sm font-bold text-[#495565]">عنوان الدفع (IPA)</label>
                <div className="relative">
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                  <input
                    type="text"
                    value={instapayNumber}
                    onChange={(e) => setInstapayNumber(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#f8fafc] border border-[#E0E9F4] focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-mono text-base"
                    placeholder="username@instapay"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={savingType === PaymentNumberType.INSTAPAY || !instapayNumber}
                onClick={() => handleUpsert(PaymentNumberType.INSTAPAY)}
                className="w-full py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[Cairo] text-sm disabled:opacity-50"
              >
                {savingType === PaymentNumberType.INSTAPAY ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                حفظ التعديلات
              </button>
            </CardContent>
        </Card>
      </div>
        </div>
      </CardContent>
    </Card>
  );
}

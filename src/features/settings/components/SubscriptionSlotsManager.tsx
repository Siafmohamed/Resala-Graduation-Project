import { useState } from 'react';
import { Calendar, Clock, Users, Plus, Check, AlertCircle, X, Loader2, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import {
  useSubscriptionSlots,
  useCreateSubscriptionSlot,
} from '../hooks/useSubscriptionSlots';
import type { CreateSlotPayload } from '@/api/services/subscriptionSlotsService';

export function SubscriptionSlotsManager() {
  const { data: slots = [], isLoading } = useSubscriptionSlots();
  const createMutation = useCreateSubscriptionSlot();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    slotDate: '',
    openFrom: '09:00',
    openTo: '14:00',
    maxCapacity: 20,
    notes: '',
  });

  const resetForm = () =>
    setFormData({ slotDate: '', openFrom: '09:00', openTo: '14:00', maxCapacity: 20, notes: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slotDate) return;

    const payload: CreateSlotPayload = {
      slotDate: new Date(formData.slotDate).toISOString(),
      openFrom: formData.openFrom,
      openTo: formData.openTo,
      maxCapacity: formData.maxCapacity,
      notes: formData.notes || '',
    };

    await createMutation.mutateAsync(payload);
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

  const formatTime = (timeString: string) => timeString.substring(0, 5);

  const isSlotFull  = (slot: typeof slots[0]) => slot.bookedCount >= slot.maxCapacity;
  const isSlotPast  = (slot: typeof slots[0]) => {
    const d = new Date(slot.slotDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const getSlotStatus = (slot: typeof slots[0]) => {
    if (isSlotPast(slot))  return { label: 'منتهي',  color: 'bg-gray-100 text-gray-500 border-gray-200',   icon: AlertCircle };
    if (isSlotFull(slot))  return { label: 'مكتمل', color: 'bg-red-50  text-red-600  border-red-200',    icon: Users };
    return                        { label: 'متاح',   color: 'bg-green-50 text-green-700 border-green-200', icon: Check };
  };

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#00549A]/20 border-t-[#00549A] rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-[Cairo]">جاري تحميل المواعيد…</p>
      </div>
    );
  }

  return (
    <>
      {/* ═══════════════════ Modal Overlay ═══════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetForm(); } }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#00549A]" />
                </div>
                <h3 className="font-bold text-[#101727] font-[Cairo] text-base">موعد جديد</h3>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 font-[Cairo]">تاريخ الموعد *</label>
                <Input
                  type="date"
                  value={formData.slotDate}
                  onChange={(e) => setFormData({ ...formData, slotDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-xl border-gray-200 focus:border-[#00549A] focus:ring-[#00549A]/10 font-[Cairo] h-10 text-sm"
                  required
                />
              </div>

              {/* Time range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 font-[Cairo]">من *</label>
                  <Input
                    type="time"
                    value={formData.openFrom}
                    onChange={(e) => setFormData({ ...formData, openFrom: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-[#00549A] font-[Cairo] h-10 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 font-[Cairo]">إلى *</label>
                  <Input
                    type="time"
                    value={formData.openTo}
                    onChange={(e) => setFormData({ ...formData, openTo: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-[#00549A] font-[Cairo] h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 font-[Cairo]">السعة القصوى *</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                    min={1}
                    className="rounded-xl border-gray-200 focus:border-[#00549A] font-[Cairo] h-10 text-sm pl-10"
                    required
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 font-[Cairo]">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: متاح أيام الأسبوع فقط"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 font-[Cairo] text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 h-10 rounded-xl bg-[#00549A] hover:bg-[#004480] text-white font-[Cairo] text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createMutation.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : 'حفظ الموعد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════ Page Content ═══════════════════ */}
      <div className="space-y-6">

        {/* Header */}
       <CardHeader className="bg-[#00549A] py-4 px-6">
  <div className="flex items-center justify-between">
    
    <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
      <Calendar className="w-5 h-5" />
      مواعيد استقبال المتبرعين
    </CardTitle>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-[Cairo] text-sm font-bold border border-white/20 transition-colors"
    >
      <Plus className="w-4 h-4" />
      إضافة موعد
    </button>

  </div>
</CardHeader>
        {/* Cards Grid — always full-width, never shifts */}
        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-[#00549A]/40" />
            </div>
            <p className="font-bold text-[#101727] font-[Cairo]">لا توجد مواعيد</p>
            <p className="text-xs text-gray-400 font-[Cairo] mt-1">ابدأ بإضافة مواعيد جديدة لاستقبال التبرعات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...slots]
              .sort((a, b) => new Date(b.slotDate).getTime() - new Date(a.slotDate).getTime())
              .map((slot) => {
                const status    = getSlotStatus(slot);
                const StatusIcon = status.icon;
                const isFull    = isSlotFull(slot);
                const isPast    = isSlotPast(slot);

                return (
                  <div
                    key={slot.id}
                    className={`bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-md
                      ${isPast ? 'border-gray-100 opacity-70' : isFull ? 'border-red-100' : 'border-gray-100 hover:border-blue-100'}
                    `}
                  >
                    {/* Card top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                          ${isPast ? 'bg-gray-100 text-gray-400' : isFull ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#00549A]'}
                        `}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 font-[Cairo] leading-none mb-1">موعد استقبال</p>
                          <p className="font-bold text-[#101727] font-[Cairo] text-sm leading-snug">{formatDate(slot.slotDate)}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-[Cairo] shrink-0 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {/* Info row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                        <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold font-[Cairo] leading-none mb-0.5">التوقيت</p>
                          <p className="text-xs font-black text-[#101727] font-[Cairo]">
                            {formatTime(slot.openFrom)} - {formatTime(slot.openTo)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                        <Users className={`w-4 h-4 shrink-0 ${isFull ? 'text-red-400' : 'text-green-500'}`} />
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold font-[Cairo] leading-none mb-0.5">الإشغال</p>
                          <p className="text-xs font-black text-[#101727] font-[Cairo]">
                            {slot.bookedCount} / {slot.maxCapacity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Capacity progress bar */}
                    <div className="mb-4">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-[#00549A]'}`}
                          style={{ width: `${Math.min(100, (slot.bookedCount / slot.maxCapacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    {slot.notes && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-blue-50/60 text-[11px] text-gray-600 font-[Cairo] border-r-2 border-[#00549A]/30">
                        {slot.notes}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 font-[Cairo]">
                      <Hash className="w-3 h-3" />
                      ID: #{slot.id}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}
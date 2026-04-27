import { useState } from 'react';
import { Calendar, Clock, Users, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import {
  useSubscriptionSlots,
  useCreateSubscriptionSlot,
  useDeleteSubscriptionSlot,
} from '../hooks/useSubscriptionSlots';
import type { CreateSlotPayload } from '@/api/services/subscriptionSlotsService';

export function SubscriptionSlotsManager() {
  const { data: slots = [], isLoading } = useSubscriptionSlots();
  const createMutation = useCreateSubscriptionSlot();
  const deleteMutation = useDeleteSubscriptionSlot();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    slotDate: '',
    openFrom: '09:00',
    openTo: '14:00',
    maxCapacity: 20,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slotDate) {
      return;
    }

    const payload: CreateSlotPayload = {
      slotDate: formData.slotDate, // Use YYYY-MM-DD string directly
      openFrom: formData.openFrom.includes(':') && formData.openFrom.split(':').length === 2 
        ? `${formData.openFrom}:00` 
        : formData.openFrom,
      openTo: formData.openTo.includes(':') && formData.openTo.split(':').length === 2 
        ? `${formData.openTo}:00` 
        : formData.openTo,
      maxCapacity: formData.maxCapacity,
      notes: formData.notes || undefined,
    };

    await createMutation.mutateAsync(payload);
    setShowForm(false);
    setFormData({
      slotDate: '',
      openFrom: '09:00',
      openTo: '14:00',
      maxCapacity: 20,
      notes: '',
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const isSlotFull = (slot: typeof slots[0]) => {
    return slot.bookedCount >= slot.maxCapacity;
  };

  const isSlotPast = (slot: typeof slots[0]) => {
    const slotDate = new Date(slot.slotDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return slotDate < today;
  };

  const getSlotStatus = (slot: typeof slots[0]) => {
    if (isSlotPast(slot)) {
      return { label: 'منتهي', color: 'bg-gray-100 text-gray-600', icon: AlertCircle };
    }
    if (isSlotFull(slot)) {
      return { label: 'مكتمل', color: 'bg-red-100 text-red-700', icon: Users };
    }
    return { label: 'متاح', color: 'bg-green-100 text-green-700', icon: Check };
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#00549A]/30 border-t-[#00549A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-[Cairo]">جاري تحميل المواعيد...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#00549A] to-[#003d6d] py-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <Calendar className="w-5 h-5" />
            مواعيد استقبال المتبرعين
          </CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-[Cairo]"
          >
            <Plus className="w-4 h-4" />
            إضافة موعد
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Add Slot Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 space-y-4">
            <h3 className="font-[Cairo] font-bold text-[#101727] text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00549A]" />
              إضافة موعد جديد
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
                  تاريخ الموعد *
                </label>
                <Input
                  type="date"
                  value={formData.slotDate}
                  onChange={(e) => setFormData({ ...formData, slotDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="font-[Cairo]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
                  السعة القصوى *
                </label>
                <Input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                  min={1}
                  className="font-[Cairo]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
                  وقت الفتح *
                </label>
                <Input
                  type="time"
                  value={formData.openFrom}
                  onChange={(e) => setFormData({ ...formData, openFrom: e.target.value })}
                  className="font-[Cairo]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
                  وقت الإغلاق *
                </label>
                <Input
                  type="time"
                  value={formData.openTo}
                  onChange={(e) => setFormData({ ...formData, openTo: e.target.value })}
                  className="font-[Cairo]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#101727] font-[Cairo] mb-2">
                  ملاحظات (اختياري)
                </label>
                <Input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: متاح أيام الأسبوع فقط"
                  className="font-[Cairo]"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-[Cairo]"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#00549A] hover:bg-[#004480] text-white px-6 py-2 rounded-lg font-[Cairo] disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    حفظ الموعد
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Slots List */}
        {slots.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-[Cairo] text-lg font-bold mb-2">لا توجد مواعيد حالياً</p>
            <p className="text-gray-400 font-[Cairo] text-sm">قم بإضافة موعد جديد لاستقبال المتبرعين</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {slots
              .sort((a, b) => new Date(b.slotDate).getTime() - new Date(a.slotDate).getTime())
              .map((slot) => {
                const status = getSlotStatus(slot);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-xl border transition-all hover:shadow-md ${
                      isSlotPast(slot)
                        ? 'bg-gray-50 border-gray-200 opacity-75'
                        : isSlotFull(slot)
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#00549A]/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-[#00549A]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-[Cairo] mb-1">التاريخ</p>
                            <p className="font-[Cairo] font-bold text-[#101727] text-sm">
                              {formatDate(slot.slotDate)}
                            </p>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-[Cairo] mb-1">الوقت</p>
                            <p className="font-[Cairo] font-bold text-[#101727] text-sm">
                              {formatTime(slot.openFrom)} - {formatTime(slot.openTo)}
                            </p>
                          </div>
                        </div>

                        {/* Capacity */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-[Cairo] mb-1">السعة</p>
                            <p className="font-[Cairo] font-bold text-[#101727] text-sm">
                              {slot.bookedCount} / {slot.maxCapacity}
                              <span className="text-xs text-gray-500 mr-1">
                                ({slot.availableSpots} متاح)
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold font-[Cairo] ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>

                        {!isSlotPast(slot) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(slot.id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {slot.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 font-[Cairo]">
                          <span className="font-bold">ملاحظات:</span> {slot.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

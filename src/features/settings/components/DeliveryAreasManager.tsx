import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, Check, X, Building, Navigation, Loader2 , Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import {
  useDeliveryAreas,
  useCreateDeliveryArea,
  useUpdateDeliveryArea,
  useDeleteDeliveryArea,
} from '../hooks/useDeliveryAreas';
import type {
  CreateDeliveryAreaPayload,
  UpdateDeliveryAreaPayload,
  DeliveryArea,
} from '@/api/services/deliveryAreasService';

/* ─── tiny reusable field ─── */
function FieldBlock({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-[Cairo] font-bold leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#101727] font-[Cairo] truncate">{value}</p>
      </div>
    </div>
  );
}

/* ─── modal shell ─── */
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#00549A]" />
            </div>
            <h3 className="font-bold text-[#101727] font-[Cairo] text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ─── area form fields ─── */
function AreaFormFields({
  data,
  onChange,
}: {
  data: { name: string; city: string; governorate: string };
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-400 font-[Cairo]">اسم الحي *</label>
        <div className="relative">
          <Input
            placeholder="مثال: حي السلام"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="rounded-xl border-gray-200 focus:border-[#00549A] focus:ring-[#00549A]/10 font-[Cairo] h-10 text-sm pl-10"
            required
          />
          <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-400 font-[Cairo]">المدينة *</label>
          <div className="relative">
            <Input
              placeholder="مثال: الزقازيق"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="rounded-xl border-gray-200 focus:border-[#00549A] focus:ring-[#00549A]/10 font-[Cairo] h-10 text-sm pl-10"
              required
            />
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-400 font-[Cairo]">المحافظة *</label>
          <div className="relative">
            <Input
              placeholder="مثال: الشرقية"
              value={data.governorate}
              onChange={(e) => onChange('governorate', e.target.value)}
              className="rounded-xl border-gray-200 focus:border-[#00549A] focus:ring-[#00549A]/10 font-[Cairo] h-10 text-sm pl-10"
              required
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Main Component ═══════════════════ */
export function DeliveryAreasManager() {
  const { data: areas = [], isLoading } = useDeliveryAreas();
  const createMutation = useCreateDeliveryArea();
  const updateMutation = useUpdateDeliveryArea();
  const deleteMutation = useDeleteDeliveryArea();

  const [showAddModal, setShowAddModal]   = useState(false);
  const [editingArea, setEditingArea]     = useState<DeliveryArea | null>(null);
  const [deletingId, setDeletingId]       = useState<number | null>(null);

  const emptyCreate: CreateDeliveryAreaPayload = { name: '', governorate: '', city: '' };
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [editForm,   setEditForm]   = useState<UpdateDeliveryAreaPayload>({
    id: 0, name: '', governorate: '', city: '', isActive: true,
  });

  /* handlers */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.city || !createForm.governorate) return;
    await createMutation.mutateAsync(createForm);
    setShowAddModal(false);
    setCreateForm(emptyCreate);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.city || !editForm.governorate) return;
    await updateMutation.mutateAsync({ id: editForm.id, payload: editForm });
    setEditingArea(null);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteMutation.mutateAsync(id);
    setDeletingId(null);
  };

  const openEdit = (area: DeliveryArea) => {
    setEditingArea(area);
    setEditForm(area);
  };

  /* loading */
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#00549A]/20 border-t-[#00549A] rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400 font-[Cairo]">جاري تحميل مناطق التوصيل…</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* ─── Add Modal ─── */}
      {showAddModal && (
        <Modal title="إضافة منطقة جديدة" onClose={() => { setShowAddModal(false); setCreateForm(emptyCreate); }}>
          <form onSubmit={handleCreate} className="space-y-5">
            <AreaFormFields
              data={createForm}
              onChange={(k, v) => setCreateForm((p) => ({ ...p, [k]: v }))}
            />
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setCreateForm(emptyCreate); }}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 font-[Cairo] text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-[#00549A] hover:bg-[#004480] text-white font-[Cairo] text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إضافة المنطقة'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Edit Modal ─── */}
      {editingArea && (
        <Modal title="تعديل المنطقة" onClose={() => setEditingArea(null)}>
          <form onSubmit={handleUpdate} className="space-y-5">
            <AreaFormFields
              data={editForm}
              onChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
            />
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEditingArea(null)}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 font-[Cairo] text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-[#00549A] hover:bg-[#004480] text-white font-[Cairo] text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Delete confirm modal ─── */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-[#101727] font-[Cairo] text-base mb-1">حذف المنطقة</h3>
            <p className="text-sm text-gray-400 font-[Cairo] mb-6">هل أنت متأكد من حذف هذه المنطقة؟ لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 font-[Cairo] text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={deleteMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-[Cairo] text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد الحذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Card ═══ */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">

        {/* ── Header ── matches the slots header pattern */}
       <CardHeader className="bg-[#00549A] py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
              <Calendar className="w-5 h-5" />
              مواعيد استقبال المتبرعين
            </CardTitle>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-[Cairo] text-sm font-bold border border-white/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة موعد
            </button>
          </div>
        </CardHeader>
        {/* ── Body ── */}
        <CardContent className="p-0">
          {areas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#00549A]/30" />
              </div>
              <p className="font-bold text-[#101727] font-[Cairo]">لا توجد مناطق</p>
              <p className="text-xs text-gray-400 font-[Cairo] mt-1">أضف أول منطقة خدمة للمندوبين</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {areas.map((area, idx) => (
                <li
                  key={area.id}
                  className="group flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors"
                >
                  {/* index bubble */}
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#00549A] text-xs font-black font-[Cairo] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-6 min-w-0 flex-1 flex-wrap">
                      <FieldBlock
                        label="اسم الحي"
                        value={area.name}
                        icon={Navigation}
                        iconBg="bg-blue-50"
                        iconColor="text-[#00549A]"
                      />
                      <FieldBlock
                        label="المدينة"
                        value={area.city}
                        icon={Building}
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                      />
                      <FieldBlock
                        label="المحافظة"
                        value={area.governorate}
                        icon={MapPin}
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                    </div>
                  </div>

                  {/* action buttons — visible on hover */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-2">
                    <button
                      onClick={() => openEdit(area)}
                      className="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(area.id)}
                      className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* footer count */}
          {areas.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-[Cairo]">
                إجمالي المناطق:{' '}
                <span className="font-bold text-[#101727]">{areas.length}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
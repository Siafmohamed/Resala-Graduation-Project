import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, Check, X, Building, Navigation } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import {
  useDeliveryAreas,
  useCreateDeliveryArea,
  useUpdateDeliveryArea,
  useDeleteDeliveryArea,
} from '../hooks/useDeliveryAreas';
import type { CreateDeliveryAreaPayload, UpdateDeliveryAreaPayload, DeliveryArea } from '@/api/services/deliveryAreasService';

export function DeliveryAreasManager() {
  const { data: areas = [], isLoading } = useDeliveryAreas();
  const createMutation = useCreateDeliveryArea();
  const updateMutation = useUpdateDeliveryArea();
  const deleteMutation = useDeleteDeliveryArea();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<CreateDeliveryAreaPayload>({
    name: '',
    governorate: '',
    city: '',
  });

  const [editFormData, setEditFormData] = useState<UpdateDeliveryAreaPayload>({
    id: 0,
    name: '',
    governorate: '',
    city: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.governorate || !formData.city) return;

    await createMutation.mutateAsync(formData);
    setShowForm(false);
    setFormData({ name: '', governorate: '', city: '' });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.governorate || !editFormData.city) return;

    await updateMutation.mutateAsync({ id: editFormData.id, payload: editFormData });
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const startEditing = (area: DeliveryArea) => {
    setEditingId(area.id);
    setEditFormData(area);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#00549A]/30 border-t-[#00549A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-[Cairo]">جاري تحميل مناطق التوصيل...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
      <CardHeader className="bg-[#00549A] py-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <MapPin className="w-5 h-5" />
            مناطق خدمة المندوبين
          </CardTitle>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-[Cairo]"
          >
            <Plus className="w-4 h-4" />
            إضافة منطقة
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Add Area Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 space-y-4">
            <h3 className="font-[Cairo] font-bold text-[#101727] text-base flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-[#00549A]" />
              إضافة منطقة توصيل جديدة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo]">اسم الحي</label>
                <Input
                  placeholder="مثال: حي السلام"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="font-[Cairo]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo]">المدينة</label>
                <Input
                  placeholder="مثال: الزقازيق"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="font-[Cairo]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#495565] font-[Cairo]">المحافظة</label>
                <Input
                  placeholder="مثال: الشرقية"
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="font-[Cairo]"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 font-[Cairo]"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#00549A] hover:bg-[#004480] text-white px-6 font-[Cairo]"
              >
                {createMutation.isPending ? 'جاري الإضافة...' : 'إضافة المنطقة'}
              </Button>
            </div>
          </form>
        )}

        {/* Areas List */}
        <div className="grid gap-4">
          {areas.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-[Cairo]">لا توجد مناطق توصيل مسجلة حالياً</p>
            </div>
          ) : (
            areas.map((area) => (
              <div
                key={area.id}
                className={`group p-4 rounded-xl border transition-all hover:shadow-md ${
                  editingId === area.id ? 'bg-orange-50/30 border-orange-200' : 'bg-white border-gray-100'
                }`}
              >
                {editingId === area.id ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="font-[Cairo]"
                        placeholder="اسم الحي"
                        required
                      />
                      <Input
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="font-[Cairo]"
                        placeholder="المدينة"
                        required
                      />
                      <Input
                        value={editFormData.governorate}
                        onChange={(e) => setEditFormData({ ...editFormData, governorate: e.target.value })}
                        className="font-[Cairo]"
                        placeholder="المحافظة"
                        required
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 font-[Cairo]"
                      >
                        <X className="w-4 h-4 ml-1" /> إلغاء
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="bg-[#00549A] hover:bg-[#004480] text-white h-9 font-[Cairo]"
                      >
                        <Check className="w-4 h-4 ml-1" /> حفظ والتحديث
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Navigation className="w-5 h-5 text-[#00549A]" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-[Cairo] mb-0.5">اسم الحي</p>
                          <p className="font-[Cairo] font-bold text-[#101727]">{area.name}</p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-[Cairo] mb-0.5">المدينة</p>
                          <p className="font-[Cairo] font-bold text-[#101727]">{area.city}</p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-[Cairo] mb-0.5">المحافظة</p>
                          <p className="font-[Cairo] font-bold text-[#101727]">{area.governorate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(area)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

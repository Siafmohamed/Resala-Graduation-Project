import React, { useState } from 'react';
import { 
  useDonors, 
  useRegisterDonor, 
  useUpdateDonor 
} from '../hooks/useDonors';
import { DonorTable } from '../components/list/DonorTable';
import { DonorRegistrationForm } from '../components/forms/DonorRegistrationForm';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Loader2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import type { Donor, DonorRegistrationPayload } from '../types/donors.types';

export default function DonorsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  const { data: donors = [], isLoading, isError } = useDonors();
  const { mutate: registerDonor, isPending: isRegistering } = useRegisterDonor();
  const { mutate: updateDonor, isPending: isUpdating } = useUpdateDonor();

  const filteredDonors = donors.filter(d => 
    d.fullName.toLowerCase().includes(search.toLowerCase()) || 
    d.phone.includes(search)
  );

  const handleOpenAddModal = () => {
    setEditingDonor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (donor: Donor) => {
    setEditingDonor(donor);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: DonorRegistrationPayload) => {
    if (editingDonor) {
      updateDonor({ id: editingDonor.id, payload: data }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      registerDonor(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">قاعدة بيانات المتبرعين</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">إدارة بيانات المتبرعين والتواصل معهم</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all font-[Cairo]"
        >
          <Plus size={20} />
          تسجيل متبرع جديد
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-none shadow-sm rounded-2xl bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-[#00549A]">
              <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#94a3b8] font-[Cairo]">إجمالي المتبرعين</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{donors.length}</span>
            </div>
          </div>
        </Card>
        {/* Additional Stats can go here */}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 transition-all font-[Cairo] text-sm"
            placeholder="ابحث باسم المتبرع أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 text-[#495565] rounded-xl font-bold hover:bg-gray-50 transition-all font-[Cairo] text-sm shadow-sm">
          <Filter size={18} className="text-[#94a3b8]" />
          تصفية متقدمة
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
          <p className="font-[Cairo] text-[#94a3b8]">جاري تحميل البيانات...</p>
        </div>
      ) : isError ? (
        <div className="py-24 text-center bg-white rounded-3xl border-2 border-red-50">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="font-bold text-[#101727] font-[Cairo]">حدث خطأ أثناء التحميل</h3>
          <p className="text-[#697282] font-[Cairo]">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="p-4 rounded-full bg-gray-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-300" />
          </div>
          <h3 className="font-bold text-[#101727] font-[Cairo]">لا توجد نتائج</h3>
          <p className="text-[#697282] font-[Cairo]">جرب تغيير كلمات البحث</p>
        </div>
      ) : (
        <DonorTable donors={filteredDonors} onEdit={handleOpenEditModal} />
      )}

      {/* Registration/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDonor ? 'تعديل بيانات المتبرع' : 'تسجيل متبرع جديد'}
        maxWidth="max-w-3xl"
      >
        <div className="p-6">
          <DonorRegistrationForm
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            initialData={editingDonor ? {
              fullName: editingDonor.fullName,
              phone: editingDonor.phone,
              email: editingDonor.email,
              address: editingDonor.address,
              notes: editingDonor.notes
            } : undefined}
            isSubmitting={isRegistering || isUpdating}
          />
        </div>
      </Modal>
    </div>
  );
}

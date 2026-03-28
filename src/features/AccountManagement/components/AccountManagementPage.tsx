import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus,
  Shield,
  ShieldCheck,
  UserCog,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ROLE_LABELS_AR, Role } from '@/features/authentication';
import { useAccounts, useDeleteStaff } from '../hooks/useAccounts';
import { useUserRole } from '@/features/authentication/store/authSlice';
import type { Account } from '../types/accountManagement.types';
import { StaffFormModal } from './StaffFormModal';
import { DeleteStaffModal } from './DeleteStaffModal';
import { Navigate } from 'react-router-dom';

export function AccountManagementPage() {
  const userRole = useUserRole();

  if (userRole !== Role.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Account | null>(null);

  const { data: accounts = [], isLoading, isError } = useAccounts();

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.fullName.toLowerCase().includes(search.toLowerCase()) || 
                         acc.username.toLowerCase().includes(search.toLowerCase()) ||
                         acc.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || acc.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (staff: Account) => {
    setSelectedStaff(staff);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (staff: Account) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة الحسابات</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">إدارة صلاحيات الموظفين ومسؤولي النظام</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 font-[Cairo]"
        >
          <UserPlus size={20} strokeWidth={2.5} />
          إضافة حساب جديد
        </button>
      </div>

      {/* Stats / Cards Summary (Optional based on design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e6eff7] text-[#00549A]">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">إجمالي المسؤولين</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{accounts.filter(a => a.role === 'Admin').length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e9f9ef] text-[#22c55e]">
              <UserCog size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">إجمالي موظفي الاستقبال</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{accounts.filter(a => a.role === 'Reception').length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#fdeceb] text-[#F04930]">
              <Shield size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">حسابات غير نشطة</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{accounts.filter(a => a.status !== 'active').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
            <input
              className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#f8fafc] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] transition-all font-[Cairo] text-sm"
              placeholder="ابحث بالاسم، اسم المستخدم، أو البريد الإلكتروني..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
            <select 
              className="w-full pr-12 pl-10 py-3 rounded-xl bg-[#f8fafc] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00549A]/10 focus:border-[#00549A] appearance-none cursor-pointer font-[Cairo] text-sm"
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">جميع الأدوار</option>
              <option value="Admin">مدير نظام</option>
              <option value="Reception">موظف استقبال</option>
              <option value="FormManager">مسؤول نماذج</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697282] pointer-events-none" size={16} />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
              <p className="font-[Cairo] text-[#697282]">جاري تحميل الحسابات...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <div className="w-16 h-16 bg-[#fff5f3] text-[#F04930] rounded-full flex items-center justify-center">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="font-bold text-[#101727] font-[Cairo]">حدث خطأ أثناء التحميل</h3>
                <p className="text-sm text-[#697282] font-[Cairo] mt-1">يرجى التحقق من الصلاحيات والمحاولة مرة أخرى</p>
              </div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 bg-gray-50 text-[#697282] rounded-full flex items-center justify-center">
                <Search size={32} />
              </div>
              <p className="font-[Cairo] text-[#697282]">لا توجد حسابات تطابق بحثك</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المستخدم</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">اسم المستخدم</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الدور</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">رقم الهاتف</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">آخر دخول</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6eff7] flex items-center justify-center text-[#00549A] font-bold">
                            {acc.fullName[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#101727] font-[Cairo] text-sm">{acc.fullName}</span>
                            <span className="text-xs text-[#697282] font-[Cairo]">{acc.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#495565] font-mono">{acc.username}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-[Cairo] ${
                          acc.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 
                          acc.role === 'Reception' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                        }`}>
                          {ROLE_LABELS_AR[acc.role as Role] || acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#495565]">{acc.phoneNumber || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-[Cairo] ${
                          acc.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                          {acc.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-[#697282] font-[Cairo]">{acc.lastLoginAt || 'لم يسجل دخول بعد'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(acc)}
                            className="p-2 text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all"
                            title="تعديل"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(acc)}
                            className="p-2 text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {isFormModalOpen && (
        <StaffFormModal 
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          staff={selectedStaff}
        />
      )}

      {isDeleteModalOpen && selectedStaff && (
        <DeleteStaffModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          staff={selectedStaff}
        />
      )}
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  UserPlus,
  Shield,
  ShieldCheck,
  UserCog,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ROLE_LABELS_AR, Role, useUserRole } from '@/features/authentication';
import { useAccounts } from '../hooks/useAccounts';
import type { StaffAccount } from '../types/accountManagement.types';
import { StaffFormModal } from './StaffFormModal';
import { DeleteStaffModal } from './DeleteStaffModal';
import { Navigate } from 'react-router-dom';

const getRoleFromStaffType = (staffType: string): Role => {
  if (staffType.toLowerCase().includes('admin') || staffType.includes('1')) return Role.ADMIN;
  if (staffType.toLowerCase().includes('reception') || staffType.includes('2')) return Role.RECEPTIONIST;
  return Role.FORM_MANAGER;
};

export function AccountManagementPage() {
  const userRole = useUserRole();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  
  const { data, isLoading, isError } = useAccounts({ search: debouncedSearch, pageNumber, pageSize });
  const accounts = data?.items ?? [];

  const totalPages = data ? Math.ceil((data.totalRows || 0) / (data.pageSize || pageSize)) : 0;
  const currentPage = data?.pageIndex || pageNumber;

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setFilterRole(value);
    setPageNumber(1);
  };

  if (userRole !== Role.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const accRole = getRoleFromStaffType(acc.staffType);
      return filterRole === 'all' || accRole === filterRole;
    });
  }, [accounts, filterRole]);



  const handleDeleteClick = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsFormModalOpen(true);
  };

  const totalAdmins = useMemo(() => 
    accounts.filter(a => getRoleFromStaffType(a.staffType) === Role.ADMIN).length, 
    [accounts]
  );
  
  const totalReceptionists = useMemo(() => 
    accounts.filter(a => getRoleFromStaffType(a.staffType) === Role.RECEPTIONIST).length, 
    [accounts]
  );
  
  const inactiveAccounts = useMemo(() => 
    accounts.filter(a => !a.isActive).length, 
    [accounts]
  );

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      <div className="flex justify-end">
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 font-[Cairo]"
        >
          <UserPlus size={20} strokeWidth={2.5} />
          إضافة حساب جديد
        </button>
      </div>

      {/* Stats / Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e6eff7] text-[#00549A]">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">إجمالي المسؤولين</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{totalAdmins}</span>
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
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{totalReceptionists}</span>
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
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{inactiveAccounts}</span>
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
              onChange={(e) => handleRoleFilterChange(e.target.value)}
            >
              <option value="all">جميع الأدوار</option>
              <option value={Role.ADMIN}>مدير نظام</option>
              <option value={Role.RECEPTIONIST}>موظف استقبال</option>
              <option value={Role.FORM_MANAGER}>مسؤول نماذج</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697282] pointer-events-none" size={16} />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8fafc]">
            <h3 className="font-[Cairo] font-bold text-[#101727] text-sm">قائمة الحسابات</h3>
            <div className="px-3 py-1 bg-[#00549A]/5 text-[#00549A] rounded-lg text-xs font-bold font-[Cairo]">
              {data?.totalRows ?? 0} حساب
            </div>
          </div>

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
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المستخدم</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">اسم المستخدم</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الدور</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">رقم الهاتف</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">تاريخ الإنشاء</th>
                    <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {filteredAccounts.map((acc) => {
                    const role = getRoleFromStaffType(acc.staffType);
                    return (
                      <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#e6eff7] flex items-center justify-center text-[#00549A] font-bold">
                              {acc.name[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#101727] font-[Cairo] text-sm">{acc.name}</span>
                              <span className="text-xs text-[#697282] font-[Cairo]">{acc.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#495565] font-mono">{acc.username}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] ${
                            role === Role.ADMIN ? 'bg-purple-50 text-purple-700' :
                            role === Role.RECEPTIONIST ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                          }`}>
                            {ROLE_LABELS_AR[role] || acc.staffType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#495565]">{acc.phone || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-[Cairo] ${
                            acc.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.isActive ? 'bg-green-600' : 'bg-red-600'}`} />
                            {acc.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-[#697282] font-[Cairo]">
                            {acc.createdOn ? new Date(acc.createdOn).toLocaleDateString('ar-EG') : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 font-[Cairo]">عرض:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#00549A]/10 outline-none font-[Cairo] text-xs font-bold transition-all cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />

                  <div className="text-xs font-bold text-gray-400 font-[Cairo]">
                    صفحة {currentPage} من {totalPages}
                  </div>
                </div>
              </div>
            )}
            </>
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

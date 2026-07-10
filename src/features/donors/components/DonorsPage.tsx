import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, ArrowUpRight, Search, Loader2, Award } from 'lucide-react';

import { Pagination } from '@/shared/components/ui/Pagination';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { useDonors } from '../hooks/useDonors';
import { useDonorStore } from '../store/donorSlice';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import { DirectOperationsModal } from './DirectOperationsModal';
import type { FinancialAnalysisDonor } from '../types/donor.types';
import { useFinancialSummary } from '@/features/authentication/hooks/useDashboard';

export function DonorsPage() {
  const { data, isLoading, isError, error, refetch } = useDonors();
  const setTotal = useDonorStore((s) => s.setTotal);
  const setPage = useDonorStore((s) => s.setPage);
  const setSearch = useDonorStore((s) => s.setSearch);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<FinancialAnalysisDonor | null>(null);
  const [showDirectOpsModal, setShowDirectOpsModal] = useState(false);
  const [showMostActiveDonorsModal, setShowMostActiveDonorsModal] = useState(false);
  const { data: financialSummary, isLoading: isFinancialSummaryLoading } = useFinancialSummary();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) setTotal(data.totalRows);
  }, [data, setTotal]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const totalPages = data ? Math.ceil(data.totalRows / (data.pageSize || 10)) : 1;

  if (isError && error) {
    return (
      <div className="p-8">
        <ErrorMessage error={error instanceof Error ? error.message : "حدث خطأ"} retry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen p-8 flex-col gap-6 bg-[#f8fafc]" dir="rtl">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowMostActiveDonorsModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00549A] text-white font-[Cairo] font-bold text-sm hover:bg-[#004077] transition-colors"
        >
          <Award size={16} />
          أكثر المتبرعين نشاطًا
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="ابحث باسم المتبرع أو رقم الهاتف أو البريد الإلكتروني..."
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A] transition-all font-[Cairo] text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-linear-to-r from-white to-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-8 bg-[#00549A] rounded-full"></span>
              <h3 className="font-[Cairo] font-black text-[#101727] text-lg">قائمة المتبرعين</h3>
              <div className="mr-3 px-3 py-1 bg-[#00549A]/5 text-[#00549A] rounded-lg text-xs font-bold font-[Cairo]">
                {data?.totalRows ?? 0} متبرع
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
              <p className="font-[Cairo] text-gray-400 font-bold animate-pulse">جاري تحميل البيانات...</p>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
              <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center mb-6 text-gray-200">
                <Users size={48} />
              </div>
              <h3 className="font-[Cairo] font-bold text-[#101727] text-xl mb-2">لا توجد نتائج</h3>
              <p className="font-[Cairo] text-[#697282] max-w-sm">لم نجد أي متبرعين يطابقون بحثك.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="bg-gray-50/50 text-[#697282] font-[Cairo] text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-5 text-right">اسم المتبرع</th>
                    <th className="px-6 py-5 text-right">رقم الهاتف</th>
                    <th className="px-6 py-5 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.items.map((donor) => (
                    <tr key={donor.donorId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#00549A] to-[#0081ED] flex items-center justify-center text-white font-black font-[Cairo] text-lg shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                            {donor.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-[Cairo] font-bold text-[#101727] text-sm group-hover:text-[#00549A] transition-colors">{donor.fullName}</span>
                            <span className="text-[11px] text-gray-400 font-[Cairo] font-medium">{donor.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-[Cairo] text-[#697282] text-sm">{donor.phoneNumber}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-2 items-center justify-start">
                          <button
                            onClick={() => navigate(`/donors/${donor.donorId}`)}
                            className="px-4 py-2 rounded-xl border border-[#00549A]/20 text-[#00549A] font-bold font-[Cairo] text-xs hover:bg-[#00549A] hover:text-white hover:border-[#00549A] hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
                          >
                            عرض التفاصيل
                            <ArrowUpRight size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDonor(donor);
                              setShowDirectOpsModal(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#00549A] text-white font-bold font-[Cairo] text-xs hover:bg-[#004077] hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
                          >
                            <CreditCard size={14} />
                            الإجراءات
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="bg-gray-50/50">
              <Pagination
                currentPage={data?.pageIndex || 1}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direct Operations Modal */}
      {showDirectOpsModal && selectedDonor && (
        <DirectOperationsModal
          isOpen={showDirectOpsModal}
          onClose={() => {
            setShowDirectOpsModal(false);
            setSelectedDonor(null);
          }}
          donor={{
            id: selectedDonor.donorId,
            fullName: selectedDonor.fullName,
            phone: selectedDonor.phoneNumber
          }}
        />
      )}

      {/* Most Active Donors Modal */}
      <Modal
        isOpen={showMostActiveDonorsModal}
        onClose={() => setShowMostActiveDonorsModal(false)}
        title="أكثر المتبرعين نشاطًا"
        maxWidth="max-w-2xl"
      >
        <div className="p-6" dir="rtl">
          {isFinancialSummaryLoading ? (
            <div className="py-10 flex items-center justify-center gap-3 text-[#697282] font-[Cairo]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري تحميل البيانات...</span>
            </div>
          ) : (financialSummary?.mostActiveDonors?.length ?? 0) === 0 ? (
            <div className="py-10 text-center text-[#697282] font-[Cairo]">لا توجد بيانات متاحة</div>
          ) : (
            <div className="space-y-3">
              {financialSummary?.mostActiveDonors?.map((donor, index) => (
                <div
                  key={donor.donorId}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-[#f8fafc]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#00549A]/10 text-[#00549A] font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-[Cairo] font-bold text-[#101727] text-sm">{donor.fullName}</span>
                      <span className="font-[Cairo] text-xs text-[#697282]">معرف المتبرع: #{donor.donorId}</span>
                    </div>
                  </div>
                  <span className="font-[Cairo] font-bold text-[#00549A] text-sm">
                    {donor.totalAmount.toLocaleString()} ج.م
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
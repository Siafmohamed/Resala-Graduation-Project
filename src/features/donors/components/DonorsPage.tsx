import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, ChevronRight, Gift } from 'lucide-react';
import { toast } from 'react-toastify';

import { DonorSearchBar } from './DonorSearchBar';
import { DonorFilters } from './DonorFilters';
import { DonorsTable } from './DonorsTable';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { useDonors } from '../hooks/useDonors';
import { useDonorStore } from '../store/donorSlice';
import { Card, CardContent } from '@/shared/components/ui/Card';

export function DonorsPage() {
  const { data, isLoading, isError, error, refetch } = useDonors();
  const setTotal = useDonorStore((s) => s.setTotal);
  const pagination = useDonorStore((s) => s.pagination);
  const setPage = useDonorStore((s) => s.setPage);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [showSmartSponsorship, setShowSmartSponsorship] = useState(false);
  const [newDonorName, setNewDonorName] = useState('');

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  useEffect(() => {
    // Check if we just came from registration with smart sponsorship intent
    if (location.state?.openSponsorship) {
      setShowSmartSponsorship(true);
      setNewDonorName(location.state.donorName || 'المتبرع الجديد');
      // Clear state so it doesn't pop up again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const totalPages = Math.ceil(
    pagination.total / pagination.pageSize || 1
  );

  const handleCompleteSponsorship = () => {
    toast.success('تم إعداد الكفالة الذكية بنجاح');
    setShowSmartSponsorship(false);
    refetch();
  };

  if (isError && error) {
    return (
      <div className="p-6">
        <ErrorMessage error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div
      className="flex w-full min-h-screen p-8 flex-col gap-6"
      dir="rtl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DonorSearchBar />
        <DonorFilters />
      </div>

      <p className="text-sm text-muted-foreground font-[Cairo]">
        عرض {data?.donors.length ?? 0} من {pagination.total} متبرع
      </p>

      <DonorsTable donors={data?.donors ?? []} isLoading={isLoading} />

      {totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Smart Sponsorship Modal */}
      {showSmartSponsorship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00549A]/20 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl border-none shadow-[0px_20px_60px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
            <CardContent className="p-0">
              <div className="relative">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-[#00549A] to-[#0081ED] opacity-[0.03]" />
                
                <div className="p-10 flex flex-col items-center text-center gap-8 relative z-10">
                  {/* Icon & Success Message */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-[32px] bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34] shadow-inner">
                      <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-[Cairo] font-bold text-3xl text-[#101727]">تم تسجيل المتبرع!</h2>
                      <p className="font-[Cairo] text-[#697282] text-lg">
                        تمت إضافة <span className="text-[#00549A] font-bold">{newDonorName}</span> بنجاح.
                      </p>
                    </div>
                  </div>

                  {/* Smart Options Grid */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-[24px] border-2 border-[#00549A]/10 bg-[#00549A]/[0.02] hover:bg-[#00549A]/[0.05] transition-all group cursor-pointer text-right flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#00549A] text-white flex items-center justify-center shadow-lg shadow-[#00549A]/20 group-hover:scale-110 transition-transform">
                        <Heart size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-[Cairo] font-bold text-[#101727]">كفالة أيتام ذكية</h4>
                        <p className="font-[Cairo] text-xs text-[#697282] leading-relaxed">توزيع مبلغ الكفالة على الحالات الأكثر احتياجاً بشكل تلقائي.</p>
                      </div>
                      <button 
                        onClick={handleCompleteSponsorship}
                        className="mt-auto flex items-center gap-2 text-[#00549A] font-bold font-[Cairo] text-sm group-hover:gap-3 transition-all"
                      >
                        تفعيل الآن
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="p-6 rounded-[24px] border-2 border-gray-100 bg-white hover:border-[#00549A]/20 transition-all group cursor-pointer text-right flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEF3FB] text-[#00549A] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Gift size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-[Cairo] font-bold text-[#101727]">كفالة طالب علم</h4>
                        <p className="font-[Cairo] text-xs text-[#697282] leading-relaxed">دعم المسيرة التعليمية لطلاب المدارس والجامعات غير القادرين.</p>
                      </div>
                      <button 
                        onClick={handleCompleteSponsorship}
                        className="mt-auto flex items-center gap-2 text-[#697282] font-bold font-[Cairo] text-sm group-hover:text-[#00549A] transition-all"
                      >
                        اختيار هذا النوع
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="w-full flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setShowSmartSponsorship(false)}
                      className="flex-1 py-4 rounded-2xl bg-[#F8FAFC] text-[#697282] font-bold font-[Cairo] hover:bg-gray-100 transition-all"
                    >
                      إغلاق، سأقوم بذلك لاحقاً
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { useFeedbackList } from '../hooks/useFeedback';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { FeedbackType, FeedbackStatus, Feedback } from '../services/feedbackService';
import FeedbackFilters from './FeedbackFilters';
import FeedbackTable from './FeedbackTable';
import FeedbackDetailModal from './FeedbackDetailModal';
import { Pagination } from '@/shared/components/ui/Pagination';

export function FeedbackComplaintsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const { data, isLoading, isError, error, refetch } = useFeedbackList({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    pageNumber: page,
    pageSize: pageSize,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleTypeChange = (type: FeedbackType | 'all') => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleStatusChange = (status: FeedbackStatus | 'all') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleClearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  const totalPages = data ? Math.ceil((data.totalRows || 0) / pageSize) : 0;

  if (isError && error) {
    return (
      <div className="p-8">
        <ErrorMessage error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl text-[#00549A]">
              <MessageSquare size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#101727] font-[Cairo] tracking-tight">
                الآراء والشكاوى
              </h1>
              <p className="text-[#697282] font-[Cairo] text-sm font-medium">
                إدارة آراء المتبرعين والشكاوى الواردة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FeedbackFilters
        type={typeFilter}
        status={statusFilter}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
        onClear={handleClearFilters}
      />

      {/* Main Content Area */}
      <Card className="border-none shadow-[0px_10px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-8 bg-[#00549A] rounded-full" />
              <h3 className="font-[Cairo] font-black text-[#101727] text-lg">
                قائمة الطلبات
              </h3>
              <div className="mr-3 px-3 py-1 bg-blue-50 text-[#00549A] rounded-lg text-xs font-bold font-[Cairo]">
                {data?.totalRows ?? 0} طلب
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare size={16} className="text-[#00549A]" />
                </div>
              </div>
              <p className="font-[Cairo] text-gray-400 font-bold animate-pulse">
                جاري تحميل البيانات...
              </p>
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-6">
              <div className="w-24 h-24 rounded-[32px] bg-blue-50 flex items-center justify-center mb-6 text-blue-200">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-400 font-[Cairo] max-w-sm mb-6">
                لم يتم العثور على أي آراء أو شكاوى تطابق خيارات التصفية الحالية
              </p>
              {(typeFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-xl border border-[#00549A]/20 text-[#00549A] font-bold font-[Cairo] text-xs hover:bg-[#00549A] hover:text-white hover:border-[#00549A] transition-all duration-300"
                >
                  مسح التصفية
                </button>
              )}
            </div>
          ) : (
            <>
              <FeedbackTable
                items={data.items}
                onView={(item) => setSelectedFeedback(item)}
              />
              
              {/* Pagination */}
              <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30">
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
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  
                  <div className="text-xs font-bold text-gray-400 font-[Cairo]">
                    صفحة {page} من {totalPages}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

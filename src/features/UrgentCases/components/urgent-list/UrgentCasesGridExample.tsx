/**
 * Example Component: Using UrgentCaseCard with API-driven data fetching
 * 
 * This component demonstrates how to:
 * 1. Fetch a list of urgent case IDs
 * 2. Render multiple UrgentCaseCard instances
 * 3. Handle loading and error states
 * 4. Refetch the entire list when cases are updated
 */

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { UrgentCaseCard } from './UrgentCaseCard';
import { useUrgentCases } from '../hooks/useUrgentCases';

/**
 * Grid layout for displaying multiple urgent case cards
 * Each card fetches its own data by ID from the API
 */
export function UrgentCasesGrid() {
  // Fetch the list of all urgent cases
  const { data: cases, isLoading, isError, error, refetch } = useUrgentCases();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
          <p className="text-[#697282] font-[Cairo]">جاري تحميل الحالات العاجلة...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 font-[Cairo]">حدث خطأ</h3>
              <p className="text-red-700 text-sm mt-1 font-[Cairo]">
                {error instanceof Error ? error.message : 'فشل في تحميل الحالات العاجلة'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-[Cairo] hover:bg-red-700 transition"
              >
                إعادة محاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!cases || cases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[#697282] font-[Cairo] text-lg">لا توجد حالات عاجلة</p>
          <p className="text-[#99A3B3] font-[Cairo] text-sm mt-2">
            سيتم عرض الحالات العاجلة هنا عند إضافتها
          </p>
        </div>
      </div>
    );
  }

  // Grid with multiple cards
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <UrgentCaseCard
            key={caseItem.id}
            caseId={caseItem.id}
            onSuccess={() => {
              // Refetch the entire list when a card is updated
              refetch();
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example with pagination
 * Use this if you have many cases and want to load them in batches
 */
export function UrgentCasesPaginatedGrid() {
  const [pageSize] = React.useState(9); // 9 cards per page
  const [pageIndex, setPageIndex] = React.useState(0);

  const { data: allCases, isLoading, isError, refetch } = useUrgentCases();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-[Cairo]">فشل في تحميل الحالات</p>
      </div>
    );
  }

  const paginatedCases = allCases?.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  ) || [];

  const totalPages = Math.ceil((allCases?.length || 0) / pageSize);

  return (
    <div className="w-full space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCases.map((caseItem) => (
          <UrgentCaseCard
            key={caseItem.id}
            caseId={caseItem.id}
            onSuccess={() => refetch()}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="px-4 py-2 bg-[#00549A] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003d6b] transition font-[Cairo]"
          >
            السابق
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPageIndex(i)}
                className={`w-10 h-10 rounded-lg font-[Cairo] transition ${
                  i === pageIndex
                    ? 'bg-[#00549A] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            disabled={pageIndex === totalPages - 1}
            className="px-4 py-2 bg-[#00549A] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003d6b] transition font-[Cairo]"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Filtering cases by urgency level
 */
export function UrgentCasesByUrgencyLevel() {
  const [selectedLevel, setSelectedLevel] = React.useState<1 | 2 | 3 | 'all'>('all');
  const { data: allCases, isLoading, refetch } = useUrgentCases();

  const filteredCases = allCases?.filter((c) =>
    selectedLevel === 'all' ? true : c.urgencyLevel === selectedLevel
  ) || [];

  const levelLabels: Record<1 | 2 | 3 | 'all', string> = {
    'all': 'الكل',
    '1': 'عادي',
    '2': 'عاجل',
    '3': 'حرج جداً',
  };

  return (
    <div className="w-full space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 1, 2, 3] as const).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg font-[Cairo] transition ${
              selectedLevel === level
                ? 'bg-[#00549A] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {levelLabels[level]}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-[#00549A] animate-spin" />
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#697282] font-[Cairo]">لا توجد حالات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <UrgentCaseCard
              key={caseItem.id}
              caseId={caseItem.id}
              onSuccess={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UrgentCasesGrid;

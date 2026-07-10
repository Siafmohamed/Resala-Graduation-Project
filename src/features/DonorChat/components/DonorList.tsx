import React from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Pagination } from '@/shared/components/ui/Pagination';
import { DonorCard } from './DonorCard';
import type { DonorListItem } from '../types/donor';

interface DonorListProps {
  donors: DonorListItem[];
  totalRows: number;
  currentPage: number;
  pageSize: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  selectedDonorId?: number;
  onDonorSelect: (donor: DonorListItem) => void;
  isLoading: boolean;
  isError?: boolean;
}

export const DonorList: React.FC<DonorListProps> = ({
  donors,
  totalRows,
  currentPage,
  pageSize,
  search,
  onSearchChange,
  onPageChange,
  selectedDonorId,
  onDonorSelect,
  isLoading,
  isError,
}) => {
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <div className="flex flex-col h-full bg-white border-l border-blue-200">
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MessageCircle size={20} className="text-blue-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">المحادثات</h2>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن متبرع..."
            dir="rtl"
            className="
              w-full pr-10 pl-4 py-2 border border-blue-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
              font-[Cairo]
            "
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="p-6 bg-blue-50 rounded-full mb-4">
              <Search size={48} className="text-blue-300" />
            </div>
            <p className="font-[Cairo]">لا توجد نتائج</p>
          </div>
        ) : (
          donors.map((donor) => (
            <DonorCard
              key={donor.id}
              donor={donor}
              isActive={selectedDonorId === donor.id}
              onClick={() => onDonorSelect(donor)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-blue-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

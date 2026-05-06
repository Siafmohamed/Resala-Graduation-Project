import React from 'react';
import { ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { PaginationInfo } from '../types';

interface PaginationProps {
  info: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  info,
  onPageChange,
  onLimitChange,
  className = "",
}) => {
  const { total, page, limit, totalPages, hasNext, hasPrev } = info;

  // Generate page numbers to display
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 ${className}`}>
      {/* Range Info */}
      <div className="text-sm text-gray-500 font-[Cairo]">
        عرض <span className="font-bold text-[#101727]">{from}–{to}</span> من أصل <span className="font-bold text-[#101727]">{total}</span> سجل
      </div>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="h-9 w-9 rounded-xl border-gray-200 text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
        >
          <ChevronRight size={18} />
        </Button>

        <div className="flex items-center gap-1">
          {getPages().map((p, i) => (
            <React.Fragment key={i}>
              {p === '...' ? (
                <div className="w-9 h-9 flex items-center justify-center text-gray-400">
                  <MoreHorizontal size={14} />
                </div>
              ) : (
                <Button
                  variant={page === p ? "default" : "ghost"}
                  onClick={() => onPageChange(p as number)}
                  className={`h-9 min-w-[36px] rounded-xl font-bold font-[Cairo] text-sm transition-all
                    ${page === p 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="h-9 w-9 rounded-xl border-gray-200 text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={18} />
        </Button>
      </div>

      {/* Limit Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400 font-[Cairo] uppercase">النتائج:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold font-[Cairo] text-[#101727] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer"
        >
          {[10, 25, 50, 100].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

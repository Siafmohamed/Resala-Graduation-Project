import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100" dir="rtl">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#697282] font-[Cairo]">الصفحة {currentPage} من {totalPages}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-[Cairo] transition-all
            ${currentPage === 1 
              ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
              : 'text-[#00549A] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
            }
          `}
        >
          <ChevronRight size={18} />
          <span>السابق</span>
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Only show current, first, last, and neighbors
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    w-10 h-10 rounded-xl text-sm font-bold font-[Cairo] transition-all
                    ${currentPage === page 
                      ? 'bg-[#00549A] text-white shadow-lg shadow-[#00549A]/20' 
                      : 'text-[#697282] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
                    }
                  `}
                >
                  {page}
                </button>
              );
            }
            if (page === currentPage - 2 && page > 2) {
              return <span key={page} className="text-gray-300 px-1">...</span>;
            }
            if (page === currentPage + 2 && page < totalPages - 1) {
              return <span key={page} className="text-gray-300 px-1">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-[Cairo] transition-all
            ${currentPage === totalPages 
              ? 'text-gray-300 cursor-not-allowed pointer-events-none' 
              : 'text-[#00549A] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
            }
          `}
        >
          <span>التالي</span>
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

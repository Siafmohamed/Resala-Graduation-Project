import React from 'react';

export const DataTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 rounded-t-2xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
        ))}
      </div>
      
      {/* Table Rows Skeleton */}
      <div className="space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="flex items-center justify-center">
              <div className="h-6 bg-gray-100 rounded-full w-20" />
            </div>
            <div className="flex items-center">
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
            <div className="flex items-center">
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

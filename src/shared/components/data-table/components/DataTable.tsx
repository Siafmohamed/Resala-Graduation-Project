import React from 'react';
import { useDataTable } from '../useDataTable';
import { FilterBar } from './FilterBar';
import { SearchInput } from './SearchInput';
import { Pagination } from './Pagination';
import { DataTableSkeleton } from './DataTableSkeleton';
import { EmptyState } from './EmptyState';
import { FilterConfig } from '../types';
import { ErrorMessage } from '../../../shared/components/feedback/ErrorMessage';

interface DataTableProps<T> {
  title: string;
  description?: string;
  fetchData: (state: any) => Promise<any>;
  filtersConfig?: FilterConfig[];
  renderRow: (item: T) => React.ReactNode;
  headers: string[];
  searchPlaceholder?: string;
  initialLimit?: number;
}

export function DataTable<T>({
  title,
  description,
  fetchData,
  filtersConfig = [],
  renderRow,
  headers,
  searchPlaceholder,
  initialLimit = 10,
}: DataTableProps<T>) {
  const {
    state,
    data,
    pagination,
    isLoading,
    isError,
    setSearch,
    setPage,
    setLimit,
    setFilter,
    removeFilter,
    clearFilters,
    resetAll,
  } = useDataTable<T>({
    fetchData,
    initialState: { limit: initialLimit },
  });

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#fbfcfd] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-[Cairo] font-black text-3xl text-[#101727] tracking-tight">{title}</h1>
          {description && (
            <p className="font-[Cairo] font-medium text-sm text-[#697282]">{description}</p>
          )}
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-6 rounded-[28px] shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-gray-50 space-y-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <SearchInput
            value={state.search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
            className="flex-1 w-full"
          />
        </div>

        <FilterBar
          configs={filtersConfig}
          activeFilters={state.filters}
          onFilterChange={setFilter}
          onFilterRemove={removeFilter}
          onClearAll={clearFilters}
          resultCount={data.length}
          totalCount={pagination.total}
        />
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-[32px] shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
        {isLoading ? (
          <DataTableSkeleton rows={state.limit} />
        ) : isError ? (
          <div className="p-20">
            <ErrorMessage error="حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى." />
          </div>
        ) : data.length === 0 ? (
          <EmptyState onReset={resetAll} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  {headers.map((header, i) => (
                    <th key={i} className="px-8 py-5 text-right text-xs font-bold text-gray-400 font-[Cairo] uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => renderRow(item))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        {!isLoading && data.length > 0 && (
          <div className="border-t border-gray-50 bg-gray-50/20">
            <Pagination
              info={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}
      </div>
    </div>
  );
}

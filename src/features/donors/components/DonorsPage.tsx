import { useEffect } from 'react';

import { DonorSearchBar } from './DonorSearchBar';
import { DonorFilters } from './DonorFilters';
import { DonorsTable } from './DonorsTable';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { useDonors } from '../hooks/useDonors';
import { useDonorStore } from '../store/donorSlice';

export function DonorsPage() {
  const { data, isLoading, isError, error, refetch } = useDonors();
  const setTotal = useDonorStore((s) => s.setTotal);
  const pagination = useDonorStore((s) => s.pagination);
  const setPage = useDonorStore((s) => s.setPage);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const totalPages = Math.ceil(
    pagination.total / pagination.pageSize || 1
  );

  if (isError && error) {
    return (
      <div className="p-6">
        <ErrorMessage error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div
      className="flex w-[1136px] min-h-[120px] p-6 flex-col gap-4 rounded-[10px] border border-[#E0E7EE] bg-white"
      dir="rtl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DonorSearchBar />
        <DonorFilters />
      </div>

      <p className="text-sm text-muted-foreground">
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
    </div>
  );
}
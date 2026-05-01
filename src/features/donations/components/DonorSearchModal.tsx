import { useState } from 'react';
import { useDonorsPaginated } from '../hooks/useInKindDonations';
import { Modal } from '@/shared/components/ui/Modal';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import type { DonorOption } from '../types/inKindDonation.types';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onSelect: (donor: DonorOption) => void;
  onClose: () => void;
}

export function DonorSearchModal({ isOpen, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: rawData, isFetching } = useDonorsPaginated(search, page, PAGE_SIZE);

  // Normalize: API may return a paginated object { data: [], totalCount } or a plain array
  const items = Array.isArray(rawData)
    ? (rawData as { id: number; name: string; phone?: string }[])
    : (rawData?.data ?? []);
  const totalCount = Array.isArray(rawData)
    ? rawData.length
    : (rawData?.totalCount ?? 0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="بحث متقدم عن متبرع" maxWidth="max-w-xl">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pr-10 pl-4 py-2 rounded-xl border-2 border-gray-100 focus:border-primary focus:outline-none transition-all font-[Cairo]"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="الاسم / الهاتف / الرقم..."
            autoFocus
          />
        </div>

        {isFetching && (
          <div className="py-8">
            <LoadingSpinner message="جاري البحث عن المتبرعين..." />
          </div>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {items.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                onSelect({ id: d.id, name: d.name });
                onClose();
              }}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-[Cairo]">{d.name}</h4>
                  {d.phone && <p className="text-xs text-gray-500 font-[Cairo]">{d.phone}</p>}
                </div>
              </div>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">#{d.id}</span>
            </div>
          ))}

          {!isFetching && items.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-[Cairo]">
              لا توجد نتائج تطابق بحثك.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-50">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <span className="text-sm font-bold font-[Cairo]">
              صفحة {page} من {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

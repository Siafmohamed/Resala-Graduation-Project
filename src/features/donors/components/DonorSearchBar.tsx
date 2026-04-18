import { Search } from 'lucide-react';
import { useDonorStore } from '../store/donorSlice';
import { sanitizeSearchQuery } from '@/shared/utils/security/sanitization';

export function DonorSearchBar() {
  const search = useDonorStore((s) => s.filters.search);
  const setSearch = useDonorStore((s) => s.setSearch);

  const handleSearchChange = (val: string) => {
    // Sanitize input before updating store
    const sanitized = sanitizeSearchQuery(val);
    setSearch(sanitized);
  };

  return (
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="البحث بالاسم أو رقم الهاتف"
        className="w-full rounded-md border border-input bg-background py-2 pr-10 pl-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        dir="rtl"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="مسح البحث"
        >
          ×
        </button>
      )}
    </div>
  );
}

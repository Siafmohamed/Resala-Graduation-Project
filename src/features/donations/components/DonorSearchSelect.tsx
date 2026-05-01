import { useState, useRef, useEffect } from 'react';
import { useDonorDropdown } from '../hooks/useInKindDonations';
import { Search, User, ChevronDown, Loader2 } from 'lucide-react';

interface DonorSearchSelectProps {
  /** Called with the selected donor's numeric id and display name */
  onSelect: (donorId: number, donorName: string) => void;
  selectedDonorId?: number | string;
  selectedDonorName?: string;
  error?: boolean;
}

export function DonorSearchSelect({
  onSelect,
  selectedDonorId,
  selectedDonorName,
  error,
}: DonorSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedDonorName ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: donors = [], isFetching } = useDonorDropdown(searchTerm);

  // Close when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const displayName =
    selectedDonorName ?? (selectedDonorId ? `متبرع #${selectedDonorId}` : 'أختر المتبرع');

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl bg-[#F8FAFC] font-[Cairo] text-base text-right transition-all focus:ring-4 focus:ring-[#00549A]/5 border-none ${
          error ? 'ring-2 ring-red-500' : ''
        }`}
      >
        <div className="flex items-center gap-3 text-[#101727]">
          <User size={20} className="text-[#94a3b8]" />
          <span>{displayName}</span>
        </div>
        <ChevronDown
          className={`text-[#94a3b8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search input */}
          <div className="p-4 border-b border-gray-50 bg-[#F8FAFC]">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن متبرع بالاسم..."
                className="w-full px-10 py-3 rounded-xl border-none bg-white font-[Cairo] text-sm focus:ring-2 focus:ring-[#00549A]/10 outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              {isFetching && (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00549A] animate-spin" size={16} />
              )}
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {searchTerm.trim().length === 0 ? (
              <div className="p-8 text-center font-[Cairo] text-sm text-gray-400">
                ابدأ الكتابة للبحث عن متبرع
              </div>
            ) : donors.length === 0 && !isFetching ? (
              <div className="p-8 text-center font-[Cairo] text-sm text-gray-400">
                لا يوجد متبرعين بهذا الاسم
              </div>
            ) : (
              donors.map((donor) => (
                <button
                  key={donor.id}
                  type="button"
                  onClick={() => {
                    onSelect(donor.id, donor.name);
                    setSearchTerm(donor.name);
                    setIsOpen(false);
                  }}
                  className="w-full flex flex-col items-start px-6 py-4 hover:bg-[#EEF3FB] transition-colors text-right"
                >
                  <span className="font-[Cairo] font-bold text-[#101727] text-sm">{donor.name}</span>
                  <span className="font-[Cairo] text-[#697282] text-xs">#{donor.id}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

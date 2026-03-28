import React, { useState } from 'react';
import { useDonors } from '@/features/donors/hooks/useDonors';
import { useDonorStore } from '@/features/donors/store/donorSlice';
import { Search, User, ChevronDown } from 'lucide-react';

interface DonorSearchSelectProps {
  onSelect: (donorId: string, donorName: string) => void;
  selectedDonorId?: string;
  error?: boolean;
}

export function DonorSearchSelect({ onSelect, selectedDonorId, error }: DonorSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setFilters } = useDonorStore();
  const { data, isLoading } = useDonors();
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDonor = data?.donors.find(d => d.id === selectedDonorId);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ search: value });
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl bg-[#F8FAFC] font-[Cairo] text-base text-right transition-all focus:ring-4 focus:ring-[#00549A]/5 border-none ${
          error ? 'ring-2 ring-red-500' : ''
        }`}
      >
        <div className="flex items-center gap-3 text-[#101727]">
          <User size={20} className="text-[#94a3b8]" />
          <span>{selectedDonor ? selectedDonor.name : 'أختر المتبرع'}</span>
        </div>
        <ChevronDown className={`text-[#94a3b8] transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-50 bg-[#F8FAFC]">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="ابحث عن متبرع بالاسم أو الهاتف..."
                className="w-full px-10 py-3 rounded-xl border-none bg-white font-[Cairo] text-sm focus:ring-2 focus:ring-[#00549A]/10 outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center font-[Cairo] text-sm text-gray-400">جاري التحميل...</div>
            ) : data?.donors.length === 0 ? (
              <div className="p-8 text-center font-[Cairo] text-sm text-gray-400">لا يوجد متبرعين بهذا الاسم</div>
            ) : (
              data?.donors.map((donor) => (
                <button
                  key={donor.id}
                  type="button"
                  onClick={() => {
                    onSelect(donor.id, donor.name);
                    setIsOpen(false);
                  }}
                  className="w-full flex flex-col items-start px-6 py-4 hover:bg-[#EEF3FB] transition-colors text-right"
                >
                  <span className="font-[Cairo] font-bold text-[#101727] text-sm">{donor.name}</span>
                  <span className="font-[Cairo] text-[#697282] text-xs">{donor.phone}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

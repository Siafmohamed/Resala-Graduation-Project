import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div className="relative group w-full md:w-80" dir="rtl">
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none transition-colors group-focus-within:text-[#00549A] text-[#94a3b8]">
        <Search size={18} strokeWidth={2} />
      </div>
      <input
        type="text"
        className="
          w-full pr-11 pl-10 py-3 rounded-2xl bg-white border border-gray-100 
          text-sm font-[Cairo] text-[#101727] placeholder:text-[#94a3b8]
          focus:outline-none focus:ring-4 focus:ring-[#00549A]/5 focus:border-[#00549A]
          transition-all shadow-sm group-hover:border-gray-200
        "
        placeholder="بحث باسم المتبرع، الهاتف..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94a3b8] hover:text-[#00549A] transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

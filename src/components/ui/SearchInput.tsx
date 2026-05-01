import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
}

/**
 * Search input with clear button. Caller handles debouncing.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'البحث...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background py-2 pr-10 pl-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        dir="rtl"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
          aria-label="مسح"
        >
          ×
        </button>
      )}
    </div>
  );
}

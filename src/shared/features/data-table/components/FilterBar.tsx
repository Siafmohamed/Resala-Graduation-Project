import React from 'react';
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { FilterConfig, FilterOption } from '../types';

interface FilterBarProps {
  configs: FilterConfig[];
  activeFilters: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onFilterRemove: (id: string) => void;
  onClearAll: () => void;
  resultCount?: number;
  totalCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  configs,
  activeFilters,
  onFilterChange,
  onFilterRemove,
  onClearAll,
  resultCount,
  totalCount,
}) => {
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {configs.map((config) => (
            <FilterDropdown
              key={config.id}
              config={config}
              value={activeFilters[config.id]}
              onChange={(val) => onFilterChange(config.id, val)}
            />
          ))}
        </div>

        {/* Divider */}
        {hasActiveFilters && (
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500 font-[Cairo] ml-auto">
          {resultCount !== undefined && totalCount !== undefined ? (
            <span>عرض {resultCount} من {totalCount} نتيجة</span>
          ) : null}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="text-xs font-bold text-gray-400 font-[Cairo] uppercase tracking-wider ml-1">
            الفلاتر النشطة:
          </span>
          
          {configs.map((config) => {
            const value = activeFilters[config.id];
            if (value === undefined || value === null) return null;

            return (
              <FilterChip
                key={config.id}
                label={config.label}
                value={value}
                config={config}
                onRemove={() => onFilterRemove(config.id)}
              />
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 font-bold font-[Cairo] gap-1"
          >
            <RotateCcw size={12} />
            مسح الكل
          </Button>
        </div>
      )}
    </div>
  );
};

interface FilterDropdownProps {
  config: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ config, value, onChange }) => {
  // Simple implementation for now, in a real app this would be a Popover
  return (
    <div className="relative group">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={`appearance-none pl-4 pr-10 py-2 rounded-xl border text-sm font-bold font-[Cairo] transition-all cursor-pointer outline-none
          ${value 
            ? 'bg-primary/5 border-primary text-primary ring-4 ring-primary/5' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
      >
        <option value="">{config.label}</option>
        {config.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        <ChevronDown size={14} className={value ? 'text-primary' : ''} />
      </div>
    </div>
  );
};

interface FilterChipProps {
  label: string;
  value: any;
  config: FilterConfig;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, value, config, onRemove }) => {
  const displayValue = React.useMemo(() => {
    if (config.type === 'select' || config.type === 'multi-select') {
      const option = config.options?.find(o => o.value === value);
      return option?.label ?? value;
    }
    return value;
  }, [value, config]);

  return (
    <Badge
      variant="secondary"
      className="pl-3 pr-1 py-1 gap-1 bg-white border-gray-200 text-gray-700 shadow-sm rounded-lg hover:border-primary/30 transition-all group"
    >
      <span className="text-[10px] font-bold text-gray-400 font-[Cairo] ml-1">{label}:</span>
      <span className="text-xs font-bold font-[Cairo] text-primary">{displayValue}</span>
      <button
        onClick={onRemove}
        className="p-0.5 rounded-md hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
      >
        <X size={12} />
      </button>
    </Badge>
  );
};

import React from 'react';
import { AlertCircle, Flame, Zap } from 'lucide-react';
import {
  UrgencyLevel,
  urgencyLevelLabels,
  getAllUrgencyLevels,
} from '../../types/urgency-level.types';

interface UrgencyLevelSelectorProps {
  value: UrgencyLevel | null | undefined;
  onChange: (level: UrgencyLevel) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Component for selecting urgency level in forms
 * Displays three buttons for Normal, Urgent, and Critical levels
 */
export const UrgencyLevelSelector: React.FC<UrgencyLevelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const levels = getAllUrgencyLevels();

  const getIcon = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.Normal:
        return <AlertCircle size={18} />;
      case UrgencyLevel.Urgent:
        return <Zap size={18} />;
      case UrgencyLevel.Critical:
        return <Flame size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const getButtonStyles = (level: UrgencyLevel, isSelected: boolean) => {
    const baseStyles =
      'flex-1 py-3.5 px-4 rounded-xl border-2 font-bold font-[Cairo] transition-all transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95';

    switch (level) {
      case UrgencyLevel.Normal:
        return `${baseStyles} ${
          isSelected
            ? 'border-blue-600 bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-200'
            : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
        }`;

      case UrgencyLevel.Urgent:
        return `${baseStyles} ${
          isSelected
            ? 'border-orange-600 bg-gradient-to-b from-orange-50 to-orange-100 text-orange-700 shadow-lg shadow-orange-200'
            : 'border-orange-200 bg-white text-orange-600 hover:border-orange-400 hover:bg-orange-50'
        }`;

      case UrgencyLevel.Critical:
        return `${baseStyles} ${
          isSelected
            ? 'border-red-600 bg-gradient-to-b from-red-50 to-red-100 text-red-700 shadow-lg shadow-red-200'
            : 'border-red-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50'
        }`;

      default:
        return baseStyles;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-bold text-[#495565] font-[Cairo] flex items-center gap-2">
        <span className="text-lg text-[#F04930]">*</span>
        <Flame size={16} className="text-[#F04930]" />
        <span>مستوى الأولوية / الحرجة</span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level.value)}
            className={getButtonStyles(level.value, value === level.value)}
            title={`Select ${level.label} urgency level`}
          >
            {getIcon(level.value)}
            <span className="text-sm">{level.label}</span>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-[#697282] font-[Cairo]">
        اختر مستوى الأولوية المناسب للحالة العاجلة
      </p>
    </div>
  );
};

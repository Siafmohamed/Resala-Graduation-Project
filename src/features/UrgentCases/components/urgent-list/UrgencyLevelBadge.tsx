import React from 'react';
import { AlertCircle, Flame, Zap } from 'lucide-react';
import {
  UrgencyLevel,
  urgencyLevelLabels,
  urgencyLevelStyles,
} from '../../types/urgency-level.types';

import { normalizeUrgencyLevel } from '@/api/services/sponsorshipService';

interface UrgencyLevelBadgeProps {
  level: UrgencyLevel | number | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animate?: boolean;
  className?: string;
}

/**
 * Component for displaying urgency level as a badge
 * Used on urgent case cards and lists
 */
export const UrgencyLevelBadge: React.FC<UrgencyLevelBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  animate = false,
  className = '',
}) => {
  // ✅ FIXED: Use robust normalization for string/number inputs
  const numLevel = normalizeUrgencyLevel(level);
  const label = urgencyLevelLabels[numLevel] || 'غير محدد';
  const styles = urgencyLevelStyles[numLevel];

  if (!styles) {
    return (
      <span className={`inline-block text-gray-500 text-xs ${className}`}>
        غير محدد
      </span>
    );
  }

  const getIcon = () => {
    switch (numLevel) {
      case UrgencyLevel.Normal:
        return <AlertCircle size={sizeMap[size].icon} />;
      case UrgencyLevel.Urgent:
        return <Zap size={sizeMap[size].icon} />;
      case UrgencyLevel.Critical:
        return <Flame size={sizeMap[size].icon} />;
      default:
        return <AlertCircle size={sizeMap[size].icon} />;
    }
  };

  const sizeMap = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 12,
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 16,
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 20,
    },
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 
        ${sizeMap[size].padding}
        ${sizeMap[size].text}
        font-bold font-[Cairo]
        rounded-lg border
        ${styles.bg} 
        ${styles.text} 
        ${styles.border}
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {showIcon && getIcon()}
      <span>{label}</span>
    </div>
  );
};

/**
 * Variant of the badge with gradient background and shadow
 * Used for prominent display on cards
 */
export const UrgencyLevelBadgeHighlight: React.FC<UrgencyLevelBadgeProps> = ({
  level,
  className = '',
}) => {
  const numLevel = normalizeUrgencyLevel(level);
  const label = urgencyLevelLabels[numLevel] || 'غير محدد';

  const getGradientStyles = () => {
    switch (numLevel) {
      case UrgencyLevel.Normal:
        return 'bg-gradient-to-r from-blue-600 to-blue-500 border-blue-400/50';
      case UrgencyLevel.Urgent:
        return 'bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400/50';
      case UrgencyLevel.Critical:
        return 'bg-gradient-to-r from-red-600 to-red-500 border-red-400/50';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-500 border-gray-400/50';
    }
  };

  const getIcon = () => {
    switch (numLevel) {
      case UrgencyLevel.Normal:
        return <AlertCircle size={14} className="fill-current" />;
      case UrgencyLevel.Urgent:
        return <Zap size={14} className="fill-current" />;
      case UrgencyLevel.Critical:
        return <Flame size={14} className="fill-current" />;
      default:
        return <AlertCircle size={14} className="fill-current" />;
    }
  };

  return (
    <div
      className={`
        flex items-center gap-1.5 
        px-3 py-1.5 
        rounded-lg 
        text-white 
        backdrop-blur-md 
        shadow-lg 
        border 
        text-[10px] 
        font-bold 
        font-[Cairo]
        animate-pulse
        ${getGradientStyles()}
        ${className}
      `}
    >
      {getIcon()}
      <span>{label}</span>
    </div>
  );
};

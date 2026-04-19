/**
 * UrgencyLevel Enum
 * Defines the urgency levels for urgent cases
 */
export enum UrgencyLevel {
  Normal = 1,
  Urgent = 2,
  Critical = 3,
}

export type UrgencyLevelType = keyof typeof UrgencyLevel;

/**
 * Maps UrgencyLevel enum values to Arabic display labels
 */
export const urgencyLevelLabels: Record<UrgencyLevel, string> = {
  [UrgencyLevel.Normal]: 'عادي',
  [UrgencyLevel.Urgent]: 'عاجل',
  [UrgencyLevel.Critical]: 'حرج جداً',
};

/**
 * Maps UrgencyLevel enum values to English display labels
 */
export const urgencyLevelLabelsEn: Record<UrgencyLevel, string> = {
  [UrgencyLevel.Normal]: 'Normal',
  [UrgencyLevel.Urgent]: 'Urgent',
  [UrgencyLevel.Critical]: 'Critical',
};

/**
 * Returns the Arabic label for a given urgency level
 */
export const getUrgencyLevelLabel = (level: UrgencyLevel | number | string): string => {
  const numLevel = Number(level) as UrgencyLevel;
  return urgencyLevelLabels[numLevel] || 'غير محدد';
};

/**
 * Returns the English label for a given urgency level
 */
export const getUrgencyLevelLabelEn = (level: UrgencyLevel | number | string): string => {
  const numLevel = Number(level) as UrgencyLevel;
  return urgencyLevelLabelsEn[numLevel] || 'Not Defined';
};

/**
 * CSS styling utilities for urgency levels
 */
export const urgencyLevelStyles: Record<
  UrgencyLevel,
  {
    bg: string;
    text: string;
    border: string;
    icon?: string;
  }
> = {
  [UrgencyLevel.Normal]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  [UrgencyLevel.Urgent]: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  [UrgencyLevel.Critical]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

/**
 * Get all urgency levels as an array
 */
export const getAllUrgencyLevels = (): { value: UrgencyLevel; label: string }[] => {
  return [
    { value: UrgencyLevel.Normal, label: urgencyLevelLabels[UrgencyLevel.Normal] },
    { value: UrgencyLevel.Urgent, label: urgencyLevelLabels[UrgencyLevel.Urgent] },
    { value: UrgencyLevel.Critical, label: urgencyLevelLabels[UrgencyLevel.Critical] },
  ];
};

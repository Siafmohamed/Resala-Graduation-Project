/**
 * @file urgencyLevels.ts
 * @description SINGLE SOURCE OF TRUTH for urgency levels across all features.
 * Used by: SponsorshipCases, EmergencyCases, UrgentCases
 *
 * Previously defined in 3 separate locations:
 *  - src/api/services/sponsorshipService.ts (URGENCY_LEVELS const)
 *  - src/features/SponsorshipCases/types/sponsorship.types.ts (URGENCY_LEVELS const)
 *  - src/features/UrgentCases/types/urgency-level.types.ts (UrgencyLevel enum)
 */

// ---------------------------------------------------------------------------
// Core enum & type
// ---------------------------------------------------------------------------

export const URGENCY_LEVELS = {
  NORMAL: 1,
  URGENT: 2,
  CRITICAL: 3,
} as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[keyof typeof URGENCY_LEVELS];

// ---------------------------------------------------------------------------
// Display labels
// ---------------------------------------------------------------------------

export const URGENCY_LABELS: Record<UrgencyLevel, { ar: string; en: string }> = {
  [URGENCY_LEVELS.NORMAL]:   { ar: 'عادي',     en: 'Normal'   },
  [URGENCY_LEVELS.URGENT]:   { ar: 'عاجل',     en: 'Urgent'   },
  [URGENCY_LEVELS.CRITICAL]: { ar: 'حرج جداً', en: 'Critical' },
};

// ---------------------------------------------------------------------------
// CSS styling utilities
// ---------------------------------------------------------------------------

export const URGENCY_STYLES: Record<
  UrgencyLevel,
  { bg: string; text: string; border: string }
> = {
  [URGENCY_LEVELS.NORMAL]:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  [URGENCY_LEVELS.URGENT]:   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  [URGENCY_LEVELS.CRITICAL]: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns all urgency levels as an array suitable for select/radio inputs.
 */
export const getAllUrgencyLevels = (): { value: UrgencyLevel; ar: string; en: string }[] =>
  (Object.values(URGENCY_LEVELS) as UrgencyLevel[]).map((v) => ({
    value: v,
    ...URGENCY_LABELS[v],
  }));

/**
 * Normalizes an urgency level from any backend format (number or string,
 * Arabic or English) to a canonical numeric UrgencyLevel.
 */
export const normalizeUrgencyLevel = (level: unknown): UrgencyLevel => {
  if (typeof level === 'number') {
    if (level === 3) return URGENCY_LEVELS.CRITICAL;
    if (level === 2) return URGENCY_LEVELS.URGENT;
    if (level === 1) return URGENCY_LEVELS.NORMAL;
    return URGENCY_LEVELS.NORMAL;
  }
  if (typeof level === 'string') {
    const lower = level.toLowerCase().trim();

    // Arabic — check Critical first to avoid partial match with 'حرج'
    if (lower.includes('حرج جدا') || lower.includes('حرجة جدا') || lower.includes('شديدة')) {
      return URGENCY_LEVELS.CRITICAL;
    }
    if (lower.includes('عاجل') || lower.includes('عالية') || lower.includes('حرج') || lower.includes('حرجة')) {
      return URGENCY_LEVELS.URGENT;
    }
    if (lower.includes('عادي') || lower.includes('عادية') || lower.includes('منخفضة')) {
      return URGENCY_LEVELS.NORMAL;
    }

    // English
    if (lower.includes('very critical') || lower === 'critical' || lower === '3' || lower === 'high') {
      return URGENCY_LEVELS.CRITICAL;
    }
    if (lower === 'urgent' || lower === '2' || lower === 'medium' || lower.includes('urgent')) {
      return URGENCY_LEVELS.URGENT;
    }
    if (lower === 'normal' || lower === 'low' || lower === '1' || lower === '0') {
      return URGENCY_LEVELS.NORMAL;
    }
  }
  return URGENCY_LEVELS.NORMAL;
};

/**
 * Gets the Arabic display label for a given urgency level.
 */
export const getUrgencyLevelLabel = (level: UrgencyLevel | number | string): string => {
  const numLevel = Number(level) as UrgencyLevel;
  return URGENCY_LABELS[numLevel]?.ar ?? 'غير محدد';
};

/**
 * Gets the English display label for a given urgency level.
 */
export const getUrgencyLevelLabelEn = (level: UrgencyLevel | number | string): string => {
  const numLevel = Number(level) as UrgencyLevel;
  return URGENCY_LABELS[numLevel]?.en ?? 'Not Defined';
};

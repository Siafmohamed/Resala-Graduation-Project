import type { UrgencyLevel } from '../types/sponsorship.types';
import type { Sponsorship, EmergencyCase } from '../types/sponsorship.types';
import type { SponsorshipCase } from '../types/sponsorshipCases.types';
import { URGENCY_LEVELS } from '../types/sponsorship.types';

const DEFAULT_IMAGE_URL = 'https://placehold.co/600x400?text=Resala';

/**
 * Normalizes urgency level from various data formats to numeric UrgencyLevel
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
    
    // Arabic labels
    if (lower.includes('حرج جدا') || lower.includes('حرجة جدا') || lower.includes('شديدة')) {
      return URGENCY_LEVELS.CRITICAL;
    }
    if (lower.includes('عاجل') || lower.includes('عالية') || lower.includes('حرج') || lower.includes('حرجة')) {
      return URGENCY_LEVELS.URGENT;
    }
    if (lower.includes('عادي') || lower.includes('عادية') || lower.includes('منخفضة')) {
      return URGENCY_LEVELS.NORMAL;
    }
    
    // English labels
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
 * Normalizes image URL - resolves relative URLs to absolute
 */
export const normalizeSponsorshipImageUrl = (value?: string): string => {
  if (!value?.trim()) return DEFAULT_IMAGE_URL;
  
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || 
      trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  
  // Resolve relative URL
  const origin = window.location.origin;
  return `${origin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

/**
 * Merges sponsorships and emergency cases into a unified SponsorshipCase[] array
 * Extracted from combinedData useMemo in SponsorshipManagementAPI.tsx
 */
export const mergeSponsorshipCases = (
  sponsorships: Sponsorship[],
  emergencyCases: EmergencyCase[]
): SponsorshipCase[] => {
  const normSponsorships = sponsorships.map(s => ({
    id: s.id,
    title: s.name,
    description: s.description,
    targetAmount: Number(s.targetAmount) || 0,
    collectedAmount: Number(s.collectedAmount) || 0,
    status: s.isActive ? 'active' as const : 'inactive' as const,
    type: 'regular' as const,
    imageUrl: s.imageUrl,
    icon: s.icon,
    isActive: s.isActive,
    createdAt: s.createdAt || new Date().toISOString(),
  }));

  const normEmergency = emergencyCases.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    targetAmount: Number(e.targetAmount) || 0,
    collectedAmount: Number(e.collectedAmount) || 0,
    status: e.isActive ? 'active' as const : 'inactive' as const,
    type: 'urgent' as const,
    imageUrl: e.imageUrl,
    urgencyLevel: normalizeUrgencyLevel(e.urgencyLevel),
    isActive: e.isActive,
    createdAt: e.createdOn || e.createdAt || new Date().toISOString(),
  }));

  return [...normSponsorships, ...normEmergency].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Calculates progress percentage (0-100)
 */
export const calculateProgress = (collected: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min((collected / target) * 100, 100);
};

/**
 * Formats currency in Arabic locale
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ar-EG') + ' ج.م';
};

import { useState, useMemo } from 'react';
import type { SponsorshipCase } from '../types/sponsorshipCases.types';

interface UseSponsorshipFiltersReturn {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  filteredCases: SponsorshipCase[];
}

/**
 * Manages all filter + search state for the sponsorship list
 * Extracted from inline logic in SponsorshipManagementAPI.tsx
 */
export function useSponsorshipFilters(cases: SponsorshipCase[]): UseSponsorshipFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('جميع الحالات');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Search filter
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchStatus =
        statusFilter === 'جميع الحالات' ||
        (statusFilter === 'نشطة' && item.isActive) ||
        (statusFilter === 'غير نشطة' && !item.isActive);

      // Type filter
      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'regular' && item.type === 'regular') ||
        (typeFilter === 'urgent' && item.type === 'urgent');

      return matchSearch && matchStatus && matchType;
    });
  }, [cases, searchQuery, statusFilter, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredCases,
  };
}

export default useSponsorshipFilters;

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useUrlState } from '../../hooks/useUrlState';
import { useDebounce } from '../../hooks/useDebounce';
import { DataTableState, UseDataTableProps, DataTableResult } from './types';

export function useDataTable<T>({
  initialState,
  fetchData,
  debounceMs = 300,
}: UseDataTableProps<T>) {
  // 1. Sync state with URL
  const [urlState, setUrlState, clearUrlState] = useUrlState<DataTableState>({
    search: initialState?.search ?? '',
    page: initialState?.page ?? 1,
    limit: initialState?.limit ?? 10,
    filters: initialState?.filters ?? {},
  });

  // 2. Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(urlState.search, debounceMs);

  // 3. Memoized state for React Query key
  const queryState = useMemo(() => ({
    ...urlState,
    search: debouncedSearch,
  }), [urlState, debouncedSearch]);

  // 4. Data fetching with React Query
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['dataTable', queryState],
    queryFn: () => fetchData(queryState),
    placeholderData: keepPreviousData, // Smooth transitions between pages
  });

  // 5. Actions
  const setSearch = useCallback((search: string) => {
    setUrlState({ search, page: 1 }); // Reset to page 1 on new search
  }, [setUrlState]);

  const setPage = useCallback((page: number) => {
    setUrlState({ page });
  }, [setUrlState]);

  const setLimit = useCallback((limit: number) => {
    setUrlState({ limit, page: 1 });
  }, [setUrlState]);

  const setFilter = useCallback((id: string, value: any) => {
    setUrlState((prev) => ({
      filters: { ...prev.filters, [id]: value },
      page: 1,
    }));
  }, [setUrlState]);

  const removeFilter = useCallback((id: string) => {
    setUrlState((prev) => {
      const nextFilters = { ...prev.filters };
      delete nextFilters[id];
      return { filters: nextFilters, page: 1 };
    });
  }, [setUrlState]);

  const clearFilters = useCallback(() => {
    setUrlState({ filters: {}, page: 1 });
  }, [setUrlState]);

  const resetAll = useCallback(() => {
    clearUrlState();
  }, [clearUrlState]);

  return {
    // State
    state: urlState,
    queryState,
    
    // Data
    data: data?.data ?? [],
    pagination: data?.pagination ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    
    // Status
    isLoading,
    isFetching,
    isError,
    error,
    
    // Actions
    setSearch,
    setPage,
    setLimit,
    setFilter,
    removeFilter,
    clearFilters,
    resetAll,
    refetch,
  };
}

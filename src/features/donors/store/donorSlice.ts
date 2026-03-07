// ============================================
// Donor Store — Zustand (Client State)
// ============================================

import { create } from 'zustand';
import type {
    DonorFiltersState,
    PaginationState,
    SortState,
    DonorSortField,
    SortDirection,
    PaymentStatus,
    SponsorshipType,
} from '../types/donor.types';

interface DonorStore {
    // Filters
    filters: DonorFiltersState;
    setSearch: (search: string) => void;
    setPaymentStatus: (status: PaymentStatus | 'all') => void;
    setSponsorshipType: (type: SponsorshipType | 'all') => void;
    clearFilters: () => void;

    // Pagination
    pagination: PaginationState;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setTotal: (total: number) => void;

    // Sort
    sort: SortState;
    setSort: (field: DonorSortField) => void;

    // Selection (bulk ops)
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;
}

const DEFAULT_FILTERS: DonorFiltersState = {
    search: '',
    paymentStatus: 'all',
    sponsorshipType: 'all',
};

const DEFAULT_PAGINATION: PaginationState = {
    page: 1,
    pageSize: 10,
    total: 0,
};

const DEFAULT_SORT: SortState = {
    field: 'formDate',
    direction: 'desc',
};

export const useDonorStore = create<DonorStore>((set) => ({
    // ── Filters ──
    filters: DEFAULT_FILTERS,
    setSearch: (search) =>
        set((state) => ({
            filters: { ...state.filters, search },
            pagination: { ...state.pagination, page: 1 },
        })),
    setPaymentStatus: (status) =>
        set((state) => ({
            filters: { ...state.filters, paymentStatus: status },
            pagination: { ...state.pagination, page: 1 },
        })),
    setSponsorshipType: (type) =>
        set((state) => ({
            filters: { ...state.filters, sponsorshipType: type },
            pagination: { ...state.pagination, page: 1 },
        })),
    clearFilters: () =>
        set((state) => ({
            filters: DEFAULT_FILTERS,
            pagination: { ...state.pagination, page: 1 },
        })),

    // ── Pagination ──
    pagination: DEFAULT_PAGINATION,
    setPage: (page) =>
        set((state) => ({ pagination: { ...state.pagination, page } })),
    setPageSize: (pageSize) =>
        set((state) => ({
            pagination: { ...state.pagination, pageSize, page: 1 },
        })),
    setTotal: (total) =>
        set((state) => ({ pagination: { ...state.pagination, total } })),

    // ── Sort ──
    sort: DEFAULT_SORT,
    setSort: (field) =>
        set((state) => ({
            sort: {
                field,
                direction:
                    state.sort.field === field
                        ? state.sort.direction === 'asc'
                            ? 'desc'
                            : 'asc'
                        : ('asc' as SortDirection),
            },
        })),

    // ── Selection ──
    selectedIds: [],
    toggleSelection: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((i) => i !== id)
                : [...state.selectedIds, id],
        })),
    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),
}));

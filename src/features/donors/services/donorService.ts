// ============================================
// Donor Service — Mock API Layer
// ============================================

import type {
    Donor,
    DonorFormData,
    DonorsListResponse,
    DonorFiltersState,
    PaginationState,
    SortState,
    DonorStatsData,
} from '../types/donor.types';

// ──────────────────────────────────────────────
// Mock Data (matching Figma design)
// ──────────────────────────────────────────────

const MOCK_DONORS: Donor[] = [
    {
        id: '1',
        name: 'أحمد محمود السيد',
        phone: '01012345678',
        sponsorshipType: 'orphan',
        sponsorshipDuration: 'month',
        paymentStatus: 'paid',
        paymentMethod: 'vodafone_cash',
        amount: 500,
        formDate: '2026-01-05',
        transferNumber: '5678****',
        transferTime: '10:25',
        transferProof: 'متاح',
        orderDate: '2026-01-08 10:30',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
    },
    {
        id: '2',
        name: 'فاطمة حسن علي',
        phone: '01123456789',
        sponsorshipType: 'family',
        sponsorshipDuration: '3months',
        paymentStatus: 'partial',
        paymentMethod: 'branch',
        amount: 1500,
        formDate: '2026-01-05',
        createdAt: '2026-01-05T11:00:00Z',
        updatedAt: '2026-01-05T11:00:00Z',
    },
    {
        id: '3',
        name: 'محمد عبد الرحمن',
        phone: '01234567890',
        sponsorshipType: 'student',
        sponsorshipDuration: '6months',
        paymentStatus: 'overdue',
        paymentMethod: 'vodafone_cash',
        amount: 3000,
        formDate: '2026-01-05',
        createdAt: '2026-01-05T12:00:00Z',
        updatedAt: '2026-01-05T12:00:00Z',
    },
    {
        id: '4',
        name: 'خالد إبراهيم حسن',
        phone: '01098765432',
        sponsorshipType: 'family',
        sponsorshipDuration: 'year',
        paymentStatus: 'paid',
        paymentMethod: 'vodafone_cash',
        amount: 6000,
        formDate: '2026-01-05',
        createdAt: '2026-01-05T13:00:00Z',
        updatedAt: '2026-01-05T13:00:00Z',
    },
    {
        id: '5',
        name: 'نورا حسين محمود',
        phone: '01567890123',
        sponsorshipType: 'orphan',
        sponsorshipDuration: 'month',
        paymentStatus: 'cancelled',
        paymentMethod: 'vodafone_cash',
        amount: 500,
        formDate: '2026-01-05',
        createdAt: '2026-01-05T14:00:00Z',
        updatedAt: '2026-01-05T14:00:00Z',
    },
    {
        id: '6',
        name: 'هدى أحمد محمد',
        phone: '01187654321',
        sponsorshipType: 'medical',
        sponsorshipDuration: '3months',
        paymentStatus: 'paid',
        paymentMethod: 'instapay',
        amount: 2000,
        formDate: '2026-01-06',
        createdAt: '2026-01-06T09:00:00Z',
        updatedAt: '2026-01-06T09:00:00Z',
    },
];

let donors = [...MOCK_DONORS];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function applyFilters(list: Donor[], filters: DonorFiltersState): Donor[] {
    let result = [...list];

    // Search
    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
            (d) => d.name.includes(q) || d.phone.includes(q)
        );
    }

    // Payment status
    if (filters.paymentStatus !== 'all') {
        result = result.filter((d) => d.paymentStatus === filters.paymentStatus);
    }

    // Sponsorship type
    if (filters.sponsorshipType !== 'all') {
        result = result.filter((d) => d.sponsorshipType === filters.sponsorshipType);
    }

    return result;
}

function applySort(list: Donor[], sort: SortState): Donor[] {
    const sorted = [...list];
    sorted.sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';

        switch (sort.field) {
            case 'name':
                aVal = a.name;
                bVal = b.name;
                break;
            case 'sponsorshipType':
                aVal = a.sponsorshipType;
                bVal = b.sponsorshipType;
                break;
            case 'duration':
                aVal = a.sponsorshipDuration;
                bVal = b.sponsorshipDuration;
                break;
            case 'paymentStatus':
                aVal = a.paymentStatus;
                bVal = b.paymentStatus;
                break;
            case 'formDate':
                aVal = a.formDate;
                bVal = b.formDate;
                break;
            case 'amount':
                aVal = a.amount;
                bVal = b.amount;
                break;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal), 'ar');
        return sort.direction === 'asc' ? cmp : -cmp;
    });
    return sorted;
}

// ──────────────────────────────────────────────
// Service API
// ──────────────────────────────────────────────

export const donorService = {
    /** Fetch donors with filters, sort, and pagination */
    async getDonors(
        filters: DonorFiltersState,
        pagination: PaginationState,
        sort: SortState
    ): Promise<DonorsListResponse> {
        await delay(400);

        let filtered = applyFilters(donors, filters);
        filtered = applySort(filtered, sort);

        const total = filtered.length;
        const start = (pagination.page - 1) * pagination.pageSize;
        const paged = filtered.slice(start, start + pagination.pageSize);

        return {
            donors: paged,
            total,
            page: pagination.page,
            pageSize: pagination.pageSize,
        };
    },

    /** Fetch single donor by ID */
    async getDonorById(id: string): Promise<Donor | null> {
        await delay(300);
        return donors.find((d) => d.id === id) ?? null;
    },

    /** Create a new donor */
    async createDonor(data: DonorFormData): Promise<Donor> {
        await delay(500);

        const newDonor: Donor = {
            id: String(Date.now()),
            name: data.name,
            phone: data.phone,
            sponsorshipType: data.sponsorshipType,
            sponsorshipDuration: 'month',
            paymentStatus: 'paid',
            paymentMethod: 'branch',
            amount: 500,
            formDate: new Date().toISOString().split('T')[0],
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        donors = [newDonor, ...donors];
        return newDonor;
    },

    /** Update an existing donor */
    async updateDonor(id: string, data: Partial<DonorFormData>): Promise<Donor> {
        await delay(400);

        const index = donors.findIndex((d) => d.id === id);
        if (index === -1) throw new Error('Donor not found');

        donors[index] = {
            ...donors[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        return donors[index];
    },

    /** Delete a donor */
    async deleteDonor(id: string): Promise<void> {
        await delay(300);
        donors = donors.filter((d) => d.id !== id);
    },

    /** Bulk delete donors */
    async bulkDeleteDonors(ids: string[]): Promise<void> {
        await delay(500);
        donors = donors.filter((d) => !ids.includes(d.id));
    },

    /** Get donor statistics */
    async getStats(): Promise<DonorStatsData> {
        await delay(200);

        return {
            totalDonors: donors.length,
            activeDonors: donors.filter((d) => d.paymentStatus !== 'cancelled').length,
            totalDonated: donors
                .filter((d) => d.paymentStatus === 'paid')
                .reduce((sum, d) => sum + d.amount, 0),
            newThisMonth: 3,
        };
    },

    /** Get all donors for export (no pagination) */
    async getAllDonorsForExport(filters: DonorFiltersState): Promise<Donor[]> {
        await delay(300);
        return applyFilters(donors, filters);
    },
};

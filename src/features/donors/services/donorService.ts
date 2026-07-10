// ============================================
// Donor Service
// ============================================

import api from '@/shared/api/axiosInstance';
import type {
    Donor,
    DonorFormData,
    DonorsListResponse,
    DonorFiltersState,
    PaginationState,
    SortState,
    DonorStatsData,
    FinancialAnalysisListResponse,
    FinancialAnalysisDetailResponse,
    SponsorshipProgram,
    Sponsorship,
} from '../types/donor.types';

const handleApiResponse = <T>(response: any): T => {
    if (response?.succeeded && response?.data) {
        return response.data;
    } else if (response?.data) {
        return response.data;
    }
    return response;
};

export const donorService = {
    /** 
     * Register a new donor directly from the dashboard (Staff/Admin)
     * POST /api/v1/auth/register-donor
     */
    async registerDonor(payload: DonorFormData): Promise<{ succeeded: boolean; message: string; data: { userId: number; message: string } }> {
        return await api.post('/v1/auth/register-donor', {
            name: payload.name,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            password: payload.password,
            job: payload.job,
            landline: payload.landline,
        });
    },

    /** Fetch donors with filters, sort, and pagination using financial analysis API */
    async getDonors(
        filters: DonorFiltersState,
        pagination: PaginationState,
        sort: SortState
    ): Promise<FinancialAnalysisListResponse['data']> {
        const params: any = {
            PageNumber: pagination.page,
            PageSize: pagination.pageSize,
        };
        if (filters.search) params.Search = filters.search;
        if (filters.statusFilter) params.StatusFilter = filters.statusFilter;
        if (filters.activeSubscriptions !== undefined) params.ActiveSubscriptions = filters.activeSubscriptions;
        if (filters.delayedUsers !== undefined) params.DelayedUsers = filters.delayedUsers;
        if (filters.emergencyDonors !== undefined) params.EmergencyDonors = filters.emergencyDonors;
        if (filters.inKindDonors !== undefined) params.InKindDonors = filters.inKindDonors;
        if (sort.field) params.SortBy = sort.field;

        const response = await api.get('/v1/staff/users/financial-analysis', { params });
        return handleApiResponse(response);
    },

    /** Fetch a single donor's financial analysis by ID */
    async getDonorById(donorId: string | number): Promise<FinancialAnalysisDetailResponse['data']> {
        const id = typeof donorId === 'string' ? Number(donorId) : donorId;
        const response = await api.get(`/v1/staff/users/${id}/financial-analysis`);
        return handleApiResponse(response);
    },

    /** Create a new donor */
    async createDonor(data: DonorFormData): Promise<Donor> {
        const result = await this.registerDonor(data);
        return {
            id: String(result.data.userId),
            name: data.name,
            phone: data.phoneNumber,
            email: data.email,
            job: data.job,
            landline: data.landline,
            sponsorshipType: 'other',
            sponsorshipDuration: 'month',
            paymentStatus: 'paid',
            paymentMethod: 'branch',
            amount: 0,
            formDate: new Date().toISOString().split('T')[0],
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /** Get donor's active sponsorships for direct payment */
    async getDonorActiveSponsorships(donorId: number): Promise<Sponsorship[]> {
        const response = await api.get(`/v1/admin/direct-operations/donors/${donorId}/sponsorships`);
        return handleApiResponse(response);
    },

    /** Process a direct payment */
    async processPayment(data: {
        donorId: number;
        amount: number;
        subscriptionId?: number;
        generalDonationId?: number;
    }): Promise<any> {
        return await api.post('/v1/admin/direct-operations/process-payment', data);
    },

    /** Get all sponsorship programs */
    async getSponsorshipPrograms(): Promise<SponsorshipProgram[]> {
        const response = await api.get('/v1/sponsorships');
        return handleApiResponse(response);
    },

    /** Direct subscribe to a sponsorship */
    async directSubscribe(data: {
        donorId: number;
        sponsorshipId: number;
        amount: number;
        cycle: number; // 1: شهري, 2: ربع سنوي, 3: نص سنوي,4: سنوي
    }): Promise<any> {
        return await api.post('/v1/admin/direct-operations/direct-subscribe', data);
    },

    /** Update an existing donor */
    async updateDonor(id: string, data: Partial<DonorFormData>): Promise<Donor> {
        return {
            id,
            name: data.name || '',
            phone: data.phoneNumber || '',
            email: data.email || '',
            job: data.job || '',
            landline: data.landline || '',
            sponsorshipType: 'other',
            sponsorshipDuration: 'month',
            paymentStatus: 'paid',
            paymentMethod: 'branch',
            amount: 0,
            formDate: new Date().toISOString().split('T')[0],
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /** Delete a donor */
    async deleteDonor(id: string): Promise<void> { },

    /** Bulk delete donors */
    async bulkDeleteDonors(ids: string[]): Promise<void> { },

    /** Get donor statistics */
    async getStats(): Promise<DonorStatsData> {
        return {
            totalDonors: 0,
            activeDonors: 0,
            totalDonated: 0,
            newThisMonth: 0,
        };
    },

    /** Get all donors for export (no pagination) */
    async getAllDonorsForExport(filters: DonorFiltersState): Promise<Donor[]> {
        return [];
    },
};

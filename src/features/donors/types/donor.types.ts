// ============================================
// Donor Management Types
// ============================================

/** Payment status options */
export type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'cancelled';

/** Sponsorship type options */
export type SponsorshipType = 'orphan' | 'family' | 'student' | 'medical' | 'other';

/** Sponsorship duration */
export type SponsorshipDuration = 'month' | '3months' | '6months' | 'year';

/** Payment method */
export type PaymentMethod = 'vodafone_cash' | 'branch' | 'bank_transfer' | 'instapay';

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sortable columns */
export type DonorSortField = 'name' | 'sponsorshipType' | 'duration' | 'paymentStatus' | 'formDate' | 'amount';

// ============================================
// Entities
// ============================================

export interface Donor {
    id: string;
    name: string;
    phone: string;
    email?: string;
    job?: string;
    landline?: string;
    sponsorshipType: SponsorshipType;
    sponsorshipDuration: SponsorshipDuration;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    amount: number;
    formDate: string;
    notes?: string;
    transferNumber?: string;
    transferTime?: string;
    transferProof?: string;
    orderDate?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// Form Types
// ============================================

export interface DonorFormData {
    name: string;
    phoneNumber: string;
    email: string;
    password?: string;
    job: string;
    landline: string;
    notes?: string;
}

// ============================================
// Filter Types
// ============================================

export interface DonorFiltersState {
    search: string;
    paymentStatus: PaymentStatus | 'all';
    sponsorshipType: SponsorshipType | 'all';
}

// ============================================
// Pagination & Sort
// ============================================

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}

export interface SortState {
    field: DonorSortField;
    direction: SortDirection;
}

// ============================================
// API Response Types
// ============================================

export interface DonorsListResponse {
    donors: Donor[];
    total: number;
    page: number;
    pageSize: number;
}

export interface DonorStatsData {
    totalDonors: number;
    activeDonors: number;
    totalDonated: number;
    newThisMonth: number;
}

// ============================================
// Label Maps (Arabic)
// ============================================

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    paid: 'دفع',
    partial: 'تم تسديد جزء',
    overdue: 'متأخر',
    cancelled: 'لاغي',
};

export const SPONSORSHIP_TYPE_LABELS: Record<SponsorshipType, string> = {
    orphan: 'كفالة يتيم',
    family: 'كفالة أسرة',
    student: 'كفالة طالب علم',
    medical: 'كفالة طبية',
    other: 'أخرى',
};

export const SPONSORSHIP_DURATION_LABELS: Record<SponsorshipDuration, string> = {
    month: 'شهر واحد',
    '3months': '3 أشهر',
    '6months': '6 أشهر',
    year: 'سنة',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    vodafone_cash: 'فودافون كاش',
    branch: 'مقر الجمعية',
    bank_transfer: 'تحويل بنكي',
    instapay: 'إنستاباي',
};

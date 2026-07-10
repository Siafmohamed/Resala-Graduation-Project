// ============================================
// Donor Management Types
// ============================================

/** Payment status options */
export type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'cancelled';

/** Sponsorship type options */
export type SponsorshipType = 'orphan' | 'family' | 'student' | 'medical' | 'other';

/** Sponsorship duration */
export type SponsorshipDuration = 'month' | '3months' | '6months' | 'year';
export type SponsorshipCycle = 1 | 2 | 3 | 4; // 1: شهري, 2: ربع سنوي, 3: نص سنوي,4: سنوي

/** Payment method */
export type PaymentMethod = 'vodafone_cash' | 'branch' | 'bank_transfer' | 'instapay';

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sortable columns */
export type DonorSortField = 'name' | 'sponsorshipType' | 'duration' | 'paymentStatus' | 'formDate' | 'amount';

// ============================================
// New Financial Analysis Types
// ============================================

export interface PaymentHistoryItem {
    month: string;
    year: number;
    status: string;
}

export interface Sponsorship {
    sponsorshipId: number;
    sponsorshipName: string;
    monthlySubscriptionAmount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    totalExpectedAmount: number;
    totalPaidAmount: number;
    remainingAmount: number;
    paymentHistory: PaymentHistoryItem[];
}

export interface InKindDonation {
    donationId: number;
    donationName: string;
    quantity: number;
    donationDate: string;
    donationCategory: string;
}

export interface EmergencyDonation {
    emergencyCaseId: number;
    emergencyCaseTitle: string;
    donationAmount: number;
    donationDate: string;
    paymentStatus: string;
}

export interface DonorSummary {
    totalSponsorshipsCount: number;
    activeSponsorshipsCount: number;
    totalPaidAmount: number;
    totalRemainingAmount: number;
    totalEmergencyDonations: number;
    totalInKindDonationsCount: number;
    totalInKindDonationsQuantity: number;
    lastPaymentDate: string;
    financialStatusName: string;
    financialStatusColor: string;
    financialStatusPriority: number;
    paymentRegularityPercentage: number;
}

export interface FinancialAnalysisDonor {
    donorId: number;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    accountCreationDate: string;
    roleName: string;
}

export interface FinancialAnalysisListResponse {
    succeeded: boolean;
    message: string;
    data: {
        totalRows: number;
        pageSize: number;
        pageIndex: number;
        items: FinancialAnalysisDonor[];
    };
    errors?: string[];
    statusCode: number;
    meta?: string;
}

export interface FinancialAnalysisDetailResponse {
    succeeded: boolean;
    message: string;
    data: {
        donorId: number;
        userId: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        accountCreationDate: string;
        roleName: string;
        sponsorships: Sponsorship[];
        inKindDonations: InKindDonation[];
        emergencyDonations: EmergencyDonation[];
        summary: DonorSummary;
    };
    errors?: string[];
    statusCode: number;
    meta?: string;
}

export interface SponsorshipProgram {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    imagePublicId?: string;
    icon?: string;
    iconPublicId?: string;
    targetAmount: number;
    collectedAmount: number;
    isActive: boolean;
    createdAt: string;
}

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
    statusFilter?: string;
    activeSubscriptions?: boolean;
    delayedUsers?: boolean;
    emergencyDonors?: boolean;
    inKindDonors?: boolean;
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

export const SPONSORSHIP_CYCLE_LABELS: Record<SponsorshipCycle, string> = {
    1: 'شهري',
    2: 'ربع سنوي',
    3: 'نص سنوي',
    4: 'سنوي',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    vodafone_cash: 'فودافون كاش',
    branch: 'مقر الجمعية',
    bank_transfer: 'تحويل بنكي',
    instapay: 'إنستاباي',
};

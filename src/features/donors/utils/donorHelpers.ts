// ============================================
// Donor Helpers & Formatters
// ============================================

import {
    PAYMENT_STATUS_LABELS,
    SPONSORSHIP_TYPE_LABELS,
    SPONSORSHIP_DURATION_LABELS,
    PAYMENT_METHOD_LABELS,
} from '../types/donor.types';
import type {
    PaymentStatus,
    SponsorshipType,
    SponsorshipDuration,
    PaymentMethod,
} from '../types/donor.types';

/** Format amount as "500 جنيه" */
export function formatCurrency(amount: number): string {
    return `${amount.toLocaleString('ar-EG')} جنيه`;
}

/** Format phone: 01012345678 */
export function formatPhone(phone: string): string {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1$2$3');
}

/** Format date: "2026-01-05" */
export function formatDate(dateStr: string): string {
    return dateStr.split('T')[0];
}

/** Get Arabic label for payment status */
export function getPaymentStatusLabel(status: PaymentStatus): string {
    return PAYMENT_STATUS_LABELS[status];
}

/** Get Arabic label for sponsorship type */
export function getSponsorshipTypeLabel(type: SponsorshipType): string {
    return SPONSORSHIP_TYPE_LABELS[type];
}

/** Get Arabic label for duration */
export function getDurationLabel(duration: SponsorshipDuration): string {
    return SPONSORSHIP_DURATION_LABELS[duration];
}

/** Get Arabic label for payment method */
export function getPaymentMethodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[method];
}

/** Get CSS color class for payment status */
export function getPaymentStatusColor(status: PaymentStatus): string {
    switch (status) {
        case 'paid':
            return 'statusPaid';
        case 'partial':
            return 'statusPartial';
        case 'overdue':
            return 'statusOverdue';
        case 'cancelled':
            return 'statusCancelled';
        default:
            return '';
    }
}

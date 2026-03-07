// ============================================
// Export Helpers — CSV Export with Arabic support
// ============================================

import type { Donor } from '../types/donor.types';
import {
    getPaymentStatusLabel,
    getSponsorshipTypeLabel,
    getDurationLabel,
    getPaymentMethodLabel,
    formatCurrency,
} from './donorHelpers';

interface CsvColumn {
    header: string;
    accessor: (donor: Donor) => string;
}

const CSV_COLUMNS: CsvColumn[] = [
    { header: 'الاسم', accessor: (d) => d.name },
    { header: 'رقم الهاتف', accessor: (d) => d.phone },
    { header: 'نوع الكفالة', accessor: (d) => getSponsorshipTypeLabel(d.sponsorshipType) },
    { header: 'مدة الكفالة', accessor: (d) => getDurationLabel(d.sponsorshipDuration) },
    { header: 'حالة الدفع', accessor: (d) => getPaymentStatusLabel(d.paymentStatus) },
    { header: 'طريقة الدفع', accessor: (d) => getPaymentMethodLabel(d.paymentMethod) },
    { header: 'المبلغ', accessor: (d) => formatCurrency(d.amount) },
    { header: 'تاريخ الاستمارة', accessor: (d) => d.formDate },
];

/** Generate CSV string from donors array */
export function generateCsv(donors: Donor[]): string {
    const headers = CSV_COLUMNS.map((c) => c.header).join(',');
    const rows = donors.map((donor) =>
        CSV_COLUMNS.map((col) => `"${col.accessor(donor)}"`).join(',')
    );

    return [headers, ...rows].join('\n');
}

/** Trigger CSV file download */
export function downloadCsv(donors: Donor[], filename = 'donors'): void {
    const csv = generateCsv(donors);
    // UTF-8 BOM for Excel Arabic support
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

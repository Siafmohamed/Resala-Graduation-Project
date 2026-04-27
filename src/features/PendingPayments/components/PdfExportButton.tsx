import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';

interface PdfExportButtonProps {
  payments: PendingPayment[];
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ payments }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // a. Fetches delivery areas and sorts by name
      const deliveryAreas = await pendingPaymentsService.getDeliveryAreas();
      const sortedAreas = [...deliveryAreas].sort((a, b) => a.name.localeCompare(b.name));

      // b. Generates a PDF using jsPDF + autoTable
      const doc = new jsPDF();
      const today = new Date().toISOString().split('T')[0];

      // Add title
      doc.setFontSize(18);
      doc.text('Pending Representative Payments', 14, 20);
      doc.setFontSize(11);
      doc.text(`Date: ${today}`, 14, 30);

      const tableColumn = [
        'ID',
        'User Name',
        'Phone',
        'Amount',
        'Scheduled Date',
        'Contact Name',
        'Contact Phone',
      ];

      // Since we don't have a direct link to delivery areas in the PendingPayment interface provided,
      // we'll export the payments as is. If there was a link, we'd sort them by sortedAreas order here.
      const tableRows = payments.map((p) => [
        p.id,
        p.userName,
        p.phone,
        p.amount,
        p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString() : 'N/A',
        p.contactName,
        p.contactPhone,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8, font: 'helvetica' },
        headStyles: { fillStyle: 'f', fillColor: [0, 84, 154] },
      });

      // c. File name: representatives_payments_{today}.pdf
      doc.save(`representatives_payments_${today}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('حدث خطأ أثناء تصدير ملف PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-[Cairo] font-bold text-sm"
    >
      <FileDown size={18} />
      {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
    </button>
  );
};

export default PdfExportButton;

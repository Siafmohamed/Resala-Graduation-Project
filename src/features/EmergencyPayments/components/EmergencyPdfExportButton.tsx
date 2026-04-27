import React, { useState } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { emergencyPaymentsService } from '../services/emergencyPaymentsService';
import type { EmergencyPayment } from '../types/emergencyPayments.types';

interface EmergencyPdfExportButtonProps {
  payments: EmergencyPayment[];
}

const EmergencyPdfExportButton: React.FC<EmergencyPdfExportButtonProps> = ({ payments }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const representativePayments = await emergencyPaymentsService.getEmergencyPayments('Representative');

      if (representativePayments.length === 0) {
        alert('لا توجد دفعات للمندوبين لتصديرها.');
        setIsExporting(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const filename = `emergency_representative_payments_${today}.pdf`;

      // Create a hidden div to render HTML content for PDF
      const pdfContent = document.createElement('div');
      pdfContent.dir = 'rtl'; // Set direction to RTL for Arabic
      pdfContent.style.width = '190mm'; // A4 width minus margins
      pdfContent.style.padding = '10mm';
      pdfContent.style.backgroundColor = '#ffffff';
      pdfContent.style.fontFamily = 'Cairo, sans-serif'; // Use Cairo font

      let html = `
        <h1 style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #00549A;">
          تقرير دفعات الطوارئ للمندوبين
        </h1>
        <p style="font-size: 12px; text-align: center; margin-bottom: 30px; color: #697282;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">عنوان الحالة</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">اسم جهة الاتصال</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">هاتف جهة الاتصال</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">العنوان</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">المبلغ</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #495565;">ملاحظات المندوب</th>
            </tr>
          </thead>
          <tbody>
      `;

      representativePayments.forEach((p) => {
        html += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #101727;">${p.emergencyCaseTitle}</td>
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #101727;">${p.contactName}</td>
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #101727;">${p.contactPhone}</td>
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #101727;">${p.address}</td>
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #00549A; font-weight: bold;">${p.amount.toLocaleString()} ج.م</td>
            <td style="padding: 12px; text-align: right; font-size: 11px; color: #101727;">${p.representativeNotes || 'لا يوجد'}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;

      pdfContent.innerHTML = html;
      document.body.appendChild(pdfContent); // Append to body to be rendered by html2canvas

      const canvas = await html2canvas(pdfContent, { scale: 2 }); // Scale for better quality
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      document.body.removeChild(pdfContent); // Clean up hidden div

    } catch (error) {
      console.error('Failed to export emergency payments PDF:', error);
      alert('حدث خطأ أثناء تصدير ملف PDF لدفعات الطوارئ.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E6F0F8] text-[#00549A] hover:bg-[#CCE0F0] transition-all font-[Cairo] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
      <Download size={16} />
    </button>
  );
};

export default EmergencyPdfExportButton;

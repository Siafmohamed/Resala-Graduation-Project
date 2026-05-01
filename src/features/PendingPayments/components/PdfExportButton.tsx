import React, { useState } from 'react';
import { Download, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { pendingPaymentsService } from '../services/pendingPaymentsService';
import type { PendingPayment } from '../types/pendingPayments.types';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';

interface PdfExportButtonProps {
  payments: PendingPayment[];
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ payments }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const representativePayments = await pendingPaymentsService.getPendingPayments('Representatives');

      if (representativePayments.length === 0) {
        alert('لا توجد دفعات للمندوبين لتصديرها حالياً.');
        setIsExporting(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const filename = `resala_representative_orders_${today}.pdf`;

      // Create a hidden div with professional styling
      const pdfContent = document.createElement('div');
      pdfContent.dir = 'rtl';
      pdfContent.style.width = '210mm'; // Full A4 width
      pdfContent.style.padding = '20mm';
      pdfContent.style.backgroundColor = '#ffffff';
      pdfContent.style.fontFamily = 'Cairo, sans-serif';
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '-9999px';

      let html = `
        <div style="border-bottom: 3px solid #00549A; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: #101727; margin: 0; font-family: Cairo;">جمعية رسالة للأعمال الخيرية</h1>
            <p style="font-size: 14px; color: #00549A; font-weight: 600; margin: 5px 0 0 0;">تقرير أوردرات المناديب - الكفالات الشهرية</p>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 12px; color: #697282; margin: 0;">تاريخ التقرير</p>
            <p style="font-size: 14px; font-weight: 700; color: #101727; margin: 0;">${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div style="background-color: #f8fafc; border-radius: 15px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0; display: flex; justify-content: space-around;">
          <div style="text-align: center;">
            <p style="font-size: 11px; color: #697282; margin: 0; text-transform: uppercase;">إجمالي الأوردرات</p>
            <p style="font-size: 20px; font-weight: 800; color: #00549A; margin: 5px 0 0 0;">${representativePayments.length}</p>
          </div>
          <div style="text-align: center; border-right: 1px solid #e2e8f0; padding-right: 20px;">
            <p style="font-size: 11px; color: #697282; margin: 0; text-transform: uppercase;">إجمالي المبالغ المتوقعة</p>
            <p style="font-size: 20px; font-weight: 800; color: #22c55e; margin: 5px 0 0 0;">${representativePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ج.م</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="background-color: #00549A; color: white; padding: 15px; text-align: right; font-size: 12px; font-weight: 700; border-radius: 0 10px 0 0;">المتبرع / جهة الاتصال</th>
              <th style="background-color: #00549A; color: white; padding: 15px; text-align: right; font-size: 12px; font-weight: 700;">العنوان التفصيلي</th>
              <th style="background-color: #00549A; color: white; padding: 15px; text-align: center; font-size: 12px; font-weight: 700;">المبلغ</th>
              <th style="background-color: #00549A; color: white; padding: 15px; text-align: center; font-size: 12px; font-weight: 700;">موعد الاستلام</th>
              <th style="background-color: #00549A; color: white; padding: 15px; text-align: center; font-size: 12px; font-weight: 700; border-radius: 10px 0 0 0;">الحالة</th>
            </tr>
          </thead>
          <tbody>
      `;

      representativePayments.forEach((p, index) => {
        const scheduledDateStr = p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString('ar-EG') : 'غير محدد';
        const bgColor = index % 2 === 0 ? '#ffffff' : '#fcfdfe';
        
        html += `
          <tr style="background-color: ${bgColor};">
            <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
              <p style="font-size: 13px; font-weight: 700; color: #101727; margin: 0;">${p.userName || 'غير متوفر'}</p>
              <p style="font-size: 11px; color: #00549A; font-weight: 600; margin: 4px 0 0 0;">${p.phone || ''}</p>
              ${p.contactName ? `<p style="font-size: 10px; color: #697282; margin: 4px 0 0 0;">جهة الاتصال: ${p.contactName}</p>` : ''}
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; vertical-align: top; max-width: 200px;">
              <p style="font-size: 12px; color: #101727; line-height: 1.4; margin: 0;">${p.address || 'غير متوفر'}</p>
              ${p.deliveryAreaName ? `<p style="font-size: 10px; color: #00549A; font-weight: 700; margin: 5px 0 0 0;">📍 ${p.deliveryAreaName}</p>` : ''}
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; text-align: center; vertical-align: middle;">
              <p style="font-size: 14px; font-weight: 800; color: #101727; margin: 0;">${p.amount.toLocaleString()} <span style="font-size: 10px; font-weight: 400;">ج.م</span></p>
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; text-align: center; vertical-align: middle;">
              <p style="font-size: 12px; color: #101727; font-weight: 600; margin: 0;">${scheduledDateStr}</p>
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; text-align: center; vertical-align: middle;">
              <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; background-color: #fef3c7; color: #92400e; font-size: 10px; font-weight: 700;">قيد التنفيذ</div>
            </td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="text-align: center; width: 200px;">
            <p style="font-size: 12px; font-weight: 700; color: #101727; margin-bottom: 40px;">توقيع المسؤول</p>
            <div style="border-bottom: 1px solid #e2e8f0; width: 100%;"></div>
          </div>
          <div style="text-align: center; width: 200px;">
            <p style="font-size: 12px; font-weight: 700; color: #101727; margin-bottom: 40px;">ختم الجمعية</p>
            <div style="border-bottom: 1px solid #e2e8f0; width: 100%;"></div>
          </div>
        </div>
        
        <div style="position: fixed; bottom: 0; right: 0; left: 0; padding: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="font-size: 10px; color: #94a3b8; margin: 0;">هذا التقرير تم إنشاؤه آلياً بواسطة نظام إدارة رسالة - قسم التحصيل الخارجي</p>
        </div>
      `;

      pdfContent.innerHTML = html;
      document.body.appendChild(pdfContent);

      const canvas = await html2canvas(pdfContent, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      document.body.removeChild(pdfContent);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('حدث خطأ أثناء إنشاء ملف الـ PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold font-[Cairo] text-sm transition-all shadow-lg
        ${isExporting 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-white text-[#00549A] hover:bg-[#00549A] hover:text-white border border-[#00549A]/10 shadow-[#00549A]/5'
        }`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري التصدير...</span>
        </>
      ) : (
        <>
          <div className="p-1.5 rounded-lg bg-[#00549A]/5 group-hover:bg-white/20 transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <span>تصدير أوردرات المناديب (PDF)</span>
          <Download className="w-4 h-4 mr-1 opacity-50 group-hover:opacity-100" />
        </>
      )}
    </button>
  );
};

export default PdfExportButton;

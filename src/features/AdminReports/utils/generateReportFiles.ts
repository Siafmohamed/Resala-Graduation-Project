import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateExcelFile = (data: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
};

export const generatePDFFile = (
  data: Record<string, unknown>[],
  headers: string[],
  filename: string,
  title: string,
) => {
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(18);
  doc.text(title, 105, 20, { align: 'center' });

  autoTable(doc, {
    head: [headers],
    body: data.map((row) => headers.map((header) => row[header] ?? '')),
    startY: 30,
    theme: 'grid',
  });

  doc.save(filename);
};

export interface ReportSummaryRow {
  id: string;
  title: string;
  period: string;
  totalAmount: number;
  donationsCount: number;
}

export interface AdminReportsOverview {
  generatedReports: number;
  pendingExports: number;
  lastGeneratedAt: string;
  rows: ReportSummaryRow[];
}


export interface ReportConfig {
  id: string;
  title: string;
  apiEndpoint: string;
  supportsPeriodFilter: boolean;
  description?: string;
}

export const reportsConfig: ReportConfig[] = [
  {
    id: 'overview',
    title: 'ملخص عام',
    apiEndpoint: '/api/v1/admin/dashboard/overview',
    supportsPeriodFilter: true,
    description: 'تقرير يحتوي على جميع المؤشرات الرئيسية',
  },
  {
    id: 'monthly-donations',
    title: 'التبرعات الشهرية',
    apiEndpoint: '/api/v1/admin/dashboard/monthly-donations',
    supportsPeriodFilter: true,
    description: 'تقرير يوضح اتجاه التبرعات خلال السنة',
  },
  {
    id: 'users',
    title: 'احصائيات المستخدمين',
    apiEndpoint: '/api/v1/admin/dashboard/users',
    supportsPeriodFilter: true,
    description: 'تقرير يوضح احصائيات المستخدمين والمشتركين والغير مشتركين',
  },
  {
    id: 'sponsorships-stats',
    title: 'احصائيات الكفالات',
    apiEndpoint: '/api/v1/admin/dashboard/sponsorships-stats',
    supportsPeriodFilter: true,
    description: 'تقرير يوضح توزيع الكفالات حسب النوع',
  },
  {
    id: 'emergency-cases',
    title: 'احصائيات حالات الطوارئ',
    apiEndpoint: '/api/v1/admin/dashboard/emergency-cases',
    supportsPeriodFilter: true,
    description: 'تقرير يوضح احصائيات حالات الطوارئ',
  },
];

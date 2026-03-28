export const PAGE_METADATA: { [key: string]: { title: string; subtitle: string } } = {
  // Admin Routes
  '/admin-dashboard': {
    title: 'لوحة التحكم',
    subtitle: 'نظرة شاملة على أداء الجمعية',
  },
  '/donors': {
    title: 'إدارة المكتشفات',
    subtitle: 'عرض وتصفية جميع المكتشفات المسجلة',
  },
  '/sponsorships': {
    title: 'إدارة المساعدات',
    subtitle: 'تتبع وإدارة جميع المساعدات المقدمة',
  },
  '/reports': {
    title: 'التقارير والإحصائيات',
    subtitle: 'تحليلات مفصلة وإحصائيات شاملة',
  },
  '/settings': {
    title: 'إعدادات النظام',
    subtitle: 'إدارة الإعدادات العامة للمنظمة',
  },

  // Reception Routes
  '/reception-dashboard': {
    title: 'لوحة الاستقبال',
    subtitle: 'إدارة المتبرعين وتأكيد عمليات الدفع',
  },
  '/register-new-donor': {
    title: 'إضافة متبرع جديد',
    subtitle: 'تسجيل بيانات متبرع جديد في النظام',
  },
  '/donations': {
    title: 'تسجيل تبرع عيني',
    subtitle: 'توثيق التبرعات العينية المستلمة من المتبرعين',
  },
  '/in-kind-donations': {
    title: 'قائمة التبرعات العينية',
    subtitle: 'عرض وإدارة جميع التبرعات العينية المسجلة',
  },
  '/donations/edit': {
    title: 'تعديل التبرع',
    subtitle: 'تحديث بيانات التبرع العيني المسجل',
  },
  '/donations/detail': {
    title: 'تفاصيل التبرع',
    subtitle: 'عرض بيانات التبرع العيني بالتفصيل',
  },
  '/notifications': {
    title: 'الإشعارات',
    subtitle: 'تنبيهات وتحديثات عمليات الدفع',
  },
  '/reception-settings': {
    title: 'الإعدادات',
    subtitle: 'إدارة معلوماتك الشخصية وكلمة المرور',
  },
};

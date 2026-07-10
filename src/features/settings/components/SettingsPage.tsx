import { useState } from 'react';
import { 
  Building2, 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { SubscriptionSlotsManager } from './SubscriptionSlotsManager';
import { DeliveryAreasManager } from './DeliveryAreasManager';
import { PaymentMethodsSettings } from './PaymentMethodsSettings';
import { BroadcastNotification } from '../../notifications/components/BroadcastNotification';

export function SettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20" dir="rtl">
      {/* 1. Association Info */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#00549A] py-4 px-6">
          <CardTitle className="text-white font-[Cairo] text-xl flex items-center gap-3 font-bold">
            <Building2 className="w-6 h-6" />
            معلومات الجمعية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Name */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-gray-500 font-[Cairo] uppercase tracking-wider">اسم الفرع</p>
            <p className="text-[#101727] font-[Cairo] text-lg font-bold">رسالة الخير - فرع الزقازيق</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-gray-500 font-[Cairo] uppercase tracking-wider">رقم الهاتف</p>
            <p className="text-[#101727] font-[Cairo] text-lg font-bold" dir="ltr">055-1234567</p>
          </div>

          {/* Address */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-gray-500 font-[Cairo] uppercase tracking-wider">العنوان</p>
            <p className="text-[#101727] font-[Cairo] text-lg font-bold">شارع الجلاء، منطقة الزقازيق، الشرقية</p>
          </div>

          {/* Email */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-gray-500 font-[Cairo] uppercase tracking-wider">البريد الإلكتروني</p>
            <p className="text-[#101727] font-[Cairo] text-lg font-bold" dir="ltr">zagazig@resala.org</p>
          </div>

          {/* Working Hours */}
          <div className="md:col-span-2 space-y-2 bg-gray-50 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-gray-500 font-[Cairo] uppercase tracking-wider">ساعات العمل</p>
            <p className="text-[#101727] font-[Cairo] text-lg font-bold">السبت - الخميس: 9:00 صباحاً - 5:00 مساءً</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Payment Methods */}
      <PaymentMethodsSettings />

      {/* 3. Subscription Slots */}
      <SubscriptionSlotsManager />

      {/* 4. Representative Areas */}
      <DeliveryAreasManager />

      {/* 5. Broadcast Notification (عجز تبرعات) */}
      <BroadcastNotification />


    </div>
  );
}

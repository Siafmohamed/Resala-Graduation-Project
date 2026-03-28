import { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Save, 
  X,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function SettingsPage() {
  const [areas, setAreas] = useState(['طنطا', 'كفر الزيات', 'السنطة', 'بسيون', 'قطور']);
  const [newArea, setNewArea] = useState('');

  const handleAddArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()]);
      setNewArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter(a => a !== area));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20" dir="rtl">
      {/* 1. Association Info */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#00549A] py-4 px-6">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <Building2 className="w-5 h-5" />
            معلومات الجمعية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input 
              label="اسم الفرع" 
              defaultValue="رسالة الخير - فرع الزقازيق" 
              className="font-[Cairo]"
            />
            <Input 
              label="العنوان" 
              defaultValue="شارع الجلاء، منطقة الزقازيق، الشرقية" 
              className="font-[Cairo]"
            />
          </div>
          <div className="space-y-4">
            <Input 
              label="رقم الهاتف" 
              defaultValue="055-1234567" 
              className="font-[Cairo]"
              dir="ltr"
            />
            <Input 
              label="البريد الإلكتروني" 
              defaultValue="zagazig@resala.org" 
              className="font-[Cairo]"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-2">
            <Input 
              label="ساعات العمل" 
              defaultValue="السبت - الخميس: 9:00 صباحاً - 5:00 مساءً" 
              className="font-[Cairo]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Payment Methods */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#00549A] py-4 px-6">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <CreditCard className="w-5 h-5" />
            طرق الدفع المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[
            { id: 'branch', label: 'الدفع بالفرع', status: 'مفعل' },
            { id: 'vodafone', label: 'فودافون كاش', status: 'مفعل' },
            { id: 'representative', label: 'التحصيل بواسطة مندوب', status: 'مفعل' },
          ].map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="font-[Cairo] font-bold text-[#495565]">{method.label}</span>
              <div className="flex items-center gap-2 bg-[#E6F4EA] text-[#1E7E34] px-3 py-1 rounded-full text-xs font-bold font-[Cairo]">
                <CheckCircle2 className="w-3 h-3" />
                {method.status}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Representative Areas */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#00549A] py-4 px-6">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <MapPin className="w-5 h-5" />
            مناطق خدمة المندوبين
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 font-[Cairo]">المناطق المتاحة حالياً</label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <div key={area} className="flex items-center gap-2 bg-white border border-[#00549A] text-[#00549A] px-4 py-1.5 rounded-full text-sm font-bold font-[Cairo]">
                  {area}
                  <button onClick={() => handleRemoveArea(area)} className="hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#101727] font-[Cairo]">إضافة منطقة جديدة</label>
            <div className="flex gap-2">
              <Input 
                placeholder="اسم المنطقة..." 
                className="font-[Cairo] flex-1" 
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
              />
              <Button onClick={handleAddArea} className="bg-[#00549A] hover:bg-[#004480] font-[Cairo] px-8">
                إضافة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Sponsorship Policies */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#00549A] py-4 px-6">
          <CardTitle className="text-white font-[Cairo] text-lg flex items-center gap-2 font-bold">
            <ShieldCheck className="w-5 h-5" />
            سياسات الكفالات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#101727] font-[Cairo]">فترة السماح للتأخير (بـأيام)</label>
              <Input defaultValue="7" type="number" className="font-[Cairo]" />
              <p className="text-[11px] text-gray-400 font-[Cairo]">عدد الأيام المسموح بتأخر دفع الكفالة قبل اتخاذ إجراء</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#101727] font-[Cairo]">الحد الأقصى لتأخير الإلغاء (بـأيام)</label>
              <Input defaultValue="60" type="number" className="font-[Cairo]" />
              <p className="text-[11px] text-gray-400 font-[Cairo]">عدد الأيام التي يسقط بعدها طلب الكفالة تلقائياً في حالة عدم الدفع</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#101727] font-[Cairo]">حد التأخير لإرسال تنبيه آلياً</label>
              <Input defaultValue="3" type="number" className="font-[Cairo]" />
              <p className="text-[11px] text-gray-400 font-[Cairo]">عدد الأيام التي بعدها يتم إرسال تنبيه آلي لمنسق المنطقة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 left-8 right-[292px] flex justify-end pointer-events-none">
        <Button className="bg-[#00549A] hover:bg-[#004480] text-white px-8 py-6 rounded-xl shadow-lg flex items-center gap-3 font-bold text-lg font-[Cairo] pointer-events-auto">
          <Save className="w-5 h-5" />
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );
}

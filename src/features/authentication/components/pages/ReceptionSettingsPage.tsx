import { useState } from 'react';
import { 
  User, 
  Lock, 
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../index';

export function ReceptionSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const session = useAuthStore((s: any) => s.session);
  const clearAuth = useAuthStore((s: any) => s.clearAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('تم حفظ التغييرات بنجاح');
    }, 800);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('تم تغيير كلمة المرور بنجاح');
    }, 800);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8" dir="rtl">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-100 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-4 font-[Cairo] font-bold text-sm transition-all border-b-2 ${
            activeTab === 'profile' 
              ? 'border-[#00549A] text-[#00549A]' 
              : 'border-transparent text-[#697282] hover:text-[#00549A]'
          }`}
        >
          المعلومات الشخصية
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-8 py-4 font-[Cairo] font-bold text-sm transition-all border-b-2 ${
            activeTab === 'password' 
              ? 'border-[#00549A] text-[#00549A]' 
              : 'border-transparent text-[#697282] hover:text-[#00549A]'
          }`}
        >
          تغيير كلمة المرور
        </button>
      </div>

      <div className="flex justify-center">
        {activeTab === 'profile' ? (
          <Card className="w-full max-w-2xl border-none shadow-[0px_4px_30px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
            <CardContent className="p-10">
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-8">
                {/* Section Title */}
                <div className="flex items-center gap-4 self-end">
                  <span className="font-[Cairo] font-bold text-xl text-[#00549A]">المعلومات الشخصية</span>
                  <div className="p-3 rounded-2xl bg-[#EEF3FB] text-[#00549A]">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">الاسم</label>
                    <Input 
                      defaultValue={session?.name || 'أحمد السيد'} 
                      className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">البريد الإلكتروني</label>
                    <Input 
                      defaultValue="reception@resala-zagazig.org" 
                      dir="ltr"
                      className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">رقم الهاتف</label>
                    <Input 
                      defaultValue="01012345678" 
                      dir="ltr"
                      className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#00549A] hover:bg-[#004480] text-white px-12 py-6 rounded-2xl shadow-lg font-bold text-lg font-[Cairo] transition-all active:scale-95"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-2xl space-y-8">
            <Card className="border-none shadow-[0px_4px_30px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-10">
                <form onSubmit={handleChangePassword} className="flex flex-col gap-8">
                  {/* Section Title */}
                  <div className="flex items-center gap-4 self-end">
                    <span className="font-[Cairo] font-bold text-xl text-[#00549A]">تغيير كلمة المرور</span>
                    <div className="p-3 rounded-2xl bg-[#EEF3FB] text-[#00549A]">
                      <Lock size={24} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">كلمة المرور الحالية</label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">كلمة المرور الجديدة</label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#101727] font-[Cairo] text-right">تأكيد كلمة المرور الجديدة</label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        className="font-[Cairo] text-right bg-[#F8FAFC] border-none py-4 px-6 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#00549A] hover:bg-[#004480] text-white px-12 py-6 rounded-2xl shadow-lg font-bold text-lg font-[Cairo] transition-all active:scale-95"
                    >
                      {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Requirements Box */}
            <div className="bg-[#EEF3FB] rounded-[24px] p-8 text-right">
              <h3 className="font-[Cairo] font-bold text-base text-[#00549A] mb-4 flex items-center justify-end gap-2">
                متطلبات كلمة المرور:
                <ShieldCheck size={18} />
              </h3>
              <ul className="space-y-2 font-[Cairo] text-[#495565] text-xs">
                <li>• لا تقل عن 8 أحرف</li>
                <li>• تحتوي على أحرف كبيرة وصغيرة</li>
                <li>• تحتوي على أرقام</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

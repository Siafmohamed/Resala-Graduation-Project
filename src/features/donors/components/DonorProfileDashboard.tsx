import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  LayoutList, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package
} from 'lucide-react';
import { useDonor } from '../hooks/useDonors';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';

export function DonorProfileDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: donor,
    isLoading,
    isError,
    error,
    refetch
  } = useDonor(id!);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
          <p className="font-[Cairo] font-bold text-[#00549A]">جاري تحميل لوحة تحكم المتبرع...</p>
        </div>
      </div>
    );
  }

  if (isError || !donor) {
    return (
      <div className="p-8 bg-[#f8fafc] min-h-screen">
        <ErrorMessage
          error={error instanceof Error ? error.message : "تعذر تحميل بيانات المتبرع"}
          retry={refetch}
        />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 flex flex-col gap-6 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/donors')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#00549A] transition-colors w-fit group"
      >
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        <span className="text-sm font-bold font-[Cairo]">العودة إلى قائمة المتبرعين</span>
      </button>

      {/* Section 1 — Donor Header Card */}
      <Card className="rounded-[24px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden bg-white">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#00549A] to-[#0081ED] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/10">
              {getInitials(donor.fullName)}
            </div>
            
            {/* Donor Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[#101727] font-[Cairo]">{donor.fullName}</h1>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#00549A] text-xs font-bold font-[Cairo] border border-blue-100">
                  {donor.roleName || 'متبرع'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
                <div className="flex items-center gap-2 text-[#697282] font-[Cairo] text-sm">
                  <Mail size={16} className="opacity-70" />
                  <span>{donor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#697282] font-[Cairo] text-sm">
                  <Phone size={16} className="opacity-70" />
                  <span>{donor.phoneNumber}</span>
                </div>
              </div>
              
              <div className="text-gray-400 text-xs font-medium mt-1 font-[Cairo]">
                عضو منذ {formatDate(donor.accountCreationDate)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'عدد الكفالات', 
            value: donor.summary?.totalSponsorshipsCount ?? 0, 
            icon: LayoutList, 
            color: 'text-[#00549A]' 
          },
          { 
            label: 'المبلغ المدفوع', 
            value: `${(donor.summary?.totalPaidAmount ?? 0).toLocaleString('ar-EG')} ج.م`, 
            icon: CheckCircle2, 
            color: 'text-green-600' 
          },
          { 
            label: 'المبلغ المتبقي', 
            value: `${(donor.summary?.totalRemainingAmount ?? 0).toLocaleString('ar-EG')} ج.م`, 
            icon: Clock, 
            color: 'text-orange-600' 
          },
          { 
            label: 'تبرعات الحالات الطارئة', 
            value: `${(donor.summary?.totalEmergencyDonations ?? 0).toLocaleString('ar-EG')} ج.م`, 
            icon: AlertCircle, 
            color: 'text-[#00549A]' 
          }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] flex flex-col gap-3 border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-center gap-3 text-[#94a3b8]">
              <div className={`p-3 rounded-2xl ${metric.color.replace('text-', 'bg-')}/10`}>
                <metric.icon size={20} className={metric.color} />
              </div>
              <span className="text-xs font-bold font-[Cairo]">{metric.label}</span>
            </div>
            <div className={`text-2xl font-black ${metric.color} font-[Cairo]`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Section 3 — Status Row (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial Status */}
        <Card className="rounded-[24px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${
              donor.summary?.financialStatusColor?.toLowerCase() === 'orange' ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]' : 
              donor.summary?.financialStatusColor?.toLowerCase() === 'green' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              'bg-[#00549A]'
            }`} />
            <div className="flex flex-col gap-1">
              <span className="text-[#94a3b8] text-xs font-bold font-[Cairo]">الحالة المالية</span>
              <span className={`text-sm font-bold font-[Cairo] ${
                donor.summary?.financialStatusColor?.toLowerCase() === 'orange' ? 'text-orange-600' : 
                donor.summary?.financialStatusColor?.toLowerCase() === 'green' ? 'text-green-600' : 
                'text-[#00549A]'
              }`}>
                {donor.summary?.financialStatusName}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Regularity */}
        <Card className="rounded-[24px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#94a3b8]">
                <span className="text-xs font-bold font-[Cairo]">انتظام الدفع</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <span className="text-green-600 text-xl font-black font-[Cairo]">
                {donor.summary?.paymentRegularityPercentage ?? 0}%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#00549A] to-[#0081ED] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${donor.summary?.paymentRegularityPercentage ?? 0}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4 — Monthly Sponsorships List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#94a3b8] font-[Cairo] font-bold text-sm">
          <LayoutList size={18} />
          <span>الكفالات الشهرية</span>
        </div>
        
        <Card className="rounded-[24px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
          <CardContent className="p-0">
            {donor.sponsorships?.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm font-[Cairo]">لا توجد كفالات</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {donor.sponsorships?.map((sponsorship, idx) => {
                  const paidPercentage = sponsorship.totalExpectedAmount > 0 
                    ? (sponsorship.totalPaidAmount / sponsorship.totalExpectedAmount) * 100 
                    : 0;
                  const isPaid = paidPercentage >= 100;
                  
                  return (
                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-[#101727] group-hover:text-[#00549A] transition-colors font-[Cairo]">
                          {sponsorship.sponsorshipName}
                        </span>
                        <span className="text-xs text-gray-400 font-[Cairo]">
                          {sponsorship.monthlySubscriptionAmount.toLocaleString('ar-EG')} ج.م/شهر · مدفوع {sponsorship.totalPaidAmount.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isPaid ? 'bg-green-500' : 'bg-orange-400'}`}
                            style={{ width: `${Math.min(paidPercentage, 100)}%` }}
                          />
                        </div>
                        
                        <div className={`px-4 py-2 rounded-full text-xs font-bold font-[Cairo] min-w-[80px] text-center ${
                          isPaid 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                          {isPaid ? 'مدفوع' : 'متبقي'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 5 — Emergency Donations List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#94a3b8] font-[Cairo] font-bold text-sm">
          <AlertCircle size={18} />
          <span>تبرعات الحالات الطارئة</span>
        </div>
        
        <Card className="rounded-[24px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
          <CardContent className="p-0">
            {donor.emergencyDonations?.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm font-[Cairo]">لا توجد تبرعات حالات طارئة</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {donor.emergencyDonations?.map((donation, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-[#101727] group-hover:text-[#00549A] transition-colors font-[Cairo]">
                        {donation.emergencyCaseTitle}
                      </span>
                      <span className="text-xs text-gray-400 font-[Cairo]">
                        {formatDate(donation.donationDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-bold font-[Cairo] border border-green-100">
                        مؤكد
                      </div>
                      <span className="text-lg font-black text-green-600 min-w-[100px] text-right font-[Cairo]">
                        {donation.donationAmount.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  Users, 
  HandCoins, 
  CheckCircle2, 
  Eye, 
  DollarSign,
  UserCheck,
  History,
  AlertCircle,
  XCircle,
  CheckCircle,
  Calendar,
  CreditCard,
  Phone,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';

// ── Mock Data ───────────────────────────────────────────────────────────────

const stats = [
  { label: 'عدد عمليات الدفع اليوم', value: '3', icon: DollarSign, color: '#00549A', bg: '#e6eff7' },
  { label: 'عدد المتبرعين اليوم', value: '3', icon: Users, color: '#22c55e', bg: '#e9f9ef' },
  { label: 'كفالات تحتاج متابعة', value: '2', icon: AlertCircle, color: '#F04930', bg: '#fdeceb' },
];

const pendingDonations = [
  { id: 1, donor: 'أحمد محمود السيد', donorId: '101', type: 'كفالة يتيم', method: 'فودافون كاش', status: 'قيد المراجعة', methodColor: '#e6eff7', methodText: '#00549A', date: '2024-03-27', amount: '500 ج.م' },
  { id: 2, donor: 'فاطمة حسن علي', donorId: '102', type: 'كفالة أسرة', method: 'مقر الجمعية', status: 'قيد المراجعة', methodColor: '#f3e8ff', methodText: '#7e22ce', date: '2024-03-27', amount: '1000 ج.م' },
  { id: 3, donor: 'محمد عبد الرحمن', donorId: '103', type: 'كفالة طالب علم', method: 'فودافون كاش', status: 'قيد المراجعة', methodColor: '#e6eff7', methodText: '#00549A', date: '2024-03-26', amount: '300 ج.م' },
  { id: 4, donor: 'خالد إبراهيم حسن', donorId: '104', type: 'كفالة أسرة', method: 'فودافون كاش', status: 'قيد المراجعة', methodColor: '#e6eff7', methodText: '#00549A', date: '2024-03-26', amount: '750 ج.م' },
  { id: 5, donor: 'نورا حسين محمود', donorId: '105', type: 'كفالة يتيم', method: 'فودافون كاش', status: 'قيد المراجعة', methodColor: '#e6eff7', methodText: '#00549A', date: '2024-03-25', amount: '500 ج.م' },
];

const recentActivities = [
  { text: 'تم تأكيد دفع كفالة يتيم - محمد السيد', time: 'منذ 5 دقائق', icon: CheckCircle2, color: '#22c55e' },
  { text: 'تم إضافة متبرع جديد - هدى أحمد', time: 'منذ 15 دقيقة', icon: UserCheck, color: '#00549A' },
  { text: 'تم تسجيل تبرع عيني - أدوية طبية', time: 'منذ ساعة', icon: HandCoins, color: '#7e22ce' },
  { text: 'تم تحديث بيانات متبرع - عمر فتحي', time: 'منذ ساعتين', icon: History, color: '#64748b' },
];

// ── Detail View Component ───────────────────────────────────────────────────

const DonationDetails: React.FC<{ id: string, onBack: () => void }> = ({ id }) => {
  const navigate = useNavigate();
  const donation = pendingDonations.find(d => d.id === Number(id)) || pendingDonations[0];
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async (_action: 'approve' | 'reject') => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    
    // After any process, navigate to donor details as requested
    navigate(`/donors/${donation.donorId}`);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Header */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">تفاصيل المتبرع</h1>
        <p className="font-[Cairo] font-medium text-[#697282] text-sm opacity-70">معلومات كاملة عن المتبرع وحالة الدفع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Details & Receipt */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Payment Info Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col items-end gap-1">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">تفاصيل عملية الدفع</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <CreditCard size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">طريقة الدفع</span>
                    <span 
                      className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo]"
                      style={{ backgroundColor: donation.methodColor, color: donation.methodText }}
                    >
                      {donation.method}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Calendar size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">تاريخ الطلب</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donation.date} 10:30</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <DollarSign size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">المبلغ</span>
                    <span className="font-bold text-lg text-[#00549A] font-[Cairo]">{donation.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 pt-6 border-t border-gray-50">
                <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">حالة الدفع</span>
                <span className="px-4 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-bold font-[Cairo]">
                  {donation.status}
                </span>
              </div>

              {/* Transfer Details Box */}
              <div className="p-6 rounded-3xl bg-[#f8fafc] flex flex-col gap-4">
                <h3 className="font-[Cairo] font-bold text-sm text-[#00549A] text-right">تفاصيل التحويل</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101727]">5678****</span>
                    <span className="text-[#697282] font-[Cairo]">رقم التحويل</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101727]">10:25</span>
                    <span className="text-[#697282] font-[Cairo]">وقت التحويل</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-green-600">متاح</span>
                    <span className="text-[#697282] font-[Cairo]">إثبات التحويل</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Donor Info & Receipt Preview */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Donor Info Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col items-end gap-1">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">بيانات المتبرع</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">الاسم</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donation.donor}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Users size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">رقم الهاتف</span>
                    <span className="font-bold text-sm text-[#101727] font-[Cairo]">01012345678</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8fafc] text-[#00549A]">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Type Card */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col items-end gap-1">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">تفاصيل الكفالة</h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#101727] font-[Cairo]">{donation.type}</span>
                  <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">نوع الكفالة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#00549A] font-[Cairo]">{donation.amount}</span>
                  <span className="text-[11px] font-bold text-[#94a3b8] font-[Cairo]">المبلغ</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col items-end gap-1">
                <h2 className="font-[Cairo] font-bold text-lg text-[#00549A]">إيصال الدفع المرفوع من المتبرع</h2>
              </div>
              <div className="w-full aspect-video rounded-3xl bg-black overflow-hidden flex items-center justify-center relative">
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                    <div className="w-12 h-12 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
                    <span className="font-[Cairo] font-bold text-[#00549A]">جاري معالجة الطلب...</span>
                  </div>
                )}
                {/* Simulated receipt image area */}
                <div className="text-white opacity-20 flex flex-col items-center gap-2">
                  <Eye size={48} />
                  <span className="font-[Cairo] text-sm">صورة الإيصال</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  disabled={isProcessing}
                  onClick={() => handleProcess('approve')}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#00549A] text-white font-bold font-[Cairo] text-sm hover:bg-[#004077] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  تأكيد عملية الدفع
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => setRejectMode(true)}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#F04930] text-white font-bold font-[Cairo] text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} />
                  رفض عملية الدفع
                </button>
              </div>

              {rejectMode && (
                <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 pt-6 border-t border-gray-50">
                  <div className="flex flex-col items-end gap-2">
                    <label className="font-[Cairo] font-bold text-xs text-[#495565]">سبب الرفض</label>
                    <textarea 
                      placeholder="يرجى كتابة سبب الرفض بوضوح..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-red-100 bg-red-50/10 text-right text-xs font-[Cairo] min-h-[100px] focus:outline-none focus:border-red-300"
                    />
                  </div>
                  <div className="flex gap-3 justify-start">
                    <button 
                      onClick={() => setRejectMode(false)}
                      className="px-6 py-2 rounded-xl bg-gray-100 text-[#495565] font-bold font-[Cairo] text-xs hover:bg-gray-200 transition-all"
                    >
                      إلغاء
                    </button>
                    <button 
                      disabled={!rejectReason || isProcessing}
                      onClick={() => handleProcess('reject')}
                      className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold font-[Cairo] text-xs hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      تأكيد الرفض
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard Component ────────────────────────────────────────────────

const ReceptionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (id) {
    return (
      <div className="p-6 bg-[#f8fafc] min-h-screen" dir="rtl">
        <div className="w-full">
          <DonationDetails id={id} onBack={() => navigate('/reception-dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-gray-100 shadow-none rounded-2xl bg-white">
            <CardContent className="p-8 flex items-center justify-between">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium text-[#697282] font-[Cairo]">{stat.label}</span>
                <span className="text-3xl font-bold text-[#101727] font-[Cairo]">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks Needing Action */}
      <div className="flex flex-col gap-6">
        <h2 className="font-[Cairo] font-bold text-xl text-[#00549A] text-center">مهام تحتاج إجراء</h2>
        <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#f8fafc]/50 border-b border-gray-100">
                    <th className="px-8 py-5 font-bold text-[#495565] font-[Cairo] text-[13px]">اسم المتبرع</th>
                    <th className="px-8 py-5 font-bold text-[#495565] font-[Cairo] text-[13px]">نوع الكفالة</th>
                    <th className="px-8 py-5 font-bold text-[#495565] font-[Cairo] text-[13px]">طريقة الدفع</th>
                    <th className="px-8 py-5 font-bold text-[#495565] font-[Cairo] text-[13px]">حالة الدفع</th>
                    <th className="px-8 py-5 font-bold text-[#495565] font-[Cairo] text-[13px] text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingDonations.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-medium text-[#495565] font-[Cairo] text-sm">{row.donor}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[#697282] font-[Cairo] text-sm">{row.type}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span 
                          className="inline-flex px-4 py-1.5 rounded-xl text-[11px] font-bold font-[Cairo]"
                          style={{ backgroundColor: row.methodColor, color: row.methodText }}
                        >
                          {row.method}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex px-4 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-bold font-[Cairo]">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => navigate(`/donation-details/${row.id}`)}
                            className="px-6 py-2 rounded-xl bg-[#00549A] text-white text-xs font-bold font-[Cairo] hover:bg-[#004077] transition-all"
                          >
                            تأكيد الدفع
                          </button>
                          <button 
                            onClick={() => navigate(`/donation-details/${row.id}`)}
                            className="px-6 py-2 rounded-xl border border-gray-200 text-[#697282] text-xs font-bold font-[Cairo] hover:bg-gray-50 transition-all"
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="flex flex-col gap-6">
        <h2 className="font-[Cairo] font-bold text-xl text-[#00549A] text-center">الأنشطة الأخيرة</h2>
        <Card className="border border-gray-100 shadow-none rounded-3xl overflow-hidden bg-[#e6eff7]/30">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <span className="font-[Cairo] font-bold text-sm text-[#495565] group-hover:text-[#101727] transition-colors">{act.text}</span>
                    <span className="font-[Cairo] text-[11px] text-[#94a3b8] font-medium">{act.time}</span>
                  </div>
                  <div className="p-2.5 mr-4 rounded-full bg-white shadow-sm" style={{ color: act.color }}>
                    <act.icon size={18} strokeWidth={2} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionDashboard;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInKindDonations, useInKindDonationsByDonor, useDeleteInKindDonation } from '../hooks/useInKindDonations';
import { DonorSearchSelect } from './DonorSearchSelect';
import { 
  Gift, 
  Calendar, 
  User,
  X,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Filter,
  Package,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useUserRole, Role } from '@/features/authentication';
import { type Permission } from '@/features/authentication/types/role.types';

export function InKindDonationsListPage() {
  const navigate = useNavigate();
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const userRole = useUserRole();
  const deleteMutation = useDeleteInKindDonation();
  
  // Conditionally use the donor filter hook or the general hook
  const { data: allDonations, isLoading: isLoadingAll } = useInKindDonations();
  const { data: donorDonations, isLoading: isLoadingDonor } = useInKindDonationsByDonor(selectedDonorId || '');

  const donations = selectedDonorId ? donorDonations : allDonations;
  const isLoading = selectedDonorId ? isLoadingDonor : isLoadingAll;

  const handleDelete = (id: string, donationName: string) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف تبرع "${donationName}"؟`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          // Toast is already shown in the hook
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">التبرعات العينية</h1>
          <p className="font-[Cairo] font-medium text-[#697282] text-sm">إدارة ومتابعة جميع التبرعات العينية المسجلة في النظام</p>
        </div>
        <Button 
          onClick={() => navigate('/donations')}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 font-[Cairo]"
        >
          <Plus size={20} strokeWidth={2.5} />
          تسجيل تبرع عيني
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e6eff7] text-[#00549A]">
              <Package size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">إجمالي التبرعات</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">{donations?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e9f9ef] text-[#22c55e]">
              <TrendingUp size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">أنواع التبرعات</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">
                {donations ? new Set(donations.map(d => d.donationTypeName)).size : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#fef3c7] text-[#f59e0b]">
              <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#697282] font-[Cairo]">المتبرعون النشطون</span>
              <span className="text-xl font-bold text-[#101727] font-[Cairo]">
                {donations ? new Set(donations.map(d => d.donorId)).size : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-[#00549A]" />
            <h3 className="font-[Cairo] font-bold text-sm text-[#101727]">تصفية والبحث</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <DonorSearchSelect 
                onSelect={(id) => setSelectedDonorId(id)}
                selectedDonorId={selectedDonorId || undefined}
              />
            </div>
            {selectedDonorId && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedDonorId(null)}
                className="flex items-center gap-2 px-4 py-2 border-none bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-[Cairo] font-bold rounded-xl"
              >
                <X size={16} />
                إزالة الفلتر
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
          <span className="font-[Cairo] text-[#697282]">جاري تحميل التبرعات...</span>
        </div>
      ) : !donations || donations.length === 0 ? (
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="p-6 rounded-full bg-[#F8FAFC] text-gray-300">
              <Gift size={64} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-[Cairo] font-bold text-xl text-[#101727]">
                {selectedDonorId ? 'لا توجد تبرعات لهذا المتبرع' : 'لا يوجد تبرعات مسجلة'}
              </h3>
              <p className="font-[Cairo] text-[#697282] text-sm">
                {selectedDonorId 
                  ? 'هذا المتبرع لم يسجل أي تبرعات عينية بعد'
                  : 'ابدأ بتسجيل أول تبرع عيني في النظام'}
              </p>
            </div>
            {!selectedDonorId && (
              <Button 
                onClick={() => navigate('/donations')}
                className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-[#00549A]/20 hover:opacity-90 transition-all font-[Cairo]"
              >
                <Plus size={20} />
                تسجيل أول تبرع
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {donations.map((donation) => (
            <Card 
              key={donation.id} 
              className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Main Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e6eff7] to-[#f0f7ff] text-[#00549A] self-start flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Gift size={24} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-[Cairo] font-bold text-lg text-[#101727] mb-1">
                              {donation.donationTypeName}
                            </h3>
                            {donation.description && (
                              <p className="text-[#697282] text-sm font-[Cairo] line-clamp-2">
                                {donation.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-[#E6F4EA] to-[#f0f9f4] text-[#1E7E34] px-4 py-2 rounded-xl text-sm font-bold font-[Cairo] border border-[#1E7E34]/10">
                              الكمية: {donation.quantity}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-[#697282] font-[Cairo] pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#f8fafc]">
                              <User size={14} className="text-[#00549A]" />
                            </div>
                            <span className="font-medium">{donation.donorName || 'غير معروف'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#f8fafc]">
                              <Calendar size={14} className="text-[#00549A]" />
                            </div>
                            <span>
                              {donation.createdAt 
                                ? format(new Date(donation.createdAt), 'dd MMMM yyyy', { locale: ar }) 
                                : 'غير محدد'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t md:border-t-0 md:border-r border-gray-100 p-4 flex md:flex-col justify-center gap-2 bg-gradient-to-l md:bg-gradient-to-r from-[#f8fafc] to-white">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/in-kind-donations/${donation.id}`)}
                      className="flex-1 md:flex-none text-[#00549A] hover:bg-[#e6eff7] hover:text-[#00549A] rounded-xl font-[Cairo] font-bold gap-2 transition-all"
                    >
                      <Eye size={16} />
                      <span className="md:hidden lg:inline">عرض</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/in-kind-donations/edit/${donation.id}`)}
                      className="flex-1 md:flex-none text-[#697282] hover:bg-[#f0f0f0] hover:text-[#495565] rounded-xl font-[Cairo] font-bold gap-2 transition-all"
                    >
                      <Edit2 size={16} />
                      <span className="md:hidden lg:inline">تعديل</span>
                    </Button>
                    {userRole === Role.ADMIN && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(donation.id, donation.donationTypeName)}
                        disabled={deleteMutation.isPending}
                        className="flex-1 md:flex-none text-[#F04930] hover:bg-red-50 hover:text-[#F04930] rounded-xl font-[Cairo] font-bold gap-2 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        <span className="md:hidden lg:inline">حذف</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

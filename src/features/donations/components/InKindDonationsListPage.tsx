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
  Trash2
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

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التبرع؟')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Filters Section */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-[#101727] mb-2 font-[Cairo] text-right">تصفية حسب المتبرع</label>
              <div className="flex gap-2">
                <DonorSearchSelect 
                  onSelect={(id) => setSelectedDonorId(id)}
                  selectedDonorId={selectedDonorId || undefined}
                />
                {selectedDonorId && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDonorId(null)}
                    className="rounded-2xl px-4 border-none bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
            </div>
            <div className="md:w-auto w-full pt-7">
              <div className="bg-[#EEF3FB] px-6 py-4 rounded-2xl flex items-center gap-3 border border-[#00549A]/5">
                <span className="font-[Cairo] text-[14px] text-[#00549A]">إجمالي التبرعات:</span>
                <span className="font-[Cairo] font-bold text-[16px] text-[#00549A]">{donations?.length || 0}</span>
              </div>
            </div>
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
        <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="p-6 rounded-full bg-[#F8FAFC] text-gray-300">
            <Gift size={64} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-[Cairo] font-bold text-xl text-[#101727]">لا يوجد تبرعات مسجلة</h3>
            <p className="font-[Cairo] text-[#697282] text-sm">ابدأ بتسجيل أول تبرع عيني في النظام</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {donations.map((donation) => (
            <Card 
              key={donation.id} 
              className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.02)] rounded-[24px] overflow-hidden bg-white hover:shadow-md transition-all group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Left: Action & Info */}
                  <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Icon */}
                    <div className="p-4 rounded-2xl bg-[#EEF3FB] text-[#00549A] self-start md:self-center">
                      <Gift size={24} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-[Cairo] font-bold text-lg text-[#101727]">{donation.donationTypeName}</h3>
                        <span className="bg-[#E6F4EA] text-[#1E7E34] px-3 py-1 rounded-full text-xs font-bold font-[Cairo]">
                          الكمية: {donation.quantity}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-[#697282] font-[Cairo]">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-[#94a3b8]" />
                          <span>المتبرع: {donation.donorName || 'غير معروف'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#94a3b8]" />
                          <span>تاريخ التسجيل: {
                            donation.createdAt 
                              ? format(new Date(donation.createdAt), 'dd MMMM yyyy', { locale: ar }) 
                              : 'غير محدد'
                          }</span>
                        </div>
                      </div>

                      <p className="text-[#495565] text-sm font-[Cairo] line-clamp-1 opacity-80">
                        {donation.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="border-t md:border-t-0 md:border-r border-gray-50 p-4 flex md:flex-col justify-center gap-2 bg-[#F8FAFC]/50">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/donations/${donation.id}`)}
                      className="flex-1 md:flex-none text-[#00549A] hover:bg-[#EEF3FB] rounded-xl font-[Cairo] font-bold gap-2"
                    >
                      <Eye size={16} />
                      <span className="md:hidden lg:inline">عرض</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/donations/edit/${donation.id}`)}
                      className="flex-1 md:flex-none text-[#697282] hover:bg-gray-100 rounded-xl font-[Cairo] font-bold gap-2"
                    >
                      <Edit2 size={16} />
                      <span className="md:hidden lg:inline">تعديل</span>
                    </Button>
                    {userRole === Role.ADMIN && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(donation.id)}
                        disabled={deleteMutation.isPending}
                        className="flex-1 md:flex-none text-[#F04930] hover:bg-red-50 rounded-xl font-[Cairo] font-bold gap-2"
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

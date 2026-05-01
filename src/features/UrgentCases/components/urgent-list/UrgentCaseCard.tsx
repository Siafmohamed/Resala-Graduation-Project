import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { useUrgentCase } from '../../hooks/useUrgentCases';
import { EditUrgentCaseModal } from '../urgent-forms/EditUrgentCaseModal';
import { DeleteUrgentCaseModal } from '../urgent-forms/DeleteUrgentCaseModal';
import { UrgencyLevelBadge } from './UrgencyLevelBadge';
import { Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface UrgentCaseCardProps {
  caseId: number;
  onSuccess?: () => void;
}

/**
 * UrgentCaseCard
 * 
 * Displays a single urgent case by fetching its data directly from the API using the ID.
 * Endpoint: GET /api/v1/emergency-cases/{id}
 * 
 * Features:
 * - Fetches data by ID on mount
 * - Displays card with case info, progress bar, and status badges
 * - Edit and delete buttons for managing the case
 * - Responsive design with hover effects
 */
export function UrgentCaseCard({ caseId, onSuccess }: UrgentCaseCardProps) {
  const { data: caseItem, isLoading, isError, refetch } = useUrgentCase(caseId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onSuccess?.();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    // Success is handled by the mutation invalidating the list, 
    // and calling the parent's onSuccess to notify the grid.
    onSuccess?.();
  };

  if (isLoading) {
    return (
      <Card className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden flex flex-col h-96">
        <CardContent className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#F04930] animate-spin" />
            <p className="text-sm text-[#697282] font-[Cairo]">جاري تحميل البيانات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !caseItem) {
    return (
      <Card className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden flex flex-col h-96">
        <CardContent className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-3 text-center p-4">
            <AlertCircle className="w-8 h-8 text-[#F04930]" />
            <p className="text-sm text-[#697282] font-[Cairo]">حدث خطأ في تحميل البيانات</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = caseItem.targetAmount
    ? Math.min((caseItem.collectedAmount / caseItem.targetAmount) * 100, 100)
    : 0;

  return (
    <>
      <Card className="group border-none shadow-[0px_4px_25px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden hover:shadow-[0px_10px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 bg-white flex flex-col h-full">
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden bg-gray-50">
          {caseItem.imageUrl ? (
            <>
              <img
                src={caseItem.imageUrl}
                alt={caseItem.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-3">
                <span className="text-3xl">📋</span>
              </div>
              <p className="text-xs font-bold font-[Cairo]">لا توجد صورة للحالة</p>
            </div>
          )}

          {/* Status Badges - Glassmorphism style */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <span
              className={`px-4 py-2 rounded-2xl text-[11px] font-bold font-[Cairo] backdrop-blur-xl shadow-xl text-white transition-all transform group-hover:scale-105 border border-white/20 ${
                caseItem.isActive
                  ? 'bg-red-500/80'
                  : 'bg-gray-500/80'
              }`}
            >
              {caseItem.isActive ? '🚨 نشط حالياً' : '× غير نشط'}
            </span>

            <UrgencyLevelBadge level={caseItem.urgencyLevel} />
          </div>

          {/* Floating Edit/Delete buttons on hover over image */}
          <div className="absolute bottom-4 left-4 flex gap-2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-3 bg-white/95 text-[#00549A] hover:bg-[#00549A] hover:text-white rounded-2xl shadow-xl transition-all transform active:scale-90"
              title="تعديل"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-3 bg-white/95 text-[#F04930] hover:bg-[#F04930] hover:text-white rounded-2xl shadow-xl transition-all transform active:scale-90"
              title="حذف"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-7 flex flex-col flex-1">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-1 text-base group-hover:text-red-600 transition-colors">
                {caseItem.title}
              </h3>
              <p className="text-[11px] text-[#697282] font-[Cairo] mt-0.5 flex items-center gap-1.5">
                <Clock size={12} className="opacity-60" />
                <span>أُضيفت {new Date(caseItem.createdAt || Date.now()).toLocaleDateString('ar-EG')}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#697282] font-[Cairo] line-clamp-2 mb-6 leading-relaxed">
            {caseItem.description || 'لا يوجد وصف متوفر لهذه الحالة حالياً. يتم تحديث البيانات دورياً لضمان الدقة.'}
          </p>

          {/* Financial Progress Section */}
          <div className="space-y-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100/50 mt-auto">
            {/* Amount Details */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-[#697282] font-[Cairo] text-[10px] uppercase tracking-wider mb-1">المبلغ المحصل</span>
                <span className="font-bold text-[#101727] font-[Cairo] text-base">
                  {(caseItem.collectedAmount ?? 0).toLocaleString('ar-EG')}{' '}
                  <span className="text-[10px] font-medium text-gray-500">ج.م</span>
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#697282] font-[Cairo] text-[10px] uppercase tracking-wider mb-1">المبلغ المستهدف</span>
                <span className="font-bold text-red-500 font-[Cairo] text-base">
                  {(caseItem.targetAmount ?? 0).toLocaleString('ar-EG')}{' '}
                  <span className="text-[10px] font-medium text-gray-500">ج.م</span>
                </span>
              </div>
            </div>

            {/* Elegant Progress Bar */}
            <div className="space-y-3">
              <div className="h-2.5 bg-gray-200/50 rounded-full overflow-hidden p-[2px]">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                </div>
              </div>

              {/* Progress Stats */}
              <div className="flex justify-between items-center text-[11px] font-bold font-[Cairo]">
                <div className="flex items-center gap-1.5 text-red-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>{progressPercentage.toFixed(1)}% مكتمل</span>
                </div>
                {caseItem.targetAmount > caseItem.collectedAmount ? (
                  <span className="text-gray-500">
                    المتبقي:{' '}
                    {(
                      (caseItem.targetAmount ?? 0) - (caseItem.collectedAmount ?? 0)
                    ).toLocaleString('ar-EG')}{' '}
                    ج.م
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    تم اكتمال الهدف
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditUrgentCaseModal
          caseId={caseItem.id}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteUrgentCaseModal
          caseItem={caseItem}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}

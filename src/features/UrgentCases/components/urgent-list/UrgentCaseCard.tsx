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
    refetch();
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
      <Card className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {caseItem.imageUrl ? (
            <>
              <img
                src={caseItem.imageUrl}
                alt={caseItem.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-xs font-[Cairo]">لا توجد صورة</p>
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold font-[Cairo] backdrop-blur-md shadow-lg text-white transition-all transform group-hover:scale-105 ${
                caseItem.isActive
                  ? 'bg-gradient-to-r from-[#F04930] to-[#e63d1f] border border-red-300/50'
                  : 'bg-gradient-to-r from-gray-500 to-gray-400 border border-gray-300/50'
              }`}
            >
              {caseItem.isActive ? '🚨 نشط' : '× غير نشط'}
            </span>

            <UrgencyLevelBadge level={caseItem.urgencyLevel} />
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6 flex flex-col flex-1">
          {/* Title and Quick Actions */}
          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-2 text-sm leading-snug">
                {caseItem.title}
              </h3>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => setIsEditModalOpen(true)}
                title="تعديل"
                className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all transform hover:scale-110 active:scale-95"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                title="حذف"
                className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all transform hover:scale-110 active:scale-95"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#697282] font-[Cairo] line-clamp-2 mb-6">
            {caseItem.description || 'لا يوجد وصف متوفر'}
          </p>

          {/* Financial Info with Progress Bar */}
          <div className="space-y-3 pt-4 border-t border-gray-100 mt-auto">
            {/* Amount Details */}
            <div className="flex justify-between items-end text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[#697282] font-[Cairo] text-[11px]">المحصل</span>
                <span className="font-bold text-[#101727] font-[Cairo]">
                  {(caseItem.collectedAmount ?? 0).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[#697282] font-[Cairo] text-[11px]">الهدف</span>
                <span className="font-bold text-[#F04930] font-[Cairo]">
                  {(caseItem.targetAmount ?? 0).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-lg bg-gradient-to-r from-[#F04930] to-[#e63d1f]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Percentage Text */}
              <div className="flex justify-between items-center text-xs text-[#697282] font-[Cairo]">
                <span>{progressPercentage.toFixed(1)}% مكتمل</span>
                {(caseItem.targetAmount ?? 0) > (caseItem.collectedAmount ?? 0) && (
                  <span>
                    المتبقي:{' '}
                    {(
                      (caseItem.targetAmount ?? 0) - (caseItem.collectedAmount ?? 0)
                    ).toLocaleString('ar-EG')}{' '}
                    ج.م
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

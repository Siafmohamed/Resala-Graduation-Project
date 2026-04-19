import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/formatters';
import { useUrgentCases } from '../hooks/useUrgentCases';
import { AddUrgentCaseModal } from './urgent-forms/AddUrgentCaseModal';
import { EditUrgentCaseModal } from './urgent-forms/EditUrgentCaseModal';
import { DeleteUrgentCaseModal } from './urgent-forms/DeleteUrgentCaseModal';
import { UrgencyLevelBadge } from './urgent-list/UrgencyLevelBadge';
import { UrgentCase } from '../types/urgent-case.types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function UrgentCasesPage() {
  const { data, isLoading, isError, refetch } = useUrgentCases();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<UrgentCase | null>(null);

  const handleEdit = (caseItem: UrgentCase) => {
    setSelectedCase(caseItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = (caseItem: UrgentCase) => {
    setSelectedCase(caseItem);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight font-[Cairo]">الحالات العاجلة</h1>
          <p className="text-sm text-muted-foreground font-[Cairo]">
            متابعة أولويات جمع التبرعات للحالات العاجلة ذات الأولوية المرتفعة.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 font-[Cairo] bg-gradient-to-r from-[#F04930] to-[#d93d26] shadow-[#F04930]/30 hover:shadow-[#F04930]/50 w-fit"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>حالة عاجلة جديدة</span>
        </button>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="py-6 text-center text-sm text-muted-foreground font-[Cairo]">
              جاري تحميل بيانات الحالات...
            </div>
          </CardContent>
        </Card>
      )}

      {isError && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700 font-[Cairo]">
              حدث خطأ أثناء تحميل بيانات الحالات.
            </div>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && data.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm text-muted-foreground font-[Cairo]">لا توجد حالات عاجلة حالياً</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((caseItem) => {
            const progressPercentage = caseItem.targetAmount
              ? Math.min((caseItem.collectedAmount / caseItem.targetAmount) * 100, 100)
              : 0;

            return (
              <Card
                key={caseItem.id}
                className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {caseItem.imageUrl ? (
                    <>
                      <img
                        src={caseItem.imageUrl}
                        alt={caseItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl mb-2">🏥</div>
                        <p className="text-xs text-gray-400 font-[Cairo]">لا توجد صورة</p>
                      </div>
                    </div>
                  )}

                  {/* Urgency Badge - Top Right */}
                  <div className="absolute top-3 right-3">
                    <UrgencyLevelBadge
                      level={caseItem.urgencyLevel}
                      size="md"
                      showIcon={true}
                    />
                  </div>

                  {/* Action Buttons - Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(caseItem)}
                      className="p-3 rounded-full bg-white text-[#00549A] hover:bg-blue-50 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                      title="تعديل"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(caseItem)}
                      className="p-3 rounded-full bg-white text-red-600 hover:bg-red-50 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                      title="حذف"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="text-base font-bold text-[#101727] font-[Cairo] mb-2 line-clamp-2">
                    {caseItem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#697282] font-[Cairo] line-clamp-2 mb-4 flex-1">
                    {caseItem.description}
                  </p>

                  {/* Status and Date Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-bold font-[Cairo] px-3.5 py-2 rounded-full whitespace-nowrap backdrop-blur-sm transition-all ${
                        caseItem.isActive
                          ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {caseItem.isActive ? '🟢 نشطة' : '⭕ غير نشطة'}
                    </span>
                    <span className="text-[10px] text-[#697282] font-[Cairo] whitespace-nowrap px-2 py-1 rounded-lg bg-gray-50">
                      📅 {new Date(caseItem.createdOn).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-[#697282] font-[Cairo]">التقدم:</span>
                      <span className="text-[11px] font-bold text-[#F04930] font-[Cairo] bg-red-50 px-2.5 py-1 rounded-lg">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#F04930] via-[#d93d26] to-[#c22818] transition-all duration-700 rounded-full shadow-lg shadow-[#F04930]/30"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center justify-between text-xs font-[Cairo]">
                      <span className="text-[#697282] flex items-center gap-1">✅ المبلغ المحصل:</span>
                      <span className="font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                        {formatNumber(caseItem.collectedAmount)} ج.م
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-[Cairo]">
                      <span className="text-[#697282] flex items-center gap-1">🎯 الهدف:</span>
                      <span className="font-bold text-[#101727] bg-white px-2 py-1 rounded-lg">
                        {formatNumber(caseItem.targetAmount)} ج.م
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-[Cairo]">
                      <span className="text-[#697282] flex items-center gap-1">⏳ المتبقي:</span>
                      <span className={`font-bold px-2 py-1 rounded-lg ${
                        Math.max(0, caseItem.targetAmount - caseItem.collectedAmount) === 0
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {formatNumber(Math.max(0, caseItem.targetAmount - caseItem.collectedAmount))} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Completion Badge */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {Math.round(progressPercentage) === 100 ? (
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 py-2 px-3 rounded-lg shadow-lg">
                        🎉 تم تحقيق الهدف
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#00549A] bg-blue-50 py-2 px-3 rounded-lg border border-blue-200">
                        📊 {Math.round(progressPercentage)}% من الهدف
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddUrgentCaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditUrgentCaseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCase(null);
        }}
        case={selectedCase}
        onSuccess={handleSuccess}
      />

      <DeleteUrgentCaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCase(null);
        }}
        case={selectedCase}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

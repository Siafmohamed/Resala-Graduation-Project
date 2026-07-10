import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';
import { useSuccessStories, useDeleteSuccessStory } from '../hooks/useSuccessStories';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { formatDate } from '@/shared/utils/formatters/dateFormatter';
import CreateSuccessStoryModal from './CreateSuccessStoryModal';

export function SuccessStoriesPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch } = useSuccessStories();
  const deleteStory = useDeleteSuccessStory();

  // ✅ data.data is the array directly — no .items
  const stories = data?.data || [];

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف قصة النجاح هذه؟')) {
      setDeletingId(id);
      deleteStory.mutate(id, {
        onSettled: () => {
          setDeletingId(null);
        }
      });
    }
  };

  if (isError && error) {
    return (
      <div className="p-8">
        <ErrorMessage error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8" dir="rtl">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl text-[#00549A]">
              <Sparkles size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#101727] font-[Cairo] tracking-tight">
                قصص النجاح
              </h1>
              <p className="text-[#697282] font-[Cairo] text-sm font-medium">
                إدارة قصص النجاح والإنجازات
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00549A] to-[#0081ED] text-white font-bold font-[Cairo] text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة قصة نجاح جديدة
        </button>
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-[0px_10px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-8 bg-[#00549A] rounded-full" />
              <h3 className="font-[Cairo] font-black text-[#101727] text-lg">
                قائمة قصص النجاح
              </h3>
              {/* ✅ stories is the array directly */}
              <div className="mr-3 px-3 py-1 bg-blue-50 text-[#00549A] rounded-lg text-xs font-bold font-[Cairo]">
                {stories.length} قصة
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-[#00549A] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#00549A]" />
                </div>
              </div>
              <p className="font-[Cairo] text-gray-400 font-bold animate-pulse">
                جاري تحميل البيانات...
              </p>
            </div>
          ) : stories.length === 0 ? (
            /* ✅ Check stories.length directly */
            <div className="py-32 flex flex-col items-center justify-center text-center px-6">
              <div className="w-24 h-24 rounded-[32px] bg-blue-50 flex items-center justify-center mb-6 text-blue-200">
                <Sparkles size={48} />
              </div>
              <h3 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">
                لا توجد قصص نجاح
              </h3>
              <p className="text-gray-400 font-[Cairo] max-w-sm mb-6">
                ابدأ بإضافة قصة نجاح جديدة لمشاركة الإنجازات مع المجتمع
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 rounded-xl border border-[#00549A]/20 text-[#00549A] font-bold font-[Cairo] text-xs hover:bg-[#00549A] hover:text-white hover:border-[#00549A] transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={14} />
                إضافة قصة النجاح الأولى
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[#697282] font-[Cairo] text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-5 text-right border-b border-gray-100">العنوان</th>
                    <th className="px-6 py-5 text-right border-b border-gray-100">الوصف</th>
                    <th className="px-6 py-5 text-center border-b border-gray-100">الصورة</th>
                    <th className="px-6 py-5 text-center border-b border-gray-100">تاريخ الإضافة</th>
                    <th className="px-8 py-5 text-left border-b border-gray-100">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* ✅ Iterate over stories directly */}
                  {stories.map((story) => (
                    <tr
                      key={story.id}
                      className="group hover:bg-blue-50/30 transition-all duration-300"
                    >
                      {/* Title */}
                      <td className="px-8 py-5">
                        <span className="font-bold text-[#101727] font-[Cairo] text-sm group-hover:text-[#00549A] transition-colors">
                          {story.title}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-[#697282] font-[Cairo] line-clamp-2">
                          {story.description}
                        </span>
                      </td>

                      {/* Image */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {story.imageUrl ? (
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                              <AlertCircle size={16} className="text-[#00549A]" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Creation Date */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#00549A] text-xs font-bold font-[Cairo]">
                            <Calendar size={14} className="opacity-70" />
                            {/* ✅ Use createdOn — the actual field name in the API */}
                            {formatDate(story.createdOn || '')}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5 text-left">
                        <button
                          onClick={() => handleDelete(story.id)}
                          disabled={deletingId === story.id}
                          className="px-4 py-2 rounded-lg border border-red-200 text-red-600 font-bold font-[Cairo] text-xs hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center gap-2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === story.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSuccessStoryModal
          onClose={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
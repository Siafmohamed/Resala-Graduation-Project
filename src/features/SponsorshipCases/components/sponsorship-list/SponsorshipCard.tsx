import { Card, CardContent } from "@/shared/components/ui/Card";
import { 
  Edit2, 
  Trash2, 
  Heart, 
  AlertCircle, 
  Image,
  CheckCircle2,
  Clock,
  Flame
} from "lucide-react";
import { URGENCY_LEVELS } from "@/api/services/sponsorshipService";

const urgencyConfig: Record<number, { label: string; icon: any; className: string }> = {
  [URGENCY_LEVELS.NORMAL]: { label: 'عادية', icon: AlertCircle, className: 'bg-gradient-to-r from-blue-500 to-blue-400 border-blue-400/50' },
  [URGENCY_LEVELS.URGENT]: { label: 'حرجة', icon: Clock, className: 'bg-gradient-to-r from-orange-500 to-orange-400 border-orange-400/50' },
  [URGENCY_LEVELS.CRITICAL]: { label: 'حرجة جدا', icon: Flame, className: 'bg-gradient-to-r from-[#F04930] to-red-500 border-red-400/50' },
};

interface SponsorshipCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function SponsorshipCard({ item, onEdit, onDelete }: SponsorshipCardProps) {

  return (
    <Card className="group border-none shadow-[0px_4px_25px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden hover:shadow-[0px_10px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 bg-white">
      {/* Image Section with Overlay */}
      <div className="relative h-56 overflow-hidden bg-gray-50">
        {item.imageUrl ? (
          <>
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
            <Image size={40} className="mb-3 opacity-30" />
            <span className="text-sm font-bold font-[Cairo]">لا توجد صورة</span>
          </div>
        )}
        
        {/* Top Status Badges - Glassmorphism style */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {/* Type Badge */}
          <span className={`px-4 py-2 rounded-2xl text-[11px] font-bold font-[Cairo] backdrop-blur-xl shadow-xl text-white transition-all transform group-hover:scale-105 border border-white/20 ${item.caseType === 'urgent' ? 'bg-red-500/80' : 'bg-[#00549A]/80'}`}>
            {item.caseType === 'urgent' ? '🚨 حالة عاجلة' : '❤️ كفالة عادية'}
          </span>
                      
          
          {item.caseType === 'urgent' && (() => {
            const config = urgencyConfig[item.urgencyLevel] ?? urgencyConfig[URGENCY_LEVELS.NORMAL];
            const Icon = config.icon;
            return (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-white backdrop-blur-xl shadow-xl border border-white/20 animate-pulse ${config.className.replace('bg-gradient-to-r', 'bg-opacity-80')}`}>
                <Icon size={14} className="fill-current" />
                <span className="text-[10px] font-bold font-[Cairo]">
                  {config.label}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Floating Edit/Delete buttons on hover over image */}
        <div className="absolute bottom-4 left-4 flex gap-2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button 
            onClick={() => onEdit(item)}
            className="p-3 bg-white/95 text-[#00549A] hover:bg-[#00549A] hover:text-white rounded-2xl shadow-xl transition-all transform active:scale-90"
            title="تعديل"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(item)}
            className="p-3 bg-white/95 text-[#F04930] hover:bg-[#F04930] hover:text-white rounded-2xl shadow-xl transition-all transform active:scale-90"
            title="حذف"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-7">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-5">
          {/* Icon Box */}
          <div className="flex-shrink-0">
            {item.caseType === 'urgent' ? (
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? "bg-red-50 text-red-600 border border-red-100" : item.urgencyLevel === URGENCY_LEVELS.URGENT ? "bg-orange-50 text-orange-500 border border-orange-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                <AlertCircle size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-[#00549A] border border-blue-100 shadow-sm">
                {item.icon ? (
                  <img src={item.icon} alt="icon" className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'; }} />
                ) : (
                  <Heart size={24} />
                )}
              </div>
            )}
          </div>
          
          {/* Title Box */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-1 text-base group-hover:text-[#00549A] transition-colors">
              {item.title || item.name || 'بدون عنوان'}
            </h3>
            <p className="text-[11px] text-[#697282] font-[Cairo] mt-0.5 flex items-center gap-1.5">
              <Clock size={12} className="opacity-60" />
              <span>أُضيفت {new Date(item.createdAt || Date.now()).toLocaleDateString('ar-EG')}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#697282] font-[Cairo] line-clamp-2 mb-6 leading-relaxed">
          {item.description || "لا يوجد وصف متوفر لهذه الحالة حالياً. يتم تحديث البيانات دورياً لضمان الدقة."}
        </p>

        {/* Financial Progress Section */}
        <div className="space-y-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100/50">
          {/* Amount Details */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col">
              <span className="text-[#697282] font-[Cairo] text-[10px] uppercase tracking-wider mb-1">المبلغ المحصل</span>
              <span className="font-bold text-[#101727] font-[Cairo] text-base">{(item.collectedAmount ?? 0).toLocaleString('ar-EG')} <span className="text-[10px] font-medium text-gray-500">ج.م</span></span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#697282] font-[Cairo] text-[10px] uppercase tracking-wider mb-1">المبلغ المستهدف</span>
              <span className={`font-bold font-[Cairo] text-base ${item.caseType === 'urgent' ? 'text-red-500' : 'text-[#00549A]'}`}>{(item.targetAmount ?? 0).toLocaleString('ar-EG')} <span className="text-[10px] font-medium text-gray-500">ج.م</span></span>
            </div>
          </div>

          {/* Elegant Progress Bar */}
          <div className="space-y-3">
            <div className="h-2.5 bg-gray-200/50 rounded-full overflow-hidden p-[2px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden
                  ${item.caseType === 'urgent' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-500' 
                    : 'bg-gradient-to-r from-[#00549A] to-blue-400'}`} 
                style={{ width: `${Math.min(((item.collectedAmount ?? 0) / (item.targetAmount || 1)) * 100, 100)}%` }} 
              >
                {/* Glossy shine effect on progress bar */}
                <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="flex justify-between items-center text-[11px] font-bold font-[Cairo]">
              <div className="flex items-center gap-1.5 text-[#00549A]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00549A] animate-pulse" />
                <span>{Math.min(((item.collectedAmount ?? 0) / (item.targetAmount || 1)) * 100, 100).toFixed(1)}% مكتمل</span>
              </div>
              {(item.targetAmount ?? 0) > (item.collectedAmount ?? 0) ? (
                <span className="text-gray-500">المتبقي: {((item.targetAmount ?? 0) - (item.collectedAmount ?? 0)).toLocaleString('ar-EG')} ج.م</span>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  تم اكتمال الهدف
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Completion Status Badge */}
        {((item.collectedAmount ?? 0) >= (item.targetAmount ?? 0)) && (
          <div className="mt-5 p-3.5 bg-green-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 border border-green-100 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="text-[12px] font-bold text-green-700 font-[Cairo]">تم تحقيق الهدف المالي بنجاح</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


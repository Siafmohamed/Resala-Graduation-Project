import { Card, CardContent } from "@/shared/components/ui/Card";
import { 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Image,
  CheckCircle2,
  Clock,
  Flame
} from "lucide-react";
import { URGENCY_LEVELS } from "@/api/services/sponsorshipService";
import type { EmergencyCase } from "../../types/emergencyCase.types";

const urgencyConfig: Record<number, { label: string; icon: any; className: string }> = {
  [URGENCY_LEVELS.NORMAL]: { label: 'عادية', icon: AlertCircle, className: 'bg-gradient-to-r from-blue-500 to-blue-400 border-blue-400/50' },
  [URGENCY_LEVELS.URGENT]: { label: 'حرجة', icon: Clock, className: 'bg-gradient-to-r from-orange-500 to-orange-400 border-orange-400/50' },
  [URGENCY_LEVELS.CRITICAL]: { label: 'حرجة جدا', icon: Flame, className: 'bg-gradient-to-r from-[#F04930] to-red-500 border-red-400/50' },
};

interface EmergencyCardProps {
  item: EmergencyCase;
  onEdit: (item: EmergencyCase) => void;
  onDelete: (item: EmergencyCase) => void;
}

export function EmergencyCard({ item, onEdit, onDelete }: EmergencyCardProps) {
  const targetAmount = item.targetAmount || item.requiredAmount || 0;
  const collectedAmount = item.collectedAmount || 0;
  const progress = Math.min((collectedAmount / (targetAmount || 1)) * 100, 100);

  return (
    <Card className="group border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#F04930]/30 transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <>
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <Image size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-[Cairo]">لا توجد صورة</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className="px-3 py-1.5 rounded-full text-[11px] font-bold font-[Cairo] backdrop-blur-md shadow-lg text-white transition-all transform group-hover:scale-105 bg-gradient-to-r from-[#F04930] to-[#e63d1f] border border-red-300/50">
            🚨 حالة عاجلة
          </span>
          
          {item.urgencyLevel !== undefined && (() => {
            const config = urgencyConfig[item.urgencyLevel];
            const Icon = config.icon;
            return (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white backdrop-blur-md shadow-lg border animate-pulse ${config.className}`}>
                <Icon size={14} className="fill-current" />
                <span className="text-[10px] font-bold font-[Cairo]">
                  {config.label}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`p-2 rounded-lg flex-shrink-0 ${item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? "bg-red-100 text-red-600" : item.urgencyLevel === URGENCY_LEVELS.URGENT ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-blue-600"}`}>
              <AlertCircle size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#101727] font-[Cairo] line-clamp-2 text-sm leading-snug">{item.title}</h3>
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <button 
              onClick={() => onEdit(item)}
              className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all transform hover:scale-110 active:scale-95"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(item)}
              className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all transform hover:scale-110 active:scale-95"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className="text-sm text-[#697282] font-[Cairo] line-clamp-2 mb-6 min-h-[2.5rem]">{item.description}</p>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[#697282] font-[Cairo] text-[11px]">المحصل</span>
              <span className="font-bold text-[#101727] font-[Cairo]">{collectedAmount.toLocaleString('ar-EG')} ج.م</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[#697282] font-[Cairo] text-[11px]">الهدف</span>
              <span className="font-bold font-[Cairo] text-[#F04930]">{targetAmount.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg
                  ${item.urgencyLevel === URGENCY_LEVELS.CRITICAL 
                    ? 'bg-gradient-to-r from-red-600 to-red-500' 
                    : item.urgencyLevel === URGENCY_LEVELS.URGENT
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'}`} 
                style={{ width: `${progress}%` }} 
              />
            </div>
            
            <div className="flex justify-between items-center text-xs text-[#697282] font-[Cairo]">
              <span>{progress.toFixed(1)}% مكتمل</span>
              {targetAmount > collectedAmount && (
                <span>المتبقي: {(targetAmount - collectedAmount).toLocaleString('ar-EG')} ج.م</span>
              )}
            </div>
          </div>
        </div>

        {collectedAmount >= targetAmount && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 border border-green-100">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-xs font-bold text-green-700 font-[Cairo]">تم تحقيق الهدف المالي</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

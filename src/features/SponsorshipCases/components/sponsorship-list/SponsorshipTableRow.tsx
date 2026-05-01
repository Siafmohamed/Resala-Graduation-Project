import { 
  Edit2, 
  Trash2, 
} from "lucide-react";
import { URGENCY_LEVELS } from "@/api/services/sponsorshipService";

interface SponsorshipTableRowProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function SponsorshipTableRow({ item, onEdit, onDelete }: SponsorshipTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/80 transition-all duration-300 group border-b border-gray-50 last:border-0">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 shadow-sm group-hover:scale-105 transition-transform duration-300">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold bg-gray-50">
                🖼️
              </div>
            )}
            {item.caseType === 'regular' && item.icon && (
              <div className="absolute bottom-0 right-0 bg-white/95 p-1 rounded-tl-xl shadow-sm border-t border-l border-gray-100 backdrop-blur-sm">
                <img src={item.icon} alt="icon" className="w-4 h-4 object-contain" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[#101727] font-[Cairo] text-sm group-hover:text-[#00549A] transition-colors">{item.title || item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#697282] font-[Cairo] bg-gray-100 px-2 py-0.5 rounded-lg">ID: #{item.id}</span>
              {item.caseType === 'regular' && item.icon && (
                <span className="text-[10px] text-[#00549A] font-[Cairo] font-bold">أيقونة نشطة</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold font-[Cairo] shadow-sm border ${item.caseType === 'urgent' ? 'bg-red-50 text-[#F04930] border-red-100' : 'bg-blue-50 text-[#00549A] border-blue-100'}`}>
            {item.caseType === 'urgent' ? 'حالة حرجة' : 'كفالة عادية'}
          </span>
          {item.caseType === 'urgent' && item.urgencyLevel !== undefined && (
            <span className={`text-[10px] font-black font-[Cairo] tracking-wide ${item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? 'text-red-600' : item.urgencyLevel === URGENCY_LEVELS.URGENT ? 'text-orange-500' : 'text-blue-600'}`}>
              {item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? '● حرجة جداً' : item.urgencyLevel === URGENCY_LEVELS.URGENT ? '● حرجة' : '● عادية'}
            </span>
          )}
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${item.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} />
          <span className={`text-[11px] font-bold font-[Cairo] ${item.isActive ? "text-green-700" : "text-gray-400"}`}>
            {item.isActive ? "نشط حالياً" : "غير نشط"}
          </span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-[Cairo] mb-0.5 uppercase tracking-wider">المستهدف</span>
          <span className="font-bold text-[#101727] font-[Cairo] text-sm tracking-tight">{(item.targetAmount ?? 0).toLocaleString('ar-EG')} <span className="text-[10px] text-gray-400">ج.م</span></span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-[Cairo] mb-0.5 uppercase tracking-wider">المحصل</span>
          <span className="font-bold text-[#00549A] font-[Cairo] text-sm tracking-tight">{(item.collectedAmount ?? 0).toLocaleString('ar-EG')} <span className="text-[10px] text-gray-400">ج.م</span></span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-[Cairo] mb-0.5 uppercase tracking-wider">التاريخ</span>
          <span className="text-[#697282] font-[Cairo] text-sm font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : '—'}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => onEdit(item)} 
            className="p-3 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-[14px] transition-all transform active:scale-90"
            title="تعديل"
          >
            <Edit2 size={20} />
          </button>
          <button 
            onClick={() => onDelete(item)} 
            className="p-3 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-[14px] transition-all transform active:scale-90"
            title="حذف"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

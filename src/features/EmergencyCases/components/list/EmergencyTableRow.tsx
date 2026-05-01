import { 
  Edit2, 
  Trash2, 
} from "lucide-react";
import { URGENCY_LEVELS } from "@/api/services/sponsorshipService";
import type { EmergencyCase } from "../../types/emergencyCase.types";

interface EmergencyTableRowProps {
  item: EmergencyCase;
  onEdit: (item: EmergencyCase) => void;
  onDelete: (item: EmergencyCase) => void;
}

export function EmergencyTableRow({ item, onEdit, onDelete }: EmergencyTableRowProps) {
  const targetAmount = item.targetAmount || item.requiredAmount || 0;
  const collectedAmount = item.collectedAmount || 0;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-100">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-semibold">
                IMG
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[#101727] font-[Cairo] text-sm">{item.title}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold font-[Cairo] bg-red-50 text-[#F04930]">
            حالة حرجة
          </span>
          {item.urgencyLevel !== undefined && (
            <span className={`text-[9px] font-bold font-[Cairo] ${item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? 'text-red-600' : item.urgencyLevel === URGENCY_LEVELS.URGENT ? 'text-orange-500' : 'text-blue-600'}`}>
              ({item.urgencyLevel === URGENCY_LEVELS.CRITICAL ? 'حرجة جدا' : item.urgencyLevel === URGENCY_LEVELS.URGENT ? 'حرجة' : 'عادية'})
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-[#101727] font-[Cairo] text-sm">{targetAmount.toLocaleString()} ج.م</td>
      <td className="px-6 py-4 font-bold text-[#00549A] font-[Cairo] text-sm">{collectedAmount.toLocaleString()} ج.م</td>
      <td className="px-6 py-4 text-[#697282] font-[Cairo] text-sm">{item.createdOn ? new Date(item.createdOn).toLocaleDateString('ar-EG') : '—'}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onEdit(item)} className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-[#e6eff7] rounded-lg transition-all"><Edit2 size={18} /></button>
          <button onClick={() => onDelete(item)} className="p-2 text-[#697282] hover:text-[#F04930] hover:bg-[#fdeceb] rounded-lg transition-all"><Trash2 size={18} /></button>
        </div>
      </td>
    </tr>
  );
}

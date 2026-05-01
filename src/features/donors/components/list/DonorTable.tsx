import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Edit2, 
  MoreVertical,
  Calendar,
  UserCheck,
  UserMinus,
  CheckCircle2
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Donor } from '../../types/donors.types';

interface DonorTableProps {
  donors: Donor[];
  onEdit: (donor: Donor) => void;
}

export const DonorTable: React.FC<DonorTableProps> = ({ donors, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-separate border-spacing-y-2">
        <thead>
          <tr className="text-[#94a3b8] text-xs font-bold font-[Cairo] uppercase tracking-wider">
            <th className="px-6 py-4">المتبرع</th>
            <th className="px-6 py-4">تاريخ التسجيل</th>
            <th className="px-6 py-4">إجمالي التبرعات</th>
            <th className="px-6 py-4">الحالة</th>
            <th className="px-6 py-4 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {donors.map((donor) => (
            <tr 
              key={donor.id} 
              className="group hover:bg-gray-50/50 transition-all cursor-pointer shadow-sm rounded-2xl"
              onClick={() => navigate(`/donors/${donor.id}`)}
            >
              <td className="px-6 py-4 rounded-r-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#00549A] flex items-center justify-center font-bold font-[Cairo] group-hover:bg-[#00549A] group-hover:text-white transition-colors">
                    {donor.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#101727] font-[Cairo] text-sm group-hover:text-[#00549A] transition-colors">{donor.fullName}</span>
                    <span className="text-xs text-[#697282] font-[Cairo] font-mono">{donor.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-[#495565] font-[Cairo]">
                  <Calendar size={14} className="text-gray-400" />
                  {donor.registrationDate && isValid(new Date(donor.registrationDate))
                    ? format(new Date(donor.registrationDate), 'dd MMMM yyyy', { locale: ar })
                    : '—'}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-[#101727] font-[Cairo] text-sm">
                  {donor.totalDonations.toLocaleString()} ج.م
                </span>
              </td>
              <td className="px-6 py-4">
                {donor.isRegular ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold font-[Cairo] border border-green-100">
                    <UserCheck size={12} />
                    متبرع منتظم
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold font-[Cairo] border border-gray-100">
                    <UserMinus size={12} />
                    مرة واحدة
                  </span>
                )}
              </td>
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/donors/${donor.id}`); }}
                    className="p-2 text-[#697282] hover:text-[#00549A] hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(donor); }}
                    className="p-2 text-[#697282] hover:text-[#22c55e] hover:bg-green-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

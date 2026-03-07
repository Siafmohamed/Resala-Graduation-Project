import { useNavigate } from 'react-router-dom';
import type { Donor } from '../types/donor.types';
import {
  getSponsorshipTypeLabel,
  getDurationLabel,
} from '../utils/donorHelpers';
import { DonorStatusBadge } from './DonorStatusBadge';

interface DonorsTableProps {
  donors: Donor[];
  isLoading?: boolean;
}

export function DonorsTable({ donors, isLoading }: DonorsTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground" dir="rtl">
        لا يوجد متبرعون
      </div>
    );
  }

  return (
<div className="overflow-x-auto rounded-lg border border-[#E0E7EE]">
        <table className="w-full text-sm" dir="rtl">
     <thead>
  <tr className="bg-[#ECF2F8] h-14">
    <th className="px-4 text-center font-medium">اسم المتبرع</th>
    <th className="px-4 text-center font-medium">نوع الكفالة</th>
    <th className="px-4 text-center font-medium">مدة الكفالة</th>
    <th className="px-4 text-center font-medium">حالة الدفع</th>
    <th className="px-4 text-center font-medium">تاريخ الاستفادة</th>
    <th className="px-4 text-center font-medium">الإجراء</th>
  </tr>
</thead>
        <tbody>
          {donors.map((donor) => (
            <tr
              key={donor.id}
              className="border-b last:border-b-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3">{donor.name}</td>
              <td className="px-4 py-3">
                {getSponsorshipTypeLabel(donor.sponsorshipType)}
              </td>
              <td className="px-4 py-3 text-[#00549A]">
  {getDurationLabel(donor.sponsorshipDuration)}
</td>
              <td className="px-4 py-3">
                <DonorStatusBadge status={donor.paymentStatus} />
              </td>
              <td className="px-4 py-3">{donor.formDate}</td>
              <td className="px-4 py-3">
           <button
  type="button"
  onClick={() => navigate(`/donors/${donor.id}`)}
  className="
    flex
    w-[248px]
    px-[17px] py-[8px]
    justify-center
    items-center
    gap-[10px]
    rounded-[10px]
    border
    border-[#E0E7EE]
  "
>
  <span
    className="
      text-[#00549A]
      text-center
      text-[16px]
      font-medium
      leading-[24px]
      font-['Tajawal']
    "
  >
    عرض التفاصيل
  </span>
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

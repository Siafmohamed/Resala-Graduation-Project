import { 
  useSponsorship,
} from "../../hooks/useSponsorships";
import {
  useEmergencyCase,
} from "@/features/EmergencyCases/hooks/useEmergencyCases";
import { CaseFormModal } from "./CaseFormModal";

interface EditModalWrapperProps {
  id: number;
  urgent: boolean;
  onClose: () => void;
  onSave: (id: number, payload: any) => void;
  isSubmitting: boolean;
}

export function EditModalWrapper({
  id,
  urgent,
  onClose,
  onSave,
  isSubmitting
}: EditModalWrapperProps) {

  // 👇 استدعاء ثابت بدون شروط
  const sponsorshipQuery = useSponsorship(id);
  const emergencyQuery = useEmergencyCase(id);

  // 👇 اختيار الداتا حسب النوع
  const initialData = urgent
    ? emergencyQuery.data
    : sponsorshipQuery.data;

  const isLoadingData = urgent
    ? emergencyQuery.isLoading
    : sponsorshipQuery.isLoading;

  // 👇 منع فتح الفورم قبل وصول الداتا
  if (isLoadingData || !initialData) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00549A] rounded-full animate-spin" />
          <p className="font-[Cairo] text-[#697282]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <CaseFormModal
      urgent={urgent}
      mode="edit"
      initialData={initialData}
      isLoadingData={isLoadingData}
      onClose={onClose}
      onSave={(payload) => onSave(id, payload)}
      isSubmitting={isSubmitting}
    />
  );
}

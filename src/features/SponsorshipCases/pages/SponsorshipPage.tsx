import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Heart,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useSponsorshipManagementLogic } from "../hooks/useSponsorshipManagementLogic";
import { SponsorshipCard } from "../components/sponsorship-list/SponsorshipCard";
import { SponsorshipTableRow } from "../components/sponsorship-list/SponsorshipTableRow";
import { SponsorshipFormModal } from "../components/modals/SponsorshipFormModal";
import { Card } from "@/shared/components/ui/Card";

export default function SponsorshipPage() {
  const {
    search, setSearch,
    viewMode, setViewMode,
    modal, setModal,
    selectedSponsorship, setSelectedSponsorship,
    isLoading, isError,
    filteredSponsorships,
    handleCreate, handleUpdate, handleDelete,
    isSubmitting
  } = useSponsorshipManagementLogic();

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة برامج الكفالة</h1>
          <p className="font-[Cairo] text-[#697282] text-sm">متابعة وتعديل برامج الكفالة المستمرة</p>
        </div>
        <button 
          onClick={() => setModal("add")}
          className="flex items-center gap-2 px-6 py-3 bg-[#00549A] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all font-[Cairo]"
        >
          <Plus size={20} />
          إضافة برنامج كفالة
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
          <input
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500/10 font-[Cairo]"
            placeholder="ابحث في الكفالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-white border border-gray-100 rounded-xl p-1">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-50 text-[#00549A]" : "text-gray-400"}`}><LayoutGrid size={20} /></button>
          <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg ${viewMode === "table" ? "bg-blue-50 text-[#00549A]" : "text-gray-400"}`}><List size={20} /></button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#00549A] animate-spin" />
          <p className="font-[Cairo] text-gray-500">جاري التحميل...</p>
        </div>
      ) : isError ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-red-100">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="font-bold font-[Cairo]">خطأ في تحميل البيانات</h3>
        </div>
      ) : filteredSponsorships.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
          <Search size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="font-[Cairo] text-gray-500">لا توجد نتائج تطابق بحثك</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsorships.map(item => (
            <SponsorshipCard 
              key={item.id} 
              item={{ ...item, caseType: 'regular', title: item.name }} 
              onEdit={(s) => { setSelectedSponsorship(s); setModal("edit"); }}
              onDelete={(s) => { if(confirm('هل أنت متأكد من حذف هذا البرنامج؟')) handleDelete(s.id); }}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm">البرنامج</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">النوع</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">الحالة</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">المستهدف</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">المحصل</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSponsorships.map(item => (
                <SponsorshipTableRow 
                  key={item.id} 
                  item={{ ...item, caseType: 'regular', title: item.name }}
                  onEdit={(s) => { setSelectedSponsorship(s); setModal("edit"); }}
                  onDelete={(s) => { if(confirm('هل أنت متأكد من حذف هذا البرنامج؟')) handleDelete(s.id); }}
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modal && (modal === "add" || modal === "edit") && (
        <SponsorshipFormModal
          mode={modal}
          initialData={selectedSponsorship || undefined}
          onClose={() => { setModal(null); setSelectedSponsorship(null); }}
          onSave={modal === "add" ? handleCreate : (data) => handleUpdate(selectedSponsorship!.id, data)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

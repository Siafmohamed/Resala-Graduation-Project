import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useEmergencyManagementLogic } from "../hooks/useEmergencyManagementLogic";
import { EmergencyCard } from "../components/list/EmergencyCard";
import { EmergencyTableRow } from "../components/list/EmergencyTableRow";
import { EmergencyFormModal } from "../components/modals/EmergencyFormModal";
import { Card } from "@/shared/components/ui/Card";

export default function EmergencyCasesPage() {
  const {
    search, setSearch,
    viewMode, setViewMode,
    modal, setModal,
    selectedCase, setSelectedCase,
    isLoading, isError,
    filteredCases,
    handleCreate, handleUpdate, handleDelete,
    isSubmitting
  } = useEmergencyManagementLogic();

  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Cairo] font-bold text-2xl text-[#101727]">إدارة الحالات العاجلة</h1>
          <p className="font-[Cairo] text-[#697282] text-sm">متابعة الحالات التي تحتاج تدخل فوري</p>
        </div>
        <button 
          onClick={() => setModal("add")}
          className="flex items-center gap-2 px-6 py-3 bg-[#F04930] text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:opacity-90 transition-all font-[Cairo]"
        >
          <Plus size={20} />
          إضافة حالة عاجلة
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697282]" size={18} />
          <input
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-red-500/10 font-[Cairo]"
            placeholder="ابحث في الحالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-white border border-gray-100 rounded-xl p-1">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-red-50 text-[#F04930]" : "text-gray-400"}`}><LayoutGrid size={20} /></button>
          <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg ${viewMode === "table" ? "bg-red-50 text-[#F04930]" : "text-gray-400"}`}><List size={20} /></button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#F04930] animate-spin" />
          <p className="font-[Cairo] text-gray-500">جاري التحميل...</p>
        </div>
      ) : isError ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-red-100">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="font-bold font-[Cairo]">خطأ في تحميل البيانات</h3>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
          <Search size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="font-[Cairo] text-gray-500">لا توجد نتائج تطابق بحثك</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(item => (
            <EmergencyCard 
              key={item.id} 
              item={item} 
              onEdit={(c) => { setSelectedCase(c); setModal("edit"); }}
              onDelete={(c) => { if(confirm('هل أنت متأكد من حذف هذه الحالة؟')) handleDelete(c.id); }}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm">الحالة</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">الأولوية</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">المطلوب</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">المحصل</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">التاريخ</th>
                <th className="px-6 py-4 font-bold font-[Cairo] text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCases.map(item => (
                <EmergencyTableRow 
                  key={item.id} 
                  item={item}
                  onEdit={(c) => { setSelectedCase(c); setModal("edit"); }}
                  onDelete={(c) => { if(confirm('هل أنت متأكد من حذف هذه الحالة؟')) handleDelete(c.id); }}
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modal && (modal === "add" || modal === "edit") && (
        <EmergencyFormModal
          mode={modal}
          initialData={selectedCase || undefined}
          onClose={() => { setModal(null); setSelectedCase(null); }}
          onSave={modal === "add" ? handleCreate : (data) => handleUpdate(selectedCase!.id, data)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

import { Card, CardContent } from "@/shared/components/ui/Card";
import { 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  ChevronDown,
  LayoutGrid,
  List,
  Heart, 
  Image,
} from "lucide-react";

// Modals
import { ChooseTypeModal } from "./sponsorship-forms/ChooseTypeModal";
import { SponsorshipFormModal } from "./modals/SponsorshipFormModal";
import { EmergencyFormModal } from "@/features/EmergencyCases/components/modals/EmergencyFormModal";
import { DeleteConfirmModal } from "./sponsorship-forms/DeleteConfirmModal";

// List items
import { SponsorshipCard } from "./sponsorship-list/SponsorshipCard";
import { SponsorshipTableRow } from "./sponsorship-list/SponsorshipTableRow";

// Logic hook
import { useCaseManagementLogic } from "../hooks/useCaseManagementLogic";

/* ─── MAIN COMPONENT ─── */
export default function SponsorshipsAPIManagement() {
  const {
    search,
    setSearch,
    filter,
    setFilter,
    viewMode,
    setViewMode,
    modal,
    setModal,
    selectedProgram,
    setSelectedProgram,
    isLoading,
    isError,
    filtered,
    combinedData,
    sponsorships,
    emergencyCases,
    handleCreateSponsorship,
    handleUpdateSponsorship,
    handleDeleteSponsorship,
    handleCreateEmergency,
    handleUpdateEmergency,
    handleDeleteEmergency,
    createSponsorshipMutation,
    updateSponsorshipMutation,
    deleteSponsorshipMutation,
    createEmergencyMutation,
    updateEmergencyMutation,
    deleteEmergencyMutation
  } = useCaseManagementLogic();

  const stats = [
    { label: 'إجمالي الحالات', value: combinedData.length, icon: LayoutGrid, color: '#00549A', bg: '#e6eff7' },
    { label: 'كفالات عادية', value: sponsorships.length, icon: Heart, color: '#22c55e', bg: '#e9f9ef' },
    { label: 'حالات حرجة', value: emergencyCases.length, icon: AlertCircle, color: '#F04930', bg: '#fdeceb' },
  ];

  return (
    <div className="flex flex-col gap-8 p-10 bg-[#fbfcfd] min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-[Cairo] font-black text-3xl text-[#101727] tracking-tight">إدارة الكفالات والحالات</h1>
          <div className="flex items-center gap-2 text-[#697282]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="font-[Cairo] font-medium text-sm">متابعة وتعديل برامج الكفالات العادية والحالات الحرجة في الوقت الفعلي</p>
          </div>
        </div>
        <button 
          onClick={() => setModal("choose-type")}
          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00549A] to-[#0070c0] text-white rounded-[20px] font-bold shadow-xl shadow-[#00549A]/20 hover:shadow-2xl hover:shadow-[#00549A]/30 transition-all transform hover:-translate-y-1 active:scale-95 font-[Cairo] text-sm"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span>إضافة كفالة جديدة</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0px_4px_30px_rgba(0,0,0,0.04)] rounded-[24px] bg-white group hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: stat.color }} />
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#697282] font-[Cairo] mb-1">{stat.label}</span>
                <span className="text-2xl font-black text-[#101727] font-[Cairo] tracking-tight">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-6 rounded-[28px] shadow-[0px_8px_40px_rgba(0,0,0,0.02)] border border-gray-50/50">
        <div className="relative flex-1 w-full group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#697282] group-focus-within:text-[#00549A] transition-all duration-300" size={20} />
          <input
            className="w-full pr-14 pl-6 py-4 rounded-2xl bg-gray-50/30 border border-gray-100 focus:bg-white focus:ring-[10px] focus:ring-[#00549A]/5 focus:border-[#00549A] transition-all duration-300 font-[Cairo] text-sm outline-none placeholder:text-gray-400 font-medium"
            placeholder="ابحث باسم الكفالة أو الحالة أو الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-60">
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#697282] z-10">
              <Filter size={18} />
            </div>
            <select 
              className="w-full pr-14 pl-12 py-4 rounded-2xl bg-gray-50/30 border border-gray-100 focus:bg-white focus:ring-[10px] focus:ring-[#00549A]/5 focus:border-[#00549A] appearance-none cursor-pointer font-[Cairo] text-sm outline-none font-bold text-[#101727] transition-all duration-300"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="جميع الحالات">جميع الحالات</option>
              <option value="كفالات">كفالات</option>
              <option value="حالات حرجة">حالات حرجة</option>
            </select>
            <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-[#697282] pointer-events-none transition-transform group-focus-within:rotate-180" size={16} />
          </div>
          
          <div className="flex bg-gray-100/40 p-1.5 rounded-2xl border border-gray-100/50">
            <button 
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-[Cairo] text-xs font-bold ${viewMode === "grid" ? "bg-white text-[#00549A] shadow-[0px_4px_12px_rgba(0,0,0,0.05)]" : "text-[#697282] hover:bg-white/50"}`}
            >
              <LayoutGrid size={18} />
              <span>شبكة</span>
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-[Cairo] text-xs font-bold ${viewMode === "table" ? "bg-white text-[#00549A] shadow-[0px_4px_12px_rgba(0,0,0,0.05)]" : "text-[#697282] hover:bg-white/50"}`}
            >
              <List size={18} />
              <span>قائمة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[32px] shadow-sm border border-gray-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-[#00549A] border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-[Cairo] text-[#101727] font-bold text-lg tracking-wide">جاري تحميل البيانات</p>
            <p className="font-[Cairo] text-[#697282] text-sm">نحن نجهز لك أحدث المعلومات من قاعدة البيانات</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm">
          <AlertCircle size={48} className="text-[#F04930] mb-4" />
          <h3 className="font-bold text-[#101727] font-[Cairo]">حدث خطأ أثناء التحميل</h3>
          <p className="text-[#697282] font-[Cairo]">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm">
          <Search size={48} className="text-[#697282] mb-4 opacity-20" />
          <h3 className="font-bold text-[#101727] font-[Cairo]">لا توجد نتائج</h3>
          <p className="text-[#697282] font-[Cairo]">جرب تغيير كلمات البحث أو الفلاتر</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <SponsorshipCard 
              key={`${item.caseType}-${item.id}`} 
              item={item} 
              onEdit={(item) => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "edit-regular" : "edit-urgent"); }}
              onDelete={(item) => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "delete-regular" : "delete-urgent"); }}
            />
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة / البرنامج</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">النوع</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">الحالة</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المستهدف</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">المحصل</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm">تاريخ البدء</th>
                  <th className="px-6 py-4 font-bold text-[#495565] font-[Cairo] text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filtered.map((item) => (
                  <SponsorshipTableRow 
                    key={`${item.caseType}-${item.id}`} 
                    item={item}
                    onEdit={(item) => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "edit-regular" : "edit-urgent"); }}
                    onDelete={(item) => { setSelectedProgram(item); setModal(item.caseType === 'regular' ? "delete-regular" : "delete-urgent"); }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      {modal === "choose-type" && <ChooseTypeModal onClose={() => setModal(null)} onChoose={(type) => setModal(type === "regular" ? "add-regular" : "add-urgent")} />}
      
      {modal === "add-regular" && (
        <SponsorshipFormModal 
          mode="add"
          onClose={() => setModal(null)} 
          onSave={handleCreateSponsorship} 
          isSubmitting={createSponsorshipMutation.isPending} 
        />
      )}

      {modal === "add-urgent" && (
        <EmergencyFormModal 
          mode="add"
          onClose={() => setModal(null)} 
          onSave={handleCreateEmergency} 
          isSubmitting={createEmergencyMutation.isPending} 
        />
      )}

      {modal === "edit-regular" && selectedProgram && (
        <SponsorshipFormModal 
          mode="edit"
          initialData={selectedProgram}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onSave={(data) => handleUpdateSponsorship(selectedProgram.id, data)} 
          isSubmitting={updateSponsorshipMutation.isPending} 
        />
      )}

      {modal === "edit-urgent" && selectedProgram && (
        <EmergencyFormModal 
          mode="edit"
          initialData={selectedProgram}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onSave={(data) => handleUpdateEmergency(selectedProgram.id, data)} 
          isSubmitting={updateEmergencyMutation.isPending} 
        />
      )}

      {modal === "delete-regular" && selectedProgram && (
        <DeleteConfirmModal 
          data={selectedProgram} 
          urgent={false}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onConfirm={() => handleDeleteSponsorship(selectedProgram.id)} 
          isDeleting={deleteSponsorshipMutation.isPending} 
        />
      )}

      {modal === "delete-urgent" && selectedProgram && (
        <DeleteConfirmModal 
          data={selectedProgram} 
          urgent={true}
          onClose={() => { setModal(null); setSelectedProgram(null); }} 
          onConfirm={() => handleDeleteEmergency(selectedProgram.id)} 
          isDeleting={deleteEmergencyMutation.isPending} 
        />
      )}
    </div>
  );
}

import { useState, useRef, useCallback } from "react";
import type { Sponsorship } from "../types/sponsorship.types";

type ModalStep = null | "choose-type" | "add-regular" | "add-urgent" | "edit";

const initialSponsorships: Sponsorship[] = [
  { id: 1, title: "كفالة أسرة", description: "دعم شهري لأسرة محتاجة تشمل المواد الغذائية والاحتياجات الأساسية", value: 500, duration: "شهري", total: 320, active: true },
  { id: 2, title: "كفالة طالب علم", description: "مساعدة طالب على استكمال تعليمه من خلال تغطية الرسوم والمستلزمات الدراسية", value: 300, duration: "شهري", total: 280, active: true },
  { id: 3, title: "كفالة يتيم", description: "رعاية شاملة لليتيم تشمل التعليم والرعاية الصحية والاحتياجات الأساسية", value: 400, duration: "شهري", total: 180, active: true },
  { id: 4, title: "كفالة مريض", description: "دعم المرضى غير القادرين على تكاليف العلاج والأدوية", value: 600, duration: "حسب الحالة", total: 76, active: true },
  { id: 5, title: "كفالة موسمية - رمضان", description: "كفالة خاصة بشهر رمضان توفر احتياجات الشهر الكريم للأسر المحتاجة", value: 800, duration: "سنوي", total: 0, active: false, seasonal: "رمضان" },
];

/* ─── CHOOSE TYPE MODAL ─── */
function ChooseTypeModal({ onClose, onChoose }: { onClose: () => void; onChoose: (t: "regular" | "urgent") => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-narrow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={15} height={15}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h2 className="modal-title">اختر نوع الكفالة</h2>
        </div>
        <div className="modal-body">
          {/* Regular */}
          <div className="type-card" onClick={() => onChoose("regular")}>
            <div className="type-row">
              <div className="type-icon type-icon-regular">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div className="type-info">
                <div className="type-title">كفالة عادية</div>
                <div className="type-desc">كفالة مستمرة لفترة زمنية (مثل كفالة يتيم أو أسرة)</div>
              </div>
            </div>
            <button className="type-btn type-btn-regular" onClick={(e) => { e.stopPropagation(); onChoose("regular"); }}>إضافة كفالة عادية</button>
          </div>
          {/* Urgent */}
          <div className="type-card" onClick={() => onChoose("urgent")}>
            <div className="type-row">
              <div className="type-icon type-icon-urgent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="type-info">
                <div className="type-title type-title-urgent">كفالة حرجة</div>
                <div className="type-desc">حالة طارئة بدون مدة ثابتة (عمليات – إغاثات – حالات عاجلة)</div>
              </div>
            </div>
            <button className="type-btn type-btn-urgent" onClick={(e) => { e.stopPropagation(); onChoose("urgent"); }}>إضافة كفالة حرجة</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD MODAL ─── */
function AddModal({ urgent, onClose, onSave }: { urgent: boolean; onClose: () => void; onSave: (d: { title: string; description: string }) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File, setter: (s: string) => void) => {
    const r = new FileReader();
    r.onload = (e) => setter(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) readFile(f, setImagePreview);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={15} height={15}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h2 className="modal-title">{urgent ? "إضافة كفالة حرجة جديدة" : "إضافة كفالة جديدة"}</h2>
        </div>

        <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
          <div className="form-group">
            <label className="form-label">اسم الكفالة</label>
            <input className="form-input" placeholder="مثال: كفالة أسرة" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">الوصف</label>
            <textarea className="form-textarea" placeholder="وصف مختصر للكفالة..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          {/* Image */}
          <div className="form-group">
            <label className="form-label">صورة الكفالة</label>
            <p className="form-hint">هذه الصورة ستظهر داخل التطبيق في صفحة الكفالات</p>
            <div
              className={`drop-zone${dragging ? " drop-zone-active" : ""}${imagePreview ? " drop-zone-filled" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => imgRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="drop-preview" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={36} height={36} style={{ color: "var(--text-light)" }}>
                    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="drop-text">اسحب الصورة هنا أو اضغط للاختيار</p>
                  <p className="drop-hint">JPG, PNG (Min 600×600px)</p>
                </>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setImagePreview); }} />
          </div>

          {/* Icon */}
          <div className="form-group">
            <label className="form-label">أيقونة الكفالة <span className="form-label-optional">(اختياري)</span></label>
            <p className="form-hint">الأيقونة ستُستخدم بجانب اسم الكفالة في التطبيق</p>
            <div className="icon-upload-row">
              <div className="icon-specs">
                <span>SVG, PNG</span>
                <span>64×64px or 128×128px</span>
                <span>شفافية مدعومة</span>
              </div>
              <div className="icon-upload-btn" onClick={() => iconRef.current?.click()}>
                {iconPreview ? (
                  <img src={iconPreview} alt="icon" style={{ width: 30, height: 30, objectFit: "contain" }} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22} style={{ color: "var(--primary)" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                )}
              </div>
              <input ref={iconRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setIconPreview); }} />
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ flexShrink: 0 }}>
          <button className="btn-cancel" onClick={onClose}>إلغاء</button>
          <button className={`btn-primary${urgent ? " btn-urgent" : ""}`} onClick={() => { if (title.trim()) { onSave({ title, description }); onClose(); } }}>
            {urgent ? "إضافة كفالة حرجة" : "إضافة الكفالة"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT MODAL ─── */
function EditModal({ sponsorship, onClose, onSave }: { sponsorship: Sponsorship; onClose: () => void; onSave: (id: number, d: { title: string; description: string }) => void }) {
  const [title, setTitle] = useState(sponsorship.title);
  const [description, setDescription] = useState(sponsorship.description);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={15} height={15}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h2 className="modal-title">تعديل الكفالة</h2>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">اسم الكفالة</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">الوصف</label>
            <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" onClick={() => { onSave(sponsorship.id, { title, description }); onClose(); }}>حفظ التعديلات</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function SponsorshipManagement() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(initialSponsorships);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("جميع الكفالات");
  const [modal, setModal] = useState<ModalStep>(null);
  const [editTarget, setEditTarget] = useState<Sponsorship | null>(null);

  const toggleActive = (id: number) => setSponsorships((p) => p.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  
  const handleAdd = (data: { title: string; description: string }) => {
    const newSponsorship: Sponsorship = {
      id: Math.max(...sponsorships.map(s => s.id), 0) + 1,
      title: data.title,
      description: data.description,
      value: 0,
      duration: "شهري",
      total: 0,
      active: true,
      urgent: modal === "add-urgent",
    };
    setSponsorships([...sponsorships, newSponsorship]);
  };

  const handleEdit = (id: number, data: { title: string; description: string }) => {
    setSponsorships((p) => p.map((s) => s.id === id ? { ...s, ...data } : s));
  };

  const filtered = sponsorships.filter((s) => {
    const matchSearch = s.title.includes(search) || s.description.includes(search);
    const matchFilter =
      filter === "جميع الكفالات" ||
      (filter === "نشطة" && s.active) ||
      (filter === "غير نشطة" && !s.active);
    return matchSearch && matchFilter;
  });

  return (
    <div className="sponsorship-management" dir="rtl">
      {/* CSS Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #1B6B4A;
          --primary-light: #2a8a60;
          --primary-pale: #e8f5ee;
          --accent: #e8a020;
          --accent-light: #fef3dc;
          --danger: #e53e3e;
          --urgent: #dc2626;
          --bg: #f4f6f4;
          --surface: #ffffff;
          --sidebar-bg: #0f3d2a;
          --sidebar-hover: #1a5438;
          --sidebar-active: #1B6B4A;
          --text-main: #1a2e23;
          --text-muted: #6b7c72;
          --text-light: #9aada3;
          --border: #e0e9e3;
          --toggle-on: #1B6B4A;
          --toggle-off: #cbd5d0;
          --radius: 14px;
          --shadow: 0 2px 12px rgba(27,107,74,0.07);
          --shadow-md: 0 4px 24px rgba(27,107,74,0.12);
        }

        body { font-family: 'Tajawal', sans-serif; direction: rtl; background: var(--bg); }

        .sponsorship-management { display: flex; height: 100vh; overflow: hidden; }

        /* SIDEBAR */
        .sidebar {
          width: 220px;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          padding: 0 0 20px 0;
        }

        .logo-block {
          padding: 22px 18px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-badge {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg, #e8a020, #f0c060);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          color: #0f3d2a;
          letter-spacing: -1px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(232,160,32,0.4);
        }

        .logo-text { display: flex; flex-direction: column; }
        .logo-ar { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; }
        .logo-en { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 1px; text-transform: uppercase; }
        .logo-sub { font-size: 9px; color: rgba(255,255,255,0.35); margin-top: 1px; }

        .nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.18s ease;
          border: 1px solid transparent;
        }
        .nav-item:hover { background: var(--sidebar-hover); color: rgba(255,255,255,0.85); }
        .nav-item.active {
          background: var(--sidebar-active);
          color: #fff;
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }

        .sidebar-footer {
          padding: 12px 14px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--accent), #f0c060);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: #0f3d2a;
          flex-shrink: 0;
        }
        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 12px; font-weight: 600; color: #fff; }
        .user-role { font-size: 10px; color: rgba(255,255,255,0.4); }

        /* MAIN */
        .main { flex: 1; overflow-y: auto; background: var(--bg); }

        .topbar {
          background: var(--surface);
          padding: 18px 28px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
          box-shadow: 0 1px 0 var(--border);
        }
        .page-title { font-size: 20px; font-weight: 800; color: var(--text-main); }
        .page-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .bell-btn {
          width: 38px; height: 38px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          transition: all 0.15s;
        }
        .bell-btn:hover { background: var(--primary-pale); color: var(--primary); border-color: var(--primary); }

        .content { padding: 24px 28px; }

        /* TOOLBAR */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-family: 'Tajawal', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 4px 14px rgba(27,107,74,0.3);
          white-space: nowrap;
        }
        .add-btn:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(27,107,74,0.35); }
        .add-btn svg { width: 16px; height: 16px; }

        .filter-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .filter-select-wrap svg { position: absolute; right: 10px; color: var(--text-muted); pointer-events: none; width: 14px; height: 14px; }
        .filter-select {
          appearance: none;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 9px 30px 9px 12px;
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-main);
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .filter-select:focus { outline: none; border-color: var(--primary); }

        .search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon { position: absolute; right: 12px; color: var(--text-light); width: 15px; height: 15px; }
        .search-input {
          width: 100%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 9px 36px 9px 12px;
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          color: var(--text-main);
          transition: border-color 0.15s;
        }
        .search-input:focus { outline: none; border-color: var(--primary); }

        /* TABLE */
        .table-container {
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table thead {
          background: var(--primary-pale);
          border-bottom: 2px solid var(--border);
        }
        .table th {
          padding: 14px 16px;
          text-align: right;
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .table tbody tr:hover { background: var(--primary-pale); }
        .table td {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-main);
        }
        .table td:first-child { font-weight: 600; }

        /* BADGES */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-active { background: #d1fae5; color: #065f46; }
        .badge-inactive { background: #f3f4f6; color: #374151; }
        .badge-seasonal { background: var(--accent-light); color: #92400e; }
        .badge-urgent { background: #fee2e2; color: #991b1b; }

        /* TOGGLE SWITCH */
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: var(--toggle-off);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toggle-switch.active { background: var(--toggle-on); }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          right: 3px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .toggle-switch.active::after { transform: translateX(-20px); }

        /* ACTION BUTTONS */
        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          font-family: 'Tajawal', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .action-btn svg { width: 14px; height: 14px; }
        .edit-btn { background: var(--primary-pale); color: var(--primary); }
        .edit-btn:hover { background: var(--primary); color: #fff; }

        /* MODALS */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        .modal {
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          width: 90%;
          max-width: 520px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: modalSlideIn 0.25s ease-out;
        }
        .modal-narrow { max-width: 420px; }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          padding: 18px 22px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .modal-title { font-size: 16px; font-weight: 700; color: var(--text-main); }
        .modal-close {
          width: 28px; height: 28px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.15s;
        }
        .modal-close:hover { background: var(--primary-pale); color: var(--primary); }

        .modal-body { padding: 22px; }
        .modal-footer {
          padding: 16px 22px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        /* FORM ELEMENTS */
        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }
        .form-label-optional { font-weight: 400; color: var(--text-muted); font-size: 12px; }
        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          color: var(--text-main);
          transition: border-color 0.15s;
        }
        .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary); }
        .form-textarea { resize: vertical; min-height: 80px; }
        .form-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

        /* DROPZONE */
        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg);
        }
        .drop-zone-active { border-color: var(--primary); background: var(--primary-pale); }
        .drop-zone-filled { padding: 0; overflow: hidden; border-style: solid; }
        .drop-preview { width: 100%; height: 180px; object-fit: cover; }
        .drop-text { font-size: 13px; font-weight: 600; color: var(--text-main); margin: 8px 0 4px; }
        .drop-hint { font-size: 11px; color: var(--text-muted); }

        /* ICON UPLOAD */
        .icon-upload-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
        }
        .icon-specs { display: flex; flex-direction: column; gap: 2px; font-size: 11px; color: var(--text-muted); }
        .icon-upload-btn {
          width: 44px; height: 44px;
          border: 1.5px dashed var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .icon-upload-btn:hover { border-color: var(--primary); background: var(--primary-pale); }

        /* TYPE CARDS */
        .type-card {
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .type-card:hover { border-color: var(--primary); background: var(--primary-pale); transform: translateY(-2px); box-shadow: var(--shadow); }
        .type-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
        .type-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .type-icon-regular { background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff; }
        .type-icon-urgent { background: linear-gradient(135deg, var(--urgent), #ef4444); color: #fff; }
        .type-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .type-title-urgent { color: var(--urgent); }
        .type-desc { font-size: 11px; color: var(--text-muted); line-height: 1.5; }
        .type-btn {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .type-btn-regular { background: var(--primary); color: #fff; }
        .type-btn-regular:hover { background: var(--primary-light); }
        .type-btn-urgent { background: var(--urgent); color: #fff; }
        .type-btn-urgent:hover { background: #b91c1c; }

        /* BUTTONS */
        .btn-primary, .btn-cancel {
          padding: 10px 20px;
          border-radius: 10px;
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: var(--primary-light); }
        .btn-urgent { background: var(--urgent); }
        .btn-urgent:hover { background: #b91c1c; }
        .btn-cancel { background: var(--bg); color: var(--text-muted); }
        .btn-cancel:hover { background: var(--border); color: var(--text-main); }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-block">
          <div className="logo-badge">ر</div>
          <div className="logo-text">
            <span className="logo-ar">جمعية رسالة</span>
            <span className="logo-en">RESALA</span>
            <span className="logo-sub">فرع الزقازيق</span>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item${item.active ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">أ</div>
          <div className="user-info">
            <span className="user-name">أحمد محمد</span>
            <span className="user-role">مدير النظام</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1 className="page-title">إدارة الكفالات</h1>
            <p className="page-sub">متابعة جميع الكفالات النشطة والحالات</p>
          </div>
          <button className="bell-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>

        <div className="content">
          {/* Toolbar */}
          <div className="toolbar">
            <button className="add-btn" onClick={() => setModal("choose-type")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              إضافة كفالة
            </button>

            <div className="filter-select-wrap">
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>جميع الكفالات</option>
                <option>نشطة</option>
                <option>غير نشطة</option>
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                placeholder="ابحث باسم الكفالة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>اسم الكفالة</th>
                  <th>الوصف</th>
                  <th>القيمة</th>
                  <th>المدة</th>
                  <th>إجمالي ما تم جمعه</th>
                  <th>النوع</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {s.seasonal && <span className="badge badge-seasonal">موسمي</span>}
                        {s.urgent && <span className="badge badge-urgent">حرج</span>}
                        <span>{s.title}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '12px', lineHeight: '1.5' }}>{s.description}</td>
                    <td style={{ fontWeight: 600 }}>{s.value} جنيه</td>
                    <td><span className="badge" style={{ background: 'var(--primary-pale)', color: 'var(--primary)' }}>{s.duration}</span></td>
                    <td style={{ fontWeight: 600, color: s.total > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {s.total} جنيه
                    </td>
                    <td>
                      {s.seasonal ? (
                        <span className="badge badge-seasonal">موسمي: {s.seasonal}</span>
                      ) : s.urgent ? (
                        <span className="badge badge-urgent">حرج</span>
                      ) : (
                        <span className="badge badge-active">عادي</span>
                      )}
                    </td>
                    <td>
                      <div
                        className={`toggle-switch${s.active ? ' active' : ''}`}
                        onClick={() => toggleActive(s.id)}
                      />
                    </td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => { setEditTarget(s); setModal("edit"); }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        تعديل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal === "choose-type" && (
        <ChooseTypeModal
          onClose={() => setModal(null)}
          onChoose={(type) => {
            setModal(type === "regular" ? "add-regular" : "add-urgent");
          }}
        />
      )}

      {(modal === "add-regular" || modal === "add-urgent") && (
        <AddModal
          urgent={modal === "add-urgent"}
          onClose={() => setModal(null)}
          onSave={handleAdd}
        />
      )}

      {modal === "edit" && editTarget && (
        <EditModal
          sponsorship={editTarget}
          onClose={() => { setModal(null); setEditTarget(null); }}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}

const navItems = [
  {
    label: "لوحة التحكم",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="nav-icon">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    active: false,
  },
  {
    label: "إدارة الكفالات",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="nav-icon">
        <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3.5 5.5L8 22h8l-1.5-8.5C16.5 12.5 18 10.5 18 8c0-3.5-2.5-6-6-6z" />
      </svg>
    ),
    active: true,
  },
  {
    label: "إدارة الحسابات",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="nav-icon">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
      </svg>
    ),
    active: false,
  },
  {
    label: "التقارير والإحصائيات",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="nav-icon">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    active: false,
  },
  {
    label: "إعدادات النظام",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="nav-icon">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    active: false,
  },
];

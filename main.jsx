import { useState, useEffect } from "react";

const COLORS = {
  navy: "#1C2E4A",
  navyLight: "#243656",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  white: "#FFFFFF",
  bg: "#F0F3F8",
  cardBg: "#FFFFFF",
  gray100: "#F5F7FA",
  gray200: "#E8ECF2",
  gray400: "#9CA8BB",
  gray600: "#5A6680",
  gray800: "#2D3A52",
  green: "#1DB87A",
  greenLight: "#E6F9F1",
  orange: "#F5872A",
  orangeLight: "#FEF3E8",
  red: "#E53E3E",
  redLight: "#FEE8E8",
  yellow: "#F5C842",
  yellowLight: "#FFFBE6",
};

const STATUS_MAP = {
  draft: { label: "مسودة", color: COLORS.gray400, bg: COLORS.gray200, icon: "◯" },
  pending: { label: "قيد المراجعة", color: COLORS.orange, bg: COLORS.orangeLight, icon: "◑" },
  revision: { label: "يحتاج تعديل", color: "#E5890A", bg: "#FEF3E0", icon: "↩" },
  approved: { label: "معتمد", color: COLORS.green, bg: COLORS.greenLight, icon: "✓" },
  rejected: { label: "مرفوض", color: COLORS.red, bg: COLORS.redLight, icon: "✕" },
};

const TYPES = ["يومي", "أسبوعي", "شهري", "استثنائي"];
const DEPTS = ["التخطيط والتطوير", "الموارد البشرية", "تقنية المعلومات", "المالية والمحاسبة", "العمليات"];

const INITIAL_REPORTS = [
  { id: "RPT-001", title: "تقرير الأداء الأسبوعي - يونيو", type: "أسبوعي", dept: "تقنية المعلومات", author: "فيصل الحمزاني", date: "2026-06-20", status: "approved", content: "تم إنجاز 94% من المهام المخطط لها هذا الأسبوع. تم إطلاق نظام المتابعة الجديد.", managerNote: "" },
  { id: "RPT-002", title: "تقرير المتابعة الشهري - مايو", type: "شهري", dept: "الموارد البشرية", author: "سارة العتيبي", date: "2026-06-15", status: "pending", content: "معدل الحضور 97%، تم إنهاء 3 عقود وتعيين 5 موظفين جدد.", managerNote: "" },
  { id: "RPT-003", title: "تقرير طارئ - عطل النظام", type: "استثنائي", dept: "تقنية المعلومات", author: "محمد الدوسري", date: "2026-06-25", status: "revision", content: "حدث عطل في الخادم الرئيسي بتاريخ 25/6، تم إيقاف الخدمة لمدة ساعتين.", managerNote: "يرجى إضافة الإجراءات التصحيحية المتخذة وخطة الطوارئ." },
  { id: "RPT-004", title: "التقرير اليومي - الاثنين", type: "يومي", dept: "المالية والمحاسبة", author: "نورة القحطاني", date: "2026-06-27", status: "draft", content: "", managerNote: "" },
];

let reportIdCounter = 5;

function Badge({ status }) {
  const s = STATUS_MAP[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 700,
    }}>
      {s.icon} {s.label}
    </span>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: COLORS.cardBg, borderRadius: 14,
      padding: "20px 22px",
      boxShadow: "0 2px 12px rgba(28,46,74,0.07)",
      borderTop: `4px solid ${color}`,
      flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy }}>{value}</div>
      <div style={{ fontSize: 13, color: COLORS.gray600 }}>{label}</div>
    </div>
  );
}

function ReportRow({ report, onSelect }) {
  return (
    <div onClick={() => onSelect(report)} style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 18px", background: COLORS.cardBg,
      borderRadius: 10, marginBottom: 8,
      boxShadow: "0 1px 6px rgba(28,46,74,0.06)",
      cursor: "pointer", transition: "all 0.15s",
      border: "1.5px solid transparent",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.gold}
      onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: COLORS.navy + "15", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>📄</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{report.title}</div>
        <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 3 }}>
          {report.author} · {report.dept} · {report.date}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <Badge status={report.status} />
        <span style={{ fontSize: 11, color: COLORS.gray400 }}>{report.id}</span>
      </div>
    </div>
  );
}

function SubmitForm({ onSubmit, onCancel, editReport }) {
  const [form, setForm] = useState({
    title: editReport?.title || "",
    type: editReport?.type || TYPES[0],
    dept: editReport?.dept || DEPTS[0],
    content: editReport?.content || "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    onSubmit(form);
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", border: `1.5px solid ${COLORS.gray200}`,
    borderRadius: 8, padding: "10px 12px", fontSize: 14,
    color: COLORS.navy, background: COLORS.gray100,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 14, padding: 28, boxShadow: "0 4px 20px rgba(28,46,74,0.1)" }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, marginBottom: 22 }}>
        {editReport ? "✏️ تعديل التقرير" : "📝 رفع تقرير جديد"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 13, color: COLORS.gray600, display: "block", marginBottom: 6 }}>عنوان التقرير *</label>
          <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="مثال: تقرير الأداء الأسبوعي" />
        </div>
        <div>
          <label style={{ fontSize: 13, color: COLORS.gray600, display: "block", marginBottom: 6 }}>نوع التقرير</label>
          <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: COLORS.gray600, display: "block", marginBottom: 6 }}>القسم</label>
        <select style={inputStyle} value={form.dept} onChange={e => set("dept", e.target.value)}>
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{ fontSize: 13, color: COLORS.gray600, display: "block", marginBottom: 6 }}>محتوى التقرير *</label>
        <textarea
          style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
          value={form.content}
          onChange={e => set("content", e.target.value)}
          placeholder="اكتب تفاصيل التقرير هنا..."
        />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-start" }}>
        <button onClick={handleSubmit} disabled={loading || !form.title || !form.content} style={{
          background: loading ? COLORS.gray400 : COLORS.gold,
          color: COLORS.navy, border: "none", borderRadius: 8,
          padding: "10px 24px", fontWeight: 700, fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          {loading ? "⏳ جاري الإرسال..." : "📤 إرسال للمراجعة"}
        </button>
        <button onClick={onCancel} style={{
          background: "transparent", color: COLORS.gray600,
          border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8,
          padding: "10px 20px", cursor: "pointer", fontFamily: "inherit", fontSize: 14,
        }}>إلغاء</button>
      </div>
    </div>
  );
}

function ReportDetail({ report, role, onClose, onAction }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const getAiSummary = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `أنت مساعد تنفيذي. قم بتلخيص التقرير التالي في 3 نقاط رئيسية باللغة العربية فقط، بشكل موجز واحترافي:\n\nعنوان التقرير: ${report.title}\nالنوع: ${report.type}\nالقسم: ${report.dept}\nالمحتوى: ${report.content}`,
          }],
        }),
      });
      const data = await res.json();
      setAiSummary(data.content?.[0]?.text || "تعذر توليد الملخص.");
    } catch {
      setAiSummary("تعذر الاتصال بالذكاء الاصطناعي.");
    }
    setAiLoading(false);
  };

  const doAction = async (action) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    onAction(report.id, action, note);
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(28,46,74,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.cardBg, borderRadius: 16, width: "100%",
        maxWidth: 640, maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 20px 60px rgba(28,46,74,0.25)",
      }}>
        {/* Header */}
        <div style={{
          background: COLORS.navy, padding: "20px 24px",
          borderRadius: "16px 16px 0 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{report.id}</div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 17 }}>{report.title}</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "white", borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", fontSize: 16, fontFamily: "inherit",
          }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Badge status={report.status} />
            <span style={{ background: COLORS.gray100, color: COLORS.gray600, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>📂 {report.type}</span>
            <span style={{ background: COLORS.gray100, color: COLORS.gray600, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>🏢 {report.dept}</span>
            <span style={{ background: COLORS.gray100, color: COLORS.gray600, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>👤 {report.author}</span>
            <span style={{ background: COLORS.gray100, color: COLORS.gray600, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>📅 {report.date}</span>
          </div>

          {/* Content */}
          <div style={{ background: COLORS.gray100, borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 14, color: COLORS.gray800, lineHeight: 1.7 }}>
            {report.content || <span style={{ color: COLORS.gray400 }}>لا يوجد محتوى</span>}
          </div>

          {/* Manager note */}
          {report.managerNote && (
            <div style={{ background: COLORS.orangeLight, border: `1.5px solid ${COLORS.orange}20`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.orange, fontWeight: 700, marginBottom: 6 }}>ملاحظة المدير</div>
              <div style={{ fontSize: 14, color: COLORS.gray800 }}>{report.managerNote}</div>
            </div>
          )}

          {/* AI Summary */}
          <div style={{ marginBottom: 20 }}>
            <button onClick={getAiSummary} disabled={aiLoading || !report.content} style={{
              background: "linear-gradient(135deg, #6C63FF, #4A90E2)",
              color: "white", border: "none", borderRadius: 8,
              padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: aiLoading ? "not-allowed" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {aiLoading ? "⏳ جاري التحليل..." : "✨ تلخيص بالذكاء الاصطناعي"}
            </button>
            {aiSummary && (
              <div style={{
                background: "linear-gradient(135deg, #6C63FF10, #4A90E210)",
                border: "1.5px solid #6C63FF30", borderRadius: 10,
                padding: 14, marginTop: 10, fontSize: 13, color: COLORS.gray800, lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}>
                {aiSummary}
              </div>
            )}
          </div>

          {/* Manager Actions */}
          {role === "manager" && report.status === "pending" && (
            <div style={{ borderTop: `1.5px solid ${COLORS.gray200}`, paddingTop: 16 }}>
              <div style={{ fontSize: 13, color: COLORS.gray600, marginBottom: 8 }}>ملاحظة (اختياري)</div>
              <textarea
                style={{
                  width: "100%", border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8,
                  padding: "10px 12px", fontSize: 14, minHeight: 80, resize: "vertical",
                  fontFamily: "inherit", color: COLORS.navy, background: COLORS.gray100,
                  outline: "none", boxSizing: "border-box", marginBottom: 12,
                }}
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="أضف ملاحظة للموظف..."
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => doAction("approved")} disabled={loading} style={{
                  background: COLORS.green, color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                }}>✓ اعتماد</button>
                <button onClick={() => doAction("revision")} disabled={loading} style={{
                  background: COLORS.orange, color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                }}>↩ إعادة للتعديل</button>
                <button onClick={() => doAction("rejected")} disabled={loading} style={{
                  background: COLORS.red, color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                }}>✕ رفض</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState("employee");
  const [view, setView] = useState("dashboard");
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    approved: reports.filter(r => r.status === "approved").length,
    revision: reports.filter(r => r.status === "revision").length,
  };

  const filtered = reports.filter(r => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterType !== "all" && r.type !== filterType) return false;
    if (role === "employee" && r.author !== "محمد البقامي") return false;
    return true;
  });

  const visibleReports = role === "employee"
    ? reports.filter(r => r.author === "محمد البقامي" || r.author === "فيصل الحمزاني")
    : role === "manager"
    ? reports.filter(r => r.status === "pending" || r.status === "revision")
    : reports;

  const handleSubmit = (form) => {
    const newReport = {
      id: `RPT-00${reportIdCounter++}`,
      ...form,
      author: "محمد البقامي",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      managerNote: "",
    };
    setReports(prev => [newReport, ...prev]);
    setShowForm(false);
  };

  const handleAction = (id, action, note) => {
    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: action, managerNote: note } : r
    ));
    setSelected(null);
  };

  const sideItems = [
    { id: "dashboard", icon: "📊", label: "لوحة التحكم" },
    { id: "reports", icon: "📄", label: role === "manager" ? "التقارير المعلقة" : "التقارير" },
    { id: "all", icon: "📋", label: "جميع التقارير" },
  ];

  const roleLabels = { employee: "موظف", manager: "مدير", admin: "الإدارة العليا" };

  return (
    <div style={{ direction: "rtl", fontFamily: "'Segoe UI', 'Tahoma', Arial, sans-serif", background: COLORS.bg, minHeight: "100vh", display: "flex" }}>

      {/* Sidebar */}
      <div style={{
        width: 220, background: COLORS.navy, minHeight: "100vh",
        display: "flex", flexDirection: "column", flexShrink: 0,
        boxShadow: "4px 0 20px rgba(28,46,74,0.15)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ color: COLORS.gold, fontWeight: 900, fontSize: 18, letterSpacing: 0.5 }}>📊 بوابة التقارير</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>منصة إدارة التقارير</div>
        </div>

        {/* Role Switch */}
        <div style={{ padding: "0 16px 20px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>الدور الحالي</div>
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setView("dashboard"); }}
            style={{
              width: "100%", background: COLORS.navyLight, color: "white",
              border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 8,
              padding: "8px 10px", fontSize: 13, fontFamily: "inherit",
              cursor: "pointer", outline: "none",
            }}
          >
            <option value="employee">👤 موظف</option>
            <option value="manager">👔 مدير</option>
            <option value="admin">🏛️ الإدارة العليا</option>
          </select>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {sideItems.map(item => (
            <div key={item.id} onClick={() => { setView(item.id); setShowForm(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 12px", borderRadius: 10, marginBottom: 4,
                cursor: "pointer", transition: "all 0.15s",
                background: view === item.id ? COLORS.gold + "22" : "transparent",
                borderRight: view === item.id ? `3px solid ${COLORS.gold}` : "3px solid transparent",
                color: view === item.id ? COLORS.gold : "rgba(255,255,255,0.65)",
                fontWeight: view === item.id ? 700 : 400, fontSize: 14,
              }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.id === "reports" && stats.pending > 0 && role === "manager" && (
                <span style={{
                  marginRight: "auto", background: COLORS.red,
                  color: "white", borderRadius: 10, padding: "1px 7px",
                  fontSize: 11, fontWeight: 700,
                }}>{stats.pending}</span>
              )}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: COLORS.gold + "30",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: COLORS.gold, fontWeight: 700,
            }}>م</div>
            <div>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>محمد البقامي</div>
              <div style={{ color: COLORS.gold, fontSize: 11 }}>{roleLabels[role]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

        {/* Dashboard */}
        {view === "dashboard" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.navy }}>لوحة التحكم</div>
              <div style={{ color: COLORS.gray600, fontSize: 14, marginTop: 4 }}>{new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <StatCard label="إجمالي التقارير" value={reports.length} color={COLORS.navy} icon="📄" />
              <StatCard label="قيد المراجعة" value={stats.pending} color={COLORS.orange} icon="⏳" />
              <StatCard label="معتمدة" value={stats.approved} color={COLORS.green} icon="✅" />
              <StatCard label="تحتاج تعديل" value={stats.revision} color="#E5890A" icon="↩" />
            </div>

            {/* Recent */}
            <div style={{ background: COLORS.cardBg, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px rgba(28,46,74,0.07)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>آخر التقارير</div>
              {reports.slice(0, 4).map(r => (
                <ReportRow key={r.id} report={r} onSelect={setSelected} />
              ))}
            </div>

            {role === "employee" && (
              <div style={{ marginTop: 20 }}>
                {showForm
                  ? <SubmitForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
                  : <button onClick={() => setShowForm(true)} style={{
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                    color: COLORS.navy, border: "none", borderRadius: 10,
                    padding: "13px 28px", fontWeight: 800, fontSize: 15,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: `0 4px 16px ${COLORS.gold}50`,
                  }}>
                    + رفع تقرير جديد
                  </button>
                }
              </div>
            )}
          </div>
        )}

        {/* Reports View */}
        {(view === "reports" || view === "all") && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.navy }}>
                  {view === "reports" && role === "manager" ? "التقارير المعلقة" : "جميع التقارير"}
                </div>
                <div style={{ color: COLORS.gray600, fontSize: 13, marginTop: 3 }}>
                  {(view === "all" ? reports : visibleReports).length} تقرير
                </div>
              </div>
              {role === "employee" && (
                <button onClick={() => setShowForm(true)} style={{
                  background: COLORS.gold, color: COLORS.navy, border: "none",
                  borderRadius: 8, padding: "10px 20px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                }}>+ تقرير جديد</button>
              )}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {["all", "pending", "approved", "revision", "rejected", "draft"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: `1.5px solid ${filterStatus === s ? COLORS.gold : COLORS.gray200}`,
                  background: filterStatus === s ? COLORS.gold : "white",
                  color: filterStatus === s ? COLORS.navy : COLORS.gray600,
                  cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                }}>
                  {s === "all" ? "الكل" : STATUS_MAP[s]?.label}
                </button>
              ))}
            </div>

            {showForm && <div style={{ marginBottom: 16 }}><SubmitForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} /></div>}

            {(view === "all" ? reports : visibleReports)
              .filter(r => filterStatus === "all" || r.status === filterStatus)
              .map(r => <ReportRow key={r.id} report={r} onSelect={setSelected} />)
            }
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <ReportDetail
          report={selected}
          role={role}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

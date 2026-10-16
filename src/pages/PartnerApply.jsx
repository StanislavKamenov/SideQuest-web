import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Store, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/lib/supabaseClient";

const CATEGORIES = [
  "Restaurant", "Cafe", "Bar", "Gym", "Fitness", "Store", "Retail", "Beauty",
  "Entertainment", "Gaming", "Sports", "Outdoor", "Education", "Events", "Other",
];

const inputClass =
  "w-full bg-[#0a0912] border-2 border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#E85D4A] focus:outline-none transition-colors";
const labelClass = "block font-pixel text-[7px] tracking-wider text-muted-foreground mb-2";
const primaryBtn =
  "w-full bg-[#E85D4A] text-white px-4 py-3.5 font-pixel text-[9px] tracking-wider hover:bg-[#d44d3a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 arcade-btn";
const primaryShadow = { boxShadow: "0 3px 0 0 #9d3324, 0 0 16px rgba(232,93,74,0.3)" };

/**
 * Public "become a partner" application. No account needed: it is stored through the
 * `submit_business_lead` RPC (validated, rate limited, readable only by admins).
 */
export default function PartnerApply() {
  const { i18n } = useTranslation();
  const bg = i18n.language?.startsWith("bg");
  const L = (b, e) => (bg ? b : e);

  const [form, setForm] = useState({
    name: "", category: "Cafe", city: "", address: "", person: "", phone: "", email: "", website: "", message: "",
  });
  const [trap, setTrap] = useState(""); // honeypot: real visitors never see or fill it
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const friendly = (err) => {
    const msg = String(err?.message ?? "");
    if (msg.includes("invalid_name")) return L("Въведи името на обекта.", "Please enter the business name.");
    if (msg.includes("contact_required")) return L("Въведи телефон или имейл за връзка.", "Please enter a phone number or email.");
    if (msg.includes("invalid_email")) return L("Имейлът не изглежда правилен.", "That email address does not look right.");
    if (msg.includes("invalid_phone")) return L("Телефонът не изглежда правилен.", "That phone number does not look right.");
    if (msg.includes("rate_limited")) return L("Твърде много заявки в момента. Опитай по-късно.", "Too many requests right now. Please try again later.");
    return L("Нещо се обърка. Опитай отново.", "Something went wrong. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.phone.trim() && !form.email.trim()) {
      setError(L("Въведи телефон или имейл за връзка.", "Please enter a phone number or email."));
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.rpc("submit_business_lead", {
        p_name: form.name,
        p_contact_person: form.person || null,
        p_contact_phone: form.phone || null,
        p_contact_email: form.email || null,
        p_category: form.category,
        p_city: form.city || null,
        p_address: form.address || null,
        p_website: form.website || null,
        p_message: form.message || null,
        p_source: "web",
        p_honeypot: trap || null,
      });
      if (err) throw err;
      setDone(true);
    } catch (err) {
      setError(friendly(err));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        icon={CheckCircle2}
        title={L("Заявката е изпратена", "Application sent")}
        subtitle={L("Ще се свържем с теб съвсем скоро.", "We will contact you very soon.")}
        footer={<Link to="/" className="text-[#C8E650] hover:underline">{L("Към началото", "Back to the arcade")}</Link>}
      >
        <p className="font-body text-sm text-muted-foreground text-center">
          {L(
            "Благодарим ти! Екипът на SideQuest ще прегледа заявката и ще се обади или пише на дадения контакт.",
            "Thank you! The SideQuest team will review your application and call or write to the contact you gave."
          )}
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Store}
      title={L("Стани партньор", "Become a partner")}
      subtitle={L(
        "Кратка заявка, без регистрация. Фирмени данни не са нужни сега.",
        "A short application, no account needed. No company details required yet."
      )}
      footer={<Link to="/" className="text-[#C8E650] hover:underline">{L("Към началото", "Back to the arcade")}</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="flex items-start gap-2 border border-red-500/40 bg-red-500/10 px-3 py-2 font-body text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="pa-name">{L("ИМЕ НА ОБЕКТА *", "BUSINESS NAME *")}</label>
          <input id="pa-name" className={inputClass} required minLength={2} maxLength={120} value={form.name} onChange={set("name")} placeholder="Bean & Brew Cafe" />
        </div>

        <div>
          <label className={labelClass} htmlFor="pa-cat">{L("КАТЕГОРИЯ", "CATEGORY")}</label>
          <select id="pa-cat" className={inputClass} value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pa-city">{L("ГРАД *", "CITY *")}</label>
            <input id="pa-city" className={inputClass} required maxLength={80} value={form.city} onChange={set("city")} placeholder="Sofia" />
          </div>
          <div>
            <label className={labelClass} htmlFor="pa-address">{L("АДРЕС", "ADDRESS")}</label>
            <input id="pa-address" className={inputClass} maxLength={200} value={form.address} onChange={set("address")} placeholder="Vitosha Blvd 24" />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pa-person">{L("ЛИЦЕ ЗА КОНТАКТ", "CONTACT PERSON")}</label>
          <input id="pa-person" className={inputClass} maxLength={120} value={form.person} onChange={set("person")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pa-phone">{L("ТЕЛЕФОН", "PHONE")}</label>
            <input id="pa-phone" type="tel" className={inputClass} maxLength={30} value={form.phone} onChange={set("phone")} placeholder="+359 888 888 888" />
          </div>
          <div>
            <label className={labelClass} htmlFor="pa-email">{L("ИМЕЙЛ", "EMAIL")}</label>
            <input id="pa-email" type="email" className={inputClass} maxLength={200} value={form.email} onChange={set("email")} placeholder="name@example.com" />
          </div>
        </div>
        <p className="font-body text-[11px] text-muted-foreground/70 -mt-2">
          {L("Достатъчно е едно от двете.", "One of the two is enough.")}
        </p>

        <div>
          <label className={labelClass} htmlFor="pa-web">{L("САЙТ ИЛИ INSTAGRAM", "WEBSITE OR INSTAGRAM")}</label>
          <input id="pa-web" className={inputClass} maxLength={300} value={form.website} onChange={set("website")} placeholder="https://" />
        </div>

        <div>
          <label className={labelClass} htmlFor="pa-msg">{L("КАКВО ИСКАШ ДА ПРЕДЛОЖИШ? (ПО ЖЕЛАНИЕ)", "WHAT WOULD YOU LIKE TO OFFER? (OPTIONAL)")}</label>
          <textarea id="pa-msg" rows={3} className={inputClass} maxLength={1000} value={form.message} onChange={set("message")} />
        </div>

        {/* honeypot */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
        </div>

        <button type="submit" disabled={loading} className={primaryBtn} style={primaryShadow}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Store className="w-4 h-4" aria-hidden="true" />}
          {L("ИЗПРАТИ ЗАЯВКА", "SEND APPLICATION")}
        </button>
      </form>
    </AuthLayout>
  );
}

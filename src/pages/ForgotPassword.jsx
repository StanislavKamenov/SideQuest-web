import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
      footer={
        <Link to="/login" className="text-[#C8E650] hover:underline glow-lime">
          <ArrowLeft className="w-3 h-3 inline mr-1" />{t("auth.forgotPassword.backToLogin")}
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 border-2 border-[#C8E650]/40 bg-[#C8E650]/10 flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 20px rgba(200,230,80,0.15)' }}
          >
            <Mail className="w-6 h-6 text-[#C8E650]" />
          </div>
          <p className="font-pixel text-[8px] text-[#C8E650] tracking-wider mb-2" style={{ textShadow: '0 0 6px #C8E65066' }}>
            EMAIL SENT
          </p>
          <p className="font-body text-sm text-muted-foreground">
            {t("auth.forgotPassword.successMessage")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="forgot-email">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder={t("auth.forgotPassword.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0912] border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#A663E0] focus:outline-none transition-colors"
                style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A663E0] text-white px-4 py-3.5 font-pixel text-[9px] tracking-wider hover:bg-[#9353d0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 arcade-btn"
            style={{ boxShadow: '0 3px 0 0 #6d3a99, 0 0 16px rgba(166,99,224,0.3)' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                SENDING...
              </>
            ) : (
              t("auth.forgotPassword.sendBtn")
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

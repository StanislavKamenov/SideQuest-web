import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError(t("auth.resetPassword.passwordsNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await db.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || t("auth.resetPassword.failedReset"));
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title={t("auth.resetPassword.invalidLinkTitle")}
        subtitle={t("auth.resetPassword.invalidLinkSubtitle")}
        footer={
          <Link to="/forgot-password" className="text-[#C8E650] hover:underline glow-lime">
            {t("auth.resetPassword.requestNewLink")}
          </Link>
        }
      >
        <div className="text-center py-4">
          <p className="font-pixel text-[8px] text-[#E85D4A] tracking-wider mb-2" style={{ textShadow: '0 0 6px #E85D4A66' }}>
            INVALID LINK
          </p>
          <p className="font-body text-sm text-muted-foreground">
            {t("auth.resetPassword.invalidLinkMessage")}
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
    >
      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 border border-[#E85D4A]/50 bg-[#E85D4A]/10 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-[#E85D4A] flex-shrink-0" />
          <span className="font-body text-sm text-[#E85D4A]">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="reset-password">
            NEW PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0a0912] border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#A663E0] focus:outline-none transition-colors"
              style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="reset-confirm">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              RESETTING...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              {t("auth.resetPassword.resetBtn")}
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserPlus, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("auth.register.passwordsNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || t("auth.register.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      window.location.href = "/";
    } catch (err) {
      setError(err.message || t("auth.register.invalidOtp"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({
        title: t("auth.register.codeSent"),
        description: t("auth.register.codeSentDesc"),
      });
    } catch (err) {
      setError(err.message || t("auth.register.failedResend"));
    }
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider("google", "/");
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title={t("auth.register.verifyEmailTitle")}
        subtitle={`${t("auth.register.verifyEmailSubtitleStart")} ${email}`}
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

        {/* OTP Input — 6 individual boxes */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otpCode[i] || ""}
              autoFocus={i === 0}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                const newCode = otpCode.split('');
                newCode[i] = val;
                setOtpCode(newCode.join(''));
                // Auto-focus next input
                if (val && i < 5) {
                  const next = e.target.parentElement.children[i + 1];
                  if (next) next.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otpCode[i] && i > 0) {
                  const prev = e.target.parentElement.children[i - 1];
                  if (prev) prev.focus();
                }
              }}
              className="w-10 h-12 bg-[#0a0912] border-2 border-border text-center font-pixel text-lg text-foreground focus:border-[#A663E0] focus:outline-none transition-colors"
              style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
          className="w-full bg-[#A663E0] text-white px-4 py-3.5 font-pixel text-[9px] tracking-wider hover:bg-[#9353d0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 arcade-btn mb-4"
          style={{ boxShadow: '0 3px 0 0 #6d3a99, 0 0 16px rgba(166,99,224,0.3)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              VERIFYING...
            </>
          ) : (
            t("auth.register.verifyBtn")
          )}
        </button>

        <p className="text-center font-pixel text-[7px] text-muted-foreground tracking-wide">
          {t("auth.register.didntReceiveCode")}{" "}
          <button onClick={handleResend} className="text-[#C8E650] hover:underline glow-lime">
            {t("auth.register.resendBtn")}
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
      footer={
        <>
          {t("auth.register.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-[#C8E650] hover:underline glow-lime">
            {t("auth.register.loginLink")}
          </Link>
        </>
      }
    >
      {/* Google Login */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 border-2 border-border bg-secondary/30 px-4 py-3 font-pixel text-[8px] text-foreground tracking-wide hover:border-[#A663E0]/50 hover:bg-secondary/50 transition-all mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)' }} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 font-pixel text-[7px] text-muted-foreground tracking-widest"
            style={{ backgroundColor: 'hsl(240 12% 8%)' }}
          >
            OR
          </span>
        </div>
      </div>

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="reg-email">
            EMAIL
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder={t("auth.register.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0912] border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#A663E0] focus:outline-none transition-colors"
              style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="reg-password">
            PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth.register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0912] border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#A663E0] focus:outline-none transition-colors"
              style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="reg-confirm">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
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
              CREATING ACCOUNT...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              {t("auth.register.createAccountBtn")}
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

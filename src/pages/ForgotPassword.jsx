import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound, Mail, Lock, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";
import { supabase, createIsolatedClient } from "@/lib/supabaseClient";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 60;

const inputClass =
  "w-full bg-[#0a0912] border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-[#E85D4A] focus:outline-none transition-colors";
const inputShadow = { boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)" };
const primaryBtn =
  "w-full bg-[#E85D4A] text-white px-4 py-3.5 font-pixel text-[9px] tracking-wider hover:bg-[#d44d3a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 arcade-btn";
const primaryShadow = { boxShadow: "0 3px 0 0 #9d3324, 0 0 16px rgba(232,93,74,0.3)" };

/**
 * Reset a password with the 6-digit code that Supabase e-mails (templates live in the
 * app repo: email-templates/). Steps: e-mail -> code + new password -> done.
 *
 * The recovery session lives in an ISOLATED client: the shared client's auth listener
 * (AuthContext) would otherwise sign non-business accounts out the moment the code
 * is accepted, before the new password could be saved.
 */
export default function ForgotPassword() {
  const { i18n } = useTranslation();
  const bg = i18n.language?.startsWith("bg");
  const L = (b, e) => (bg ? b : e);

  const [step, setStep] = useState("email"); // email | code | done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const friendly = (err) => {
    const msg = String(err?.message ?? "").toLowerCase();
    if (err?.status === 429 || msg.includes("rate limit") || msg.includes("security purposes")) {
      return L("Твърде много опити. Изчакай няколко минути.", "Too many attempts. Please wait a few minutes.");
    }
    if (msg.includes("expired") || msg.includes("invalid")) {
      return L("Кодът е грешен или е изтекъл. Провери го или поискай нов.", "The code is wrong or has expired. Check it or request a new one.");
    }
    if (msg.includes("different from the old password")) {
      return L("Новата парола трябва да е различна от старата.", "The new password must differ from the old one.");
    }
    if (msg.includes("at least")) {
      return L("Паролата трябва да е поне 8 символа.", "The password must be at least 8 characters.");
    }
    return err?.message || L("Нещо се обърка. Опитай отново.", "Something went wrong. Please try again.");
  };

  const sendCode = async () => {
    // Always move on to the next step, whether or not the address has an account (no account enumeration).
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if (err && (err.status === 429 || /rate limit|security purposes/i.test(err.message))) throw err;
    setCooldown(RESEND_COOLDOWN_S);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendCode();
      setStep("code");
    } catch (err) {
      setError(friendly(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setNotice("");
    try {
      await sendCode();
      setNotice(L("Изпратихме нов код.", "We sent you a new code."));
    } catch (err) {
      setError(friendly(err));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== OTP_LENGTH) {
      setError(L("Въведи 6-цифрения код от имейла.", "Enter the 6-digit code from the e-mail."));
      return;
    }
    if (password.length < 8) {
      setError(L("Паролата трябва да е поне 8 символа.", "The password must be at least 8 characters."));
      return;
    }
    if (password !== confirm) {
      setError(L("Паролите не съвпадат.", "The passwords do not match."));
      return;
    }

    setLoading(true);
    const isolated = createIsolatedClient();
    try {
      const { error: verifyErr } = await isolated.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "recovery",
      });
      if (verifyErr) throw verifyErr;

      const { error: updateErr } = await isolated.auth.updateUser({ password });
      if (updateErr) throw updateErr;

      await isolated.auth.signOut();
      setStep("done");
    } catch (err) {
      setError(friendly(err));
      if (/expired|invalid/i.test(String(err?.message))) setCode("");
    } finally {
      setLoading(false);
    }
  };

  const errorBox = error && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 border border-[#E85D4A]/50 bg-[#E85D4A]/10 flex items-center gap-2"
    >
      <AlertTriangle className="w-4 h-4 text-[#E85D4A] flex-shrink-0" />
      <span className="font-body text-sm text-[#E85D4A]">{error}</span>
    </motion.div>
  );

  const footer = (
    <Link to="/login" className="text-[#C8E650] hover:underline">
      {L("Обратно към входа", "Back to sign in")}
    </Link>
  );

  if (step === "done") {
    return (
      <AuthLayout
        icon={CheckCircle2}
        title={L("Паролата е сменена", "Password updated")}
        subtitle={L("Вече можеш да влезеш с новата си парола.", "You can now sign in with your new password.")}
        footer={footer}
      >
        <Link to="/login" className={primaryBtn} style={primaryShadow}>
          {L("КЪМ ВХОДА", "GO TO SIGN IN")}
        </Link>
      </AuthLayout>
    );
  }

  if (step === "code") {
    return (
      <AuthLayout
        icon={KeyRound}
        title={L("Въведи кода", "Enter the code")}
        subtitle={L(
          `Изпратихме 6-цифрен код на ${email}. Валиден е 10 минути.`,
          `We sent a 6-digit code to ${email}. It is valid for 10 minutes.`,
        )}
        footer={footer}
      >
        {errorBox}
        {notice && !error && (
          <div className="mb-4 p-3 border border-[#C8E650]/40 bg-[#C8E650]/10 font-body text-sm text-[#C8E650]">{notice}</div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="fp-code">
              {L("КОД ОТ ИМЕЙЛА", "CODE FROM E-MAIL")}
            </label>
            <input
              id="fp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={OTP_LENGTH + 4}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
              className="w-full bg-[#0a0912] border-2 border-border px-4 py-3 text-center font-pixel text-2xl tracking-[0.5em] text-foreground placeholder:text-muted-foreground/20 focus:border-[#E85D4A] focus:outline-none transition-colors"
              style={inputShadow}
            />
          </div>

          <div className="space-y-2">
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="fp-pass">
              {L("НОВА ПАРОЛА", "NEW PASSWORD")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="fp-pass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                style={inputShadow}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="fp-confirm">
              {L("ПОТВЪРДИ ПАРОЛАТА", "CONFIRM PASSWORD")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="fp-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                style={inputShadow}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={primaryBtn} style={primaryShadow}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {L("ЗАПАЗИ ПАРОЛАТА", "SAVE PASSWORD")}
          </button>

          <p className="text-center font-body text-xs text-muted-foreground">
            {L("Не го намираш? Провери в „Спам“. ", "Can't find it? Check your spam folder. ")}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-[#C8E650] hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0 ? L(`Нов код след ${cooldown}с`, `New code in ${cooldown}s`) : L("Изпрати нов код", "Send a new code")}
            </button>
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Mail}
      title={L("Забравена парола", "Forgot your password?")}
      subtitle={L("Въведи имейла си и ще ти изпратим код за нова парола.", "Enter your e-mail and we will send you a code to set a new password.")}
      footer={footer}
    >
      {errorBox}
      <form onSubmit={handleEmail} className="space-y-4">
        <div className="space-y-2">
          <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="fp-email">
            {L("ИМЕЙЛ", "E-MAIL")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="fp-email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputShadow}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className={primaryBtn} style={primaryShadow}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {L("ИЗПРАТИ КОД", "SEND CODE")}
        </button>
      </form>
    </AuthLayout>
  );
}

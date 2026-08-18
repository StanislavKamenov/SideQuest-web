import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { LogIn, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showNotBusiness, setShowNotBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, authError } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authError === 'ACCESS_DENIED_NOT_BUSINESS') {
      setShowNotBusiness(true);
      const timer = setTimeout(() => setShowNotBusiness(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowNotBusiness(false);
    setLoading(true);
    try {
      const { profile } = await login(email, password);
      
      const isSysAdmin = profile?.role === 'admin' || profile?.is_admin === true;
      if (isSysAdmin) {
        navigate("/sysadmin");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      if (err.message === "ACCESS_DENIED_NOT_BUSINESS") {
        setShowNotBusiness(true);
        setTimeout(() => setShowNotBusiness(false), 5000);
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background pixel-grid relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-8 w-px h-24 bg-[#E85D4A]/20" />
      <div className="absolute top-20 left-8 w-24 h-px bg-[#E85D4A]/20" />
      <div className="absolute bottom-20 right-8 w-px h-24 bg-[#C8E650]/20" />
      <div className="absolute bottom-20 right-8 w-24 h-px bg-[#C8E650]/20" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#E85D4A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#C8E650]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src={logo} alt="SideQuest" className="w-12 h-12 object-contain" />
            <span className="font-pixel text-[11px] text-foreground glow-red tracking-tight">
              SIDE<span className="text-[#E85D4A]">QUEST</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 border border-[#E85D4A]/40 px-3 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#E85D4A] animate-pulse" />
            <span className="font-pixel text-[7px] text-[#E85D4A] tracking-widest">
              BUSINESS PORTAL
            </span>
          </div>
          <h1 className="font-pixel text-[clamp(0.8rem,2.5vw,1.1rem)] text-foreground glow-red mb-2 leading-relaxed mt-2">
            LOG IN
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Access your business admin dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border-2 border-border p-8 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E85D4A]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E85D4A]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C8E650]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C8E650]" />

          {/* Google Login */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border-2 border-border bg-secondary/50 px-4 py-3 font-pixel text-[8px] text-foreground tracking-wide hover:border-[#E85D4A]/50 hover:bg-secondary transition-all mb-6"
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
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 font-pixel text-[7px] text-muted-foreground tracking-widest">
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
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="login-email">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest" htmlFor="login-password">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border-2 border-border pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E85D4A] text-white px-4 py-3.5 font-pixel text-[9px] tracking-wider hover:bg-[#d44d3a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  LOG IN
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center font-pixel text-[7px] text-muted-foreground mt-6 tracking-wide">
          BUSINESS ACCOUNTS ONLY ⬥ <Link to="/" className="text-[#C8E650] hover:underline">BACK TO HOME</Link>
        </p>
      </motion.div>

      {/* Not business notification toast */}
      <AnimatePresence>
        {showNotBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 60, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 left-1/2 z-50 bg-card border-2 border-[#E85D4A] px-6 py-4 flex items-center gap-4 shadow-2xl"
            style={{ boxShadow: '0 0 30px rgba(232, 93, 74, 0.3)' }}
          >
            <div className="w-10 h-10 border-2 border-[#E85D4A]/60 bg-[#E85D4A]/10 flex items-center justify-center text-xl flex-shrink-0">
              🚫
            </div>
            <div>
              <p className="font-pixel text-[8px] text-[#E85D4A] tracking-wide mb-1">
                ACCESS DENIED
              </p>
              <p className="font-body text-sm text-muted-foreground">
                This account is not a business account. Only business accounts can access the admin panel.
              </p>
            </div>
            <button
              onClick={() => setShowNotBusiness(false)}
              className="font-pixel text-[8px] text-muted-foreground hover:text-foreground ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

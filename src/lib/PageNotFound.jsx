import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PageNotFound() {
  const { t } = useTranslation();
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const original = t('landing.notFound.gameOver');
  const [glitchText, setGlitchText] = useState(original);

  // Glitch text effect
  useEffect(() => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let interval;
    let count = 0;

    interval = setInterval(() => {
      count++;
      if (count > 20) {
        setGlitchText(original);
        clearInterval(interval);
        return;
      }
      const glitched = original.split('').map((char, i) => {
        if (i < count / 2) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      setGlitchText(glitched);
    }, 80);

    return () => clearInterval(interval);
  }, [original]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0912 0%, #0c0b16 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E85D4A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-px h-16 bg-[#E85D4A]/30" />
      <div className="absolute top-8 left-8 w-16 h-px bg-[#E85D4A]/30" />
      <div className="absolute bottom-8 right-8 w-px h-16 bg-[#E85D4A]/30" />
      <div className="absolute bottom-8 right-8 w-16 h-px bg-[#E85D4A]/30" />

      {/* CRT scanline */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center relative z-10"
      >
        {/* 404 number */}
        <div className="mb-8">
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="font-pixel text-[5rem] sm:text-[7rem] leading-none glitch-text"
            style={{
              color: '#E85D4A',
              textShadow: '0 0 30px #E85D4A, 0 0 60px #E85D4A66, 0 0 120px #E85D4A33, 3px 0 #00E5FF44, -3px 0 #FF00E544',
            }}
          >
            404
          </motion.p>
        </div>

        {/* GAME OVER */}
        <h1 className="font-pixel text-[clamp(1rem,4vw,1.5rem)] text-foreground mb-4 tracking-wider"
          style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}
        >
          {glitchText}
        </h1>

        {/* Description */}
        <div className="crt-card p-5 mb-8 text-left">
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="font-pixel text-[6px] text-muted-foreground/40 tracking-widest">ERROR_LOG.txt</span>
            <span className="w-1.5 h-1.5 bg-[#E85D4A] animate-pulse" style={{ boxShadow: '0 0 4px #E85D4A' }} />
          </div>
          <p className="font-pixel text-[7px] text-[#E85D4A] mb-2 tracking-wider relative z-10" style={{ textShadow: '0 0 6px #E85D4A66' }}>
            {t('landing.notFound.errorTitle')}
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed relative z-10">
            {t('landing.notFound.errorDescStart')} <span className="font-pixel text-[8px] text-[#00E5FF]" style={{ textShadow: '0 0 6px #00E5FF66' }}>/{pageName}</span> {t('landing.notFound.errorDescEnd')}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-[#E85D4A] text-white px-6 py-3 font-pixel text-[9px] tracking-wider hover:bg-[#d44d3a] transition-all arcade-btn text-center"
            style={{ boxShadow: '0 3px 0 0 #9d3324, 0 0 16px rgba(232,93,74,0.3)' }}
          >
            {t('landing.notFound.returnHome')}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full border-2 border-border text-muted-foreground px-6 py-3 font-pixel text-[9px] tracking-wider hover:border-[#C8E650]/50 hover:text-[#C8E650] transition-all text-center"
          >
            {t('landing.notFound.goBack')}
          </button>
        </div>

        {/* Blinking prompt */}
        <p className="font-pixel text-[7px] text-muted-foreground/40 mt-10">
          <span className="text-[#C8E650]">▸</span> {t('landing.notFound.prompt')}<span className="blink">█</span>
        </p>
      </motion.div>
    </div>
  );
}
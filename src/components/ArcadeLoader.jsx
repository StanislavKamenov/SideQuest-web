import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ArcadeLoader — Premium arcade boot-up loading screen.
 * Shows "INSERT COIN" → "LOADING SIDEQUEST..." with pixel progress.
 */
export default function ArcadeLoader({ isLoading = true, minDuration = 1200 }) {
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INSERT COIN');

  useEffect(() => {
    if (!isLoading && progress >= 100) {
      // Small delay before hiding for smooth transition
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  // Simulated progress
  useEffect(() => {
    const messages = [
      { at: 0, text: 'INSERT COIN' },
      { at: 15, text: 'INITIALIZING...' },
      { at: 35, text: 'LOADING ASSETS...' },
      { at: 55, text: 'CONNECTING...' },
      { at: 75, text: 'PREPARING ARCADE...' },
      { at: 90, text: 'ALMOST READY...' },
      { at: 100, text: 'PRESS START' },
    ];

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const targetProgress = Math.min((elapsed / minDuration) * 100, isLoading ? 90 : 100);

      setProgress(prev => {
        const next = Math.min(prev + 2, targetProgress);
        // Update status text
        const msg = messages.filter(m => m.at <= next).pop();
        if (msg) setStatusText(msg.text);
        return next;
      });

      if (!isLoading && progress >= 100) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isLoading, minDuration]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#0a0912' }}
        >
          {/* CRT scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1
                className="font-pixel text-[clamp(0.8rem,3vw,1.3rem)] tracking-wide"
                style={{
                  color: '#E85D4A',
                  textShadow: '0 0 20px #E85D4A, 0 0 40px #E85D4A66, 0 0 80px #E85D4A33',
                }}
              >
                SIDEQUEST
              </h1>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 mx-auto mb-4">
              <div
                className="h-1 border border-[#E85D4A]/30"
                style={{ backgroundColor: '#0d0d0d' }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: '#E85D4A',
                    boxShadow: '0 0 8px #E85D4A, 0 0 16px #E85D4A66',
                    transition: 'width 0.1s ease-out',
                  }}
                />
              </div>
            </div>

            {/* Status text */}
            <p
              className="font-pixel text-[7px] tracking-widest"
              style={{
                color: progress >= 100 ? '#C8E650' : '#E85D4A',
                textShadow: progress >= 100
                  ? '0 0 8px #C8E650'
                  : '0 0 8px #E85D4A66',
              }}
            >
              {statusText}
              {progress < 100 && <span className="blink">_</span>}
            </p>

            {/* Percentage */}
            <p className="font-pixel text-[6px] text-muted-foreground mt-2 tracking-wider">
              {Math.floor(progress)}%
            </p>
          </div>

          {/* Bottom credit */}
          <div className="absolute bottom-8 font-pixel text-[6px] text-muted-foreground/40 tracking-widest">
            © 2026 SIDEQUEST ARCADE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

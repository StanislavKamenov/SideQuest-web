import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';

function PixelStars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.7 ? 3 : 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute bg-white animate-pulse-glow"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 relative pixel-grid overflow-hidden">
      <PixelStars />

      {/* corner decorations */}
      <div className="absolute top-20 left-4 w-px h-16 bg-[#E85D4A]/30" />
      <div className="absolute top-20 left-4 w-16 h-px bg-[#E85D4A]/30" />
      <div className="absolute top-20 right-4 w-px h-16 bg-[#C8E650]/30" />
      <div className="absolute top-20 right-4 w-16 h-px bg-[#C8E650]/30" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* INSERT COIN */}
            <div className="inline-flex items-center gap-2 border border-[#C8E650]/40 px-3 py-1.5 mb-8">
              {/* <span className="w-2 h-2 bg-[#C8E650] animate-pulse" /> */}
              <span className="font-pixel text-[8px] text-[#C8E650] tracking-widest">PROVE THAT YOU ARE FEARLESS!</span>
            </div>

            <h1 className="font-pixel leading-relaxed mb-8">
              <span className="block text-[clamp(1.1rem,3.5vw,2rem)] text-foreground glow-red mb-2">SideQuest</span>
              <span className="block text-[clamp(0.55rem,1.8vw,0.9rem)] text-[#C8E650] glow-lime tracking-wide">
                TURN YOUR LIFE INTO A GAME
              </span>
            </h1>

            <p className="font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-md border-l-2 border-[#E85D4A]/50 pl-4">
              Complete real-world missions. Train, connect with people, learn new things.
              Earn XP for actions done far away from your phone.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mb-8">
              {[
                { value: '3', label: 'MISSION TYPES' },
                { value: '5', label: 'RANKS' },
                { value: '∞', label: 'XP' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-pixel text-xl text-[#E85D4A] glow-red">{s.value}</p>
                  <p className="font-pixel text-[7px] text-muted-foreground mt-1 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Download CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-foreground text-background px-5 py-3 hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="font-pixel text-[6px] opacity-70 tracking-wider">DOWNLOAD ON THE</p>
                  <p className="font-pixel text-[10px] tracking-wide">APP STORE</p>
                </div>
              </a>
              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border-2 border-foreground/80 text-foreground px-5 py-3 hover:border-foreground transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l.12-.04L13.64 14 10 10.37l-6.82 12.5c-.1.28-.1.6 0 .89zM20.54 10.4l-2.96-1.7-3.9 3.56 3.89 3.89 3-1.73c.85-.49.85-1.52-.03-2.02zM2.1.28C1.9.5 1.78.84 1.78 1.26v21.47c0 .42.12.76.33.98L2.2 23.8l12.04-12.04v-.3L2.2.2l-.1.08zM13.64 10l-10.46-9.8-.12-.04c-.35-.04-.69.03-.99.2-.08.29-.08.61.01.89L13.64 14l.01-.01L13.64 10z" />
                </svg>
                <div>
                  <p className="font-pixel text-[6px] opacity-70 tracking-wider">GET IT ON</p>
                  <p className="font-pixel text-[10px] tracking-wide">GOOGLE PLAY</p>
                </div>
              </a>
            </div>

            {/* Blinking prompt */}
            <p className="font-pixel text-[8px] text-muted-foreground mt-4">
              PRESS START{cursor ? '_' : ' '}
            </p>
          </motion.div>

          {/* Right — Phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
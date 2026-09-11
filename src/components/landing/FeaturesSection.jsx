import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', title: 'REAL MISSIONS', desc: 'Health, social life, and mind. Concrete actions — not abstract goals.', color: '#E85D4A', id: 'SYS_001' },
  { icon: '📸', title: 'PROOF REQUIRED', desc: 'Photo or video confirmation. No self-deception — honesty is mandatory.', color: '#6B9FD4', id: 'SYS_002' },
  { icon: '🗺️', title: 'LIVE MAP', desc: 'Active missions and hotspots near you in real time.', color: '#7BC67E', id: 'SYS_003' },
  { icon: '🏆', title: 'XP & LEADERBOARD', desc: 'Earn experience and climb from Recruit to Legend.', color: '#C8E650', id: 'SYS_004' },
  { icon: '👥', title: 'SQUAD MODE', desc: 'Invite friends and complete challenges together.', color: '#D47BA8', id: 'SYS_005' },
  { icon: '📊', title: 'PROFILE', desc: 'Full history, stats and achievements in one place.', color: '#E8956A', id: 'SYS_006' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative"
      style={{ background: 'linear-gradient(180deg, rgba(10,9,18,0.9) 0%, rgba(12,11,22,0.9) 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-[#E85D4A]/30 px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 bg-[#E85D4A] animate-pulse" style={{ boxShadow: '0 0 6px #E85D4A' }} />
            <span className="font-pixel text-[7px] text-[#E85D4A] tracking-widest">SYSTEM FEATURES</span>
          </div>
          <h2 className="font-pixel text-[clamp(0.7rem,2.5vw,1.2rem)] text-foreground mb-4 leading-relaxed"
            style={{ textShadow: '0 0 20px #E85D4A88' }}
          >
            FEATURES
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Everything you need to turn everyday habits into a systematic change.
          </p>
        </motion.div>

        {/* Grid — CRT monitor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="crt-card p-6 hover:border-opacity-80 transition-all group tilt-card"
              style={{
                borderColor: f.color + '33',
              }}
            >
              {/* Terminal header bar */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[6px] text-muted-foreground/50 tracking-widest">{f.id}</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: f.color + '44' }} />
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: f.color + '66' }} />
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: f.color }} />
                </div>
              </div>

              {/* Icon box */}
              <div
                className="w-14 h-14 flex items-center justify-center text-2xl mb-4 border-2 relative z-10"
                style={{
                  borderColor: f.color + '44',
                  backgroundColor: f.color + '0a',
                  boxShadow: `0 0 16px ${f.color}22, inset 0 0 12px ${f.color}11`,
                }}
              >
                {f.icon}
              </div>

              {/* Content */}
              <h3 className="font-pixel text-[9px] text-foreground mb-3 tracking-wide leading-relaxed relative z-10"
                style={{ textShadow: `0 0 10px ${f.color}88` }}>
                {f.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed relative z-10">{f.desc}</p>

              {/* Bottom neon accent */}
              <div className="h-[2px] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10"
                style={{
                  background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                  boxShadow: `0 0 8px ${f.color}66`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
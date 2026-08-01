import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', title: 'REAL MISSIONS', desc: 'Health, social life, and mind. Concrete actions — not abstract goals.', color: '#E85D4A' },
  { icon: '📸', title: 'PROOF REQUIRED', desc: 'Photo or video confirmation. No self-deception — honesty is mandatory.', color: '#6B9FD4' },
  { icon: '🗺️', title: 'LIVE MAP', desc: 'Active missions and hotspots near you in real time.', color: '#7BC67E' },
  { icon: '🏆', title: 'XP & LEADERBOARD', desc: 'Earn experience and climb from Recruit to Legend.', color: '#C8E650' },
  { icon: '👥', title: 'SQUAD MODE', desc: 'Invite friends and complete challenges together.', color: '#D47BA8' },
  { icon: '📊', title: 'PROFILE', desc: 'Full history, stats and achievements in one place.', color: '#E8956A' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative pixel-grid">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-pixel text-[clamp(0.7rem,2.5vw,1.2rem)] text-foreground glow-red mb-4 leading-relaxed">
            FEATURES
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Everything you need to turn everyday habits into a systematic change.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border p-6 hover:border-[#E85D4A]/50 transition-all group"
              style={{ '--feat-color': f.color }}
            >
              {/* Pixel icon box */}
              <div
                className="w-12 h-12 flex items-center justify-center text-2xl mb-4 border-2"
                style={{ borderColor: f.color + '66', backgroundColor: f.color + '11' }}
              >
                {f.icon}
              </div>
              <h3 className="font-pixel text-[9px] text-foreground mb-3 tracking-wide leading-relaxed"
                style={{ textShadow: `0 0 8px ${f.color}88` }}>
                {f.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              {/* Bottom accent line */}
              <div className="h-px mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: f.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
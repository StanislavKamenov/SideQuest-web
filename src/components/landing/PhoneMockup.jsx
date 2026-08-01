import React from 'react';
import { motion } from 'framer-motion';

function AppScreen() {
  return (
    <div className="w-full h-full bg-[#0C0B0A] rounded-[36px] overflow-hidden flex flex-col text-white">
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2">
        <span className="text-[11px] font-semibold text-white/70">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end">
            <div className="w-1 h-2 bg-white/70 rounded-sm" />
            <div className="w-1 h-3 bg-white/70 rounded-sm" />
            <div className="w-1 h-4 bg-white/70 rounded-sm" />
            <div className="w-1 h-[18px] bg-white/70 rounded-sm" />
          </div>
          <div className="w-6 h-3 border border-white/50 rounded-sm relative">
            <div className="absolute left-0.5 top-0.5 bottom-0.5 w-[70%] bg-[#C8E650] rounded-[2px]" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-2 pb-3 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-white/50">Good morning,</p>
            <p className="text-base font-bold">Player 👋</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#E85D4A] flex items-center justify-center text-xs font-bold">SK</div>
      </div>

      {/* XP Bar */}
      <div className="mx-6 mb-4 bg-[#1D1C1A] rounded-xl p-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Explorer</span>
          <span className="text-[11px] font-bold text-[#C8E650]">2,400 XP</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full">
          <div className="h-full w-[62%] bg-gradient-to-r from-[#E85D4A] to-[#C8E650] rounded-full" />
        </div>
        <p className="text-[10px] text-white/30 mt-1">960 XP to Warrior</p>
      </div>

      {/* Missions */}
      <div className="px-6 mb-3">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[12px] font-semibold text-white/60 uppercase tracking-wide">Active Missions</p>
          <span className="text-[11px] text-[#E85D4A] font-semibold">Виж всички</span>
        </div>
        <div className="space-y-2.5">
          {[
            { icon: '🏃', label: 'Morning Run', xp: '+80 XP', color: '#E85D4A', prog: '75%' },
            { icon: '📚', label: 'Read 20 pages', xp: '+50 XP', color: '#6B9FD4', prog: '30%' },
            { icon: '☕', label: 'Coffee with friend', xp: '+60 XP', color: '#7BC67E', prog: '0%' },
          ].map(m => (
            <div key={m.label} className="bg-[#1D1C1A] rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: `${m.color}22` }}>
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-semibold truncate">{m.label}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-2 flex-shrink-0"
                    style={{ color: m.color, backgroundColor: `${m.color}22` }}>{m.xp}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full">
                  <div className="h-full rounded-full" style={{ width: m.prog, backgroundColor: m.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mt-auto bg-[#141312] border-t border-white/5 flex justify-around items-center py-3 px-4">
        {[
          { emoji: '🏠', label: 'Home', active: true },
          { emoji: '🗺️', label: 'Map' },
          { emoji: '⚡', label: 'Missions' },
          { emoji: '🏆', label: 'Rank' },
          { emoji: '👤', label: 'Profile' },
        ].map(tab => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5">
            <span className="text-base">{tab.emoji}</span>
            <span className={`text-[9px] font-medium ${tab.active ? 'text-[#E85D4A]' : 'text-white/30'}`}>{tab.label}</span>
            {tab.active && <div className="w-1 h-1 rounded-full bg-[#E85D4A]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <div className="relative">
      {/* Neon glow behind phone */}
      <div className="absolute inset-0 bg-[#E85D4A]/15 blur-3xl rounded-full scale-75 translate-y-8" />
      <div className="absolute inset-0 bg-[#C8E650]/8 blur-2xl rounded-full scale-50 -translate-y-4" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Scanline on phone too */}
        <div className="w-[280px] h-[580px] rounded-[44px] bg-[#1a1a1a] p-2.5"
          style={{ boxShadow: '0 0 40px #E85D4A33, 0 0 80px #E85D4A11, 0 30px 60px rgba(0,0,0,0.7)' }}>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-10" />
          <div className="w-full h-full rounded-[36px] overflow-hidden">
            <AppScreen />
          </div>
        </div>
      </motion.div>

      {/* Floating XP badge */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-4 top-16 bg-[#0C0B0A] border border-[#E85D4A]/60 px-3 py-2"
        style={{ boxShadow: '0 0 12px #E85D4A44' }}
      >
        <p className="font-pixel text-[9px] text-[#E85D4A]">+80 XP</p>
        <p className="font-pixel text-[7px] text-white/50 mt-0.5">MISSION!</p>
      </motion.div>

      {/* Floating rank badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-6 bottom-24 bg-[#0C0B0A] border border-[#C8E650]/60 px-3 py-2"
        style={{ boxShadow: '0 0 12px #C8E65044' }}
      >
        <p className="font-pixel text-[8px] text-[#C8E650]">EXPLORER</p>
        <p className="font-pixel text-[7px] text-white/40 mt-0.5">RANK ACHIEVED</p>
      </motion.div>
    </div>
  );
}
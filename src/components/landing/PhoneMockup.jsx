import React from 'react';
import { motion } from 'framer-motion';
import screenshot from '../../assets/screenshot.png';

export default function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E85D4A]/20 to-[#C8E650]/10 blur-[80px] rounded-full scale-75" />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* iPhone 15 Pro Frame */}
        <div
          className="w-[280px] h-[600px] rounded-[50px] bg-[#0d0d0d] p-[10px] relative"
          style={{
            boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2), inset 0 4px 10px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(232, 93, 74, 0.15)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Hardware buttons */}
          <div className="absolute -left-[3px] top-[100px] w-[3px] h-[24px] bg-[#222] rounded-l-md" />
          <div className="absolute -left-[3px] top-[140px] w-[3px] h-[40px] bg-[#222] rounded-l-md" />
          <div className="absolute -left-[3px] top-[190px] w-[3px] h-[40px] bg-[#222] rounded-l-md" />
          <div className="absolute -right-[3px] top-[160px] w-[3px] h-[60px] bg-[#222] rounded-r-md" />

          {/* Screen */}
          <div className="w-full h-full rounded-[40px] overflow-hidden relative border border-white/5"
            style={{ backgroundColor: '#080820' }}
          >

            {/* ── iPhone Status Bar (overlay on top of screenshot) ── */}
            {/* ── iPhone Status Bar ── */}
            <div className="absolute top-0 left-0 w-full h-[44px] z-30 flex items-center justify-between px-6 pt-[6px]"
              style={{ background: 'linear-gradient(to bottom, #080820 50%, rgba(8,8,32,0.5) 80%, transparent 100%)' }}
            >
              {/* Left: Time — vertically centered with Dynamic Island */}
              <div className="flex-1 flex justify-start pl-2">
                <span className="text-white text-[11px] font-semibold tracking-tight mt-[1px]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  9:41
                </span>
              </div>

              {/* Center: Dynamic Island */}
              <div className="w-[84px] h-[24px] bg-black rounded-full flex items-center justify-between px-2 shrink-0 mx-auto"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }}
              >
                <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a2e]" />
                <div className="w-[8px] h-[8px] rounded-full bg-[#0a0a15] border border-white/[0.03] relative">
                  <div className="absolute top-[1px] right-[1px] w-[2px] h-[2px] bg-[#2040aa]/40 rounded-full" />
                </div>
              </div>

              {/* Right: Signal + Wifi + Battery — vertically centered with Dynamic Island */}
              <div className="flex-1 flex ml-[1rem] justify-end items-center gap-[4px] mt-[1px] pr-0">
                {/* Cellular signal bars */}
                <div className="flex items-end gap-[1px]">
                  <div className="w-[2.5px] h-[2.5px] bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[4px] bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[5.5px] bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[7px] bg-white rounded-[0.5px]" />
                </div>
                {/* Wifi */}
                <svg className="w-[11px] h-[11px] text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-3.18-2.12a.75.75 0 011.06 0A3.22 3.22 0 008 9.5c.82 0 1.6.32 2.12.88a.75.75 0 101.06-1.06A4.72 4.72 0 008 8a4.72 4.72 0 00-3.18 1.32.75.75 0 000 1.06zm-2.47-2.5a.75.75 0 011.06 0A6.46 6.46 0 008 6a6.46 6.46 0 004.59 1.88.75.75 0 101.06-1.06A7.96 7.96 0 008 4.5a7.96 7.96 0 00-5.65 2.32.75.75 0 000 1.06z" />
                </svg>
                {/* Battery */}
                <div className="flex items-center">
                  <div className="w-[16px] h-[7.5px] border border-white/60 rounded-[2px] p-[1px] relative">
                    <div className="w-full h-full bg-white rounded-[0.5px]" />
                  </div>
                  <div className="w-[1px] h-[3px] bg-white/40 rounded-r-full ml-[0.5px]" />
                </div>
              </div>
            </div>

            {/* ── App Screenshot ── 
                 object-contain ensures the ENTIRE image is visible (no cropping).
                 Background color matches the app's dark theme so no gaps are visible. */}
            <img
              src={screenshot}
              alt="SideQuest App"
              className="absolute left-0 w-full h-full object-contain"
              style={{ top: '20px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback */}
            <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4 bg-[#0C0B0A]">
              <span className="text-[#E85D4A] mb-2 text-2xl">⚠️</span>
              <p className="text-white/70 text-sm font-pixel leading-relaxed">Снимката липсва</p>
              <p className="text-white/40 text-[10px] mt-2 leading-relaxed">Добави screenshot.png<br />в src/assets/</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating XP Badge ── far right, clear of the phone */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-36 md:-right-52 top-20 bg-black/70 backdrop-blur-md border border-[#E85D4A]/40 pl-3 pr-4 py-2.5 rounded-2xl flex items-center gap-3 z-30"
        style={{ boxShadow: '0 8px 32px rgba(232, 93, 74, 0.25)' }}
      >
        <div className="w-8 h-8 rounded-full bg-[#E85D4A]/20 flex items-center justify-center border border-[#E85D4A]/30 text-[#E85D4A] text-sm shadow-[0_0_10px_rgba(232,93,74,0.3)] shrink-0">
          ⚡
        </div>
        <div>
          <p className="font-pixel text-[11px] text-[#E85D4A] leading-tight">+80 XP</p>
          <p className="font-pixel text-[7px] text-white/50 mt-1.5 leading-tight tracking-wider">MISSION COMPLETE!</p>
        </div>
      </motion.div>

      {/* ── Floating Rank Badge ── far left, clear of the phone */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-36 md:-left-44 bottom-28 bg-black/70 backdrop-blur-md border border-[#C8E650]/40 pl-3 pr-4 py-2.5 rounded-2xl flex items-center gap-3 z-30"
        style={{ boxShadow: '0 8px 32px rgba(200, 230, 80, 0.2)' }}
      >
        <div className="w-8 h-8 rounded-full bg-[#C8E650]/20 flex items-center justify-center border border-[#C8E650]/30 text-[#C8E650] text-sm shadow-[0_0_10px_rgba(200,230,80,0.3)] shrink-0">
          🏆
        </div>
        <div>
          <p className="font-pixel text-[11px] text-[#C8E650] leading-tight">EXPLORER</p>
          <p className="font-pixel text-[7px] text-white/50 mt-1.5 leading-tight tracking-wider">RANK ACHIEVED</p>
        </div>
      </motion.div>
    </div>
  );
}
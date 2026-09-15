import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MarqueeBar() {
  const { t } = useTranslation();

  const items = [
    `★ ${t('landing.marquee.realMissions')}`, `◆ ${t('landing.marquee.xpSystem')}`, `★ ${t('landing.marquee.squadMode')}`, `◆ ${t('landing.marquee.liveMap')}`,
    `★ ${t('landing.marquee.proofRequired')}`, `◆ ${t('landing.marquee.ranks')}`, `★ ${t('landing.marquee.realMissions')}`, `◆ ${t('landing.marquee.xpSystem')}`,
    `★ ${t('landing.marquee.squadMode')}`, `◆ ${t('landing.marquee.liveMap')}`, `★ ${t('landing.marquee.proofRequired')}`, `◆ ${t('landing.marquee.ranks')}`,
  ];

  return (
    <div className="relative py-3 overflow-hidden border-y-2 border-[#E85D4A]/60"
      style={{
        background: 'linear-gradient(90deg, #E85D4A, #d44d3a, #E85D4A)',
        boxShadow: '0 0 30px #E85D4A44, inset 0 0 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />

      {/* Marquee content */}
      <div className="flex whitespace-nowrap marquee-inner relative z-10">
        {items.map((item, i) => (
          <span key={i} className="font-pixel text-[8px] text-white mx-6 tracking-wider flex-shrink-0"
            style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Edge fade gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-16 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #E85D4A, transparent)' }}
      />
      <div className="absolute top-0 right-0 bottom-0 w-16 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, #E85D4A, transparent)' }}
      />
    </div>
  );
}
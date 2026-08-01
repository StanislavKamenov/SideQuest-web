import React from 'react';

const items = [
  '★ REAL MISSIONS', '◆ XP SYSTEM', '★ SQUAD MODE', '◆ LIVE MAP',
  '★ PROOF REQUIRED', '◆ 5 RANKS', '★ REAL MISSIONS', '◆ XP SYSTEM',
  '★ SQUAD MODE', '◆ LIVE MAP', '★ PROOF REQUIRED', '◆ 5 RANKS',
];

export default function MarqueeBar() {
  return (
    <div className="bg-[#E85D4A] py-2.5 overflow-hidden border-y-2 border-[#E85D4A]"
      style={{ boxShadow: '0 0 20px #E85D4A66' }}>
      <div className="flex whitespace-nowrap marquee-inner">
        {items.map((item, i) => (
          <span key={i} className="font-pixel text-[9px] text-white mx-6 tracking-wider flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
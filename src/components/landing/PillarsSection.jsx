import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PillarsSection() {
  const { t } = useTranslation();

  const pillars = [
    { icon: '💪', label: t('landing.pillars.items.body.title'), color: '#E85D4A', desc: t('landing.pillars.items.body.desc'), cmd: 'SELECT_BODY.exe' },
    { icon: '🤝', label: t('landing.pillars.items.social.title'), color: '#6B9FD4', desc: t('landing.pillars.items.social.desc'), cmd: 'SELECT_SOCIAL.exe' },
    { icon: '🧠', label: t('landing.pillars.items.mind.title'), color: '#C8E650', desc: t('landing.pillars.items.mind.desc'), cmd: 'SELECT_MIND.exe' },
  ];

  return (
    <section className="py-6 border-y-2 border-border relative"
      style={{ background: 'linear-gradient(180deg, rgba(12,11,22,0.95) 0%, rgba(10,9,18,0.95) 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="font-pixel text-[7px] text-muted-foreground/60 tracking-widest">
            ▸ {t('landing.pillars.title')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="crt-card p-6 group hover:border-opacity-80 transition-all tilt-card"
              style={{
                borderColor: p.color + '33',
                '--tw-shadow-color': p.color,
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }}
                  />
                  <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">
                    {p.cmd}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30" />
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: p.color + '66' }} />
                </div>
              </div>

              {/* Content */}
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className="text-3xl flex-shrink-0 mt-1 w-14 h-14 flex items-center justify-center border-2"
                  style={{
                    borderColor: p.color + '44',
                    backgroundColor: p.color + '0a',
                    boxShadow: `inset 0 0 12px ${p.color}11`,
                  }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-pixel text-[11px] mb-2 tracking-wide"
                    style={{ color: p.color, textShadow: `0 0 12px ${p.color}88` }}>
                    {p.label}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>

              {/* Bottom neon line */}
              <div className="h-[2px] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10"
                style={{
                  background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                  boxShadow: `0 0 8px ${p.color}66`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
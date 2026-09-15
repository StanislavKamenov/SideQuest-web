import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';

function AppStoreBadge() {
  const { t } = useTranslation();
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-3.5 hover:opacity-90 transition-all arcade-btn"
    >
      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div>
        <p className="font-pixel text-[6px] opacity-60 tracking-widest mb-0.5">{t('landing.footer.downloadApple')}</p>
        <p className="font-pixel text-[11px] tracking-wide">{t('landing.footer.appStore')}</p>
      </div>
    </a>
  );
}

function GooglePlayBadge() {
  const { t } = useTranslation();
  return (
    <a
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 border-2 border-foreground/70 text-foreground px-6 py-3.5 hover:border-foreground hover:bg-foreground/5 transition-all"
      style={{ boxShadow: '0 2px 0 0 rgba(0,0,0,0.3)' }}
    >
      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.18 23.76c.3.17.64.24.99.2l.12-.04L13.64 14 10 10.37l-6.82 12.5c-.1.28-.1.6 0 .89zM20.54 10.4l-2.96-1.7-3.9 3.56 3.89 3.89 3-1.73c.85-.49.85-1.52-.03-2.02zM2.1.28C1.9.5 1.78.84 1.78 1.26v21.47c0 .42.12.76.33.98L2.2 23.8l12.04-12.04v-.3L2.2.2l-.1.08zM13.64 10l-10.46-9.8-.12-.04c-.35-.04-.69.03-.99.2-.08.29-.08.61.01.89L13.64 14l.01-.01L13.64 10z" />
      </svg>
      <div>
        <p className="font-pixel text-[6px] opacity-60 tracking-widest mb-0.5">{t('landing.footer.downloadGoogle')}</p>
        <p className="font-pixel text-[11px] tracking-wide">{t('landing.footer.googlePlay')}</p>
      </div>
    </a>
  );
}

export default function FooterCTA() {
  const { t } = useTranslation();
  return (
    <>
      {/* CTA Section — "INSERT COIN TO CONTINUE" */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(12,11,22,0.95) 0%, rgba(10,9,18,0.98) 100%)' }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E85D4A]/8 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C8E650]/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 md:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Flashing badge */}
            <div className="inline-flex items-center gap-2 border border-[#C8E650]/50 px-4 py-2 mb-8 neon-border-pulse"
              style={{ borderColor: 'rgba(200,230,80,0.5)' }}
            >
              <span className="w-2 h-2 bg-[#C8E650] animate-pulse" style={{ boxShadow: '0 0 8px #C8E650' }} />
              <span className="font-pixel text-[8px] text-[#C8E650] tracking-widest glow-lime">
                {t('landing.footer.badge')}
              </span>
              <span className="w-2 h-2 bg-[#C8E650] animate-pulse" style={{ boxShadow: '0 0 8px #C8E650' }} />
            </div>

            {/* Big arcade CTA */}
            <h2 className="font-pixel leading-relaxed mb-4">
              <span className="block text-[clamp(1rem,3.5vw,1.8rem)] text-foreground mb-3"
                style={{ textShadow: '0 0 20px #E85D4A, 0 0 40px #E85D4A66' }}
              >
                {t('landing.footer.title')}
              </span>
              <span className="block text-[clamp(0.55rem,1.8vw,0.9rem)] text-[#C8E650]"
                style={{ textShadow: '0 0 15px #C8E650, 0 0 30px #C8E65066' }}
              >
                {t('landing.footer.subtitle')}
              </span>
            </h2>

            {/* Coin counter */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="crt-card px-4 py-2 inline-flex items-center gap-2">
                <span className="font-pixel text-[16px] relative z-10" style={{ color: '#FFD700', textShadow: '0 0 12px #FFD700' }}>
                  🪙
                </span>
                <span className="font-pixel text-[9px] text-[#C8E650] relative z-10"
                  style={{ textShadow: '0 0 8px #C8E650' }}>
                  {t('landing.footer.credits')}
                </span>
              </div>
            </div>

            <p className="font-body text-muted-foreground max-w-md mx-auto mb-10">
              {t('landing.footer.description')}
            </p>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Footer — Arcade floor */}
      <footer className="border-t-2 border-[#E85D4A]/20 relative"
        style={{ background: 'linear-gradient(180deg, #0c0b16 0%, #0a0912 100%)' }}
      >
        {/* Top neon line */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E85D4A66, transparent)' }}
        />

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  alt="SideQuest Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-pixel text-[11px] text-foreground"
                  style={{ textShadow: '0 0 15px #E85D4A88' }}
                >
                  SideQuest
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                {t('landing.footer.brandDesc')}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 animate-pulse" style={{ boxShadow: '0 0 6px #4ade80' }} />
                <span className="font-pixel text-[7px] text-green-400 glow-lime">{t('landing.footer.production')}</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-pixel text-[9px] text-[#E85D4A] mb-5 tracking-wider"
                style={{ textShadow: '0 0 8px #E85D4A66' }}
              >
                {t('landing.footer.product.title')}
              </h4>
              <ul className="space-y-3">
                {[
                  { label: t('landing.footer.product.features'), href: '#features' },
                  { label: t('landing.footer.product.howItWorks'), href: '#how-it-works' },
                  { label: t('landing.footer.product.leaderboard'), href: '#' },
                  { label: t('landing.footer.product.missionTypes'), href: '#' },
                ].map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="font-body text-sm text-muted-foreground hover:text-[#C8E650] transition-colors">
                      <span className="text-[#E85D4A]/50 mr-1">▸</span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download */}
            <div>
              <h4 className="font-pixel text-[9px] text-[#C8E650] mb-5 tracking-wider"
                style={{ textShadow: '0 0 8px #C8E65066' }}
              >
                {t('landing.footer.download.title')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-muted-foreground hover:text-[#C8E650] transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    {t('landing.footer.download.ios')}
                  </a>
                </li>
                <li>
                  <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-muted-foreground hover:text-[#C8E650] transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.76c.3.17.64.24.99.2l.12-.04L13.64 14 10 10.37l-6.82 12.5c-.1.28-.1.6 0 .89zM20.54 10.4l-2.96-1.7-3.9 3.56 3.89 3.89 3-1.73c.85-.49.85-1.52-.03-2.02zM2.1.28C1.9.5 1.78.84 1.78 1.26v21.47c0 .42.12.76.33.98L2.2 23.8l12.04-12.04v-.3L2.2.2l-.1.08zM13.64 10l-10.46-9.8-.12-.04c-.35-.04-.69.03-.99.2-.08.29-.08.61.01.89L13.64 14l.01-.01L13.64 10z" />
                    </svg>
                    {t('landing.footer.download.android')}
                  </a>
                </li>
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <h4 className="font-pixel text-[9px] text-[#6B9FD4] mb-5 tracking-wider"
                style={{ textShadow: '0 0 8px #6B9FD466' }}
              >
                {t('landing.footer.faq.title')}
              </h4>
              <ul className="space-y-3">
                {[
                  { label: t('landing.footer.faq.general'), to: '/faq' },
                  { label: t('landing.footer.faq.gameplay'), to: '/faq' },
                  { label: t('landing.footer.faq.security'), to: '/faq' },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-body text-sm text-muted-foreground hover:text-[#C8E650] transition-colors">
                      <span className="text-[#6B9FD4]/50 mr-1">▸</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)' }} />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-pixel text-[6px] text-muted-foreground/50 tracking-widest text-center">
              {t('landing.footer.copyright')}
            </p>
            <p className="font-pixel text-[6px] text-muted-foreground/30 tracking-wider">
              {t('landing.footer.build')}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
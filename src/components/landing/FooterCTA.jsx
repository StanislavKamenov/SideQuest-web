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

function KofiBadge() {
  return (
    <a
      href="https://ko-fi.com/sidequestapp"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-[#FF5E5B] text-white px-6 py-3.5 hover:bg-[#ff4f4c] transition-all arcade-btn"
      style={{ boxShadow: '0 3px 0 0 #cc4b49, 0 0 16px rgba(255,94,91,0.3)' }}
    >
      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.061-4.3-.037-.046-.045-.084-.011-.131.068-.113 1.341-2.079 3.031-2.188 1.644-.105 2.584 1.258 2.584 1.258s1.616-1.542 2.879-1.42c1.479.144 2.618 1.932 2.618 1.932.188.307.039.736-.011.831-.059.112-2.6 3.109-2.6 3.109zm8.563-1.782c-.281 1.761-1.787 2.083-2.686 2.052V6.36c1.085.031 2.396.16 3.18.98 1.056 1.107.561 2.973-.494 3.49z"/>
      </svg>
      <div className="text-left">
        <p className="font-pixel text-[6px] tracking-widest mb-0.5 text-white/90">BUY US A COFFEE</p>
        <p className="font-pixel text-[11px] tracking-wide" style={{ textShadow: '0 0 6px rgba(255,255,255,0.5)' }}>SUPPORT US</p>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2 flex-wrap">
              <AppStoreBadge />
              <GooglePlayBadge />
              <KofiBadge />
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
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-green-400 animate-pulse" style={{ boxShadow: '0 0 6px #4ade80' }} />
                <span className="font-pixel text-[7px] text-green-400 glow-lime">{t('landing.footer.production')}</span>
              </div>
              
              {/* Socials */}
              <div className="flex items-center gap-4">
                <a href="https://x.com/StanislavK34937" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="X (Twitter)">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@psidequestapp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.18.66-4.39 2.27-5.83 1.25-1.13 2.93-1.78 4.63-1.87v4.11c-1.04.09-2.05.57-2.73 1.34-.73.8-1.01 1.92-.85 2.99.19 1.1.92 2.06 1.89 2.51 1.05.5 2.28.53 3.35.15 1.22-.44 2.09-1.5 2.25-2.78.02-.17.03-.34.03-.51v-17.34H12.525z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/sidequest_play/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://discord.gg/fpnf4ZwAPu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Discord">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
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
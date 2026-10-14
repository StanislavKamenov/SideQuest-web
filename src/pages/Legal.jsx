import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import FooterCTA from '@/components/landing/FooterCTA';
import ArcadeScene from '@/components/landing/3d/ArcadeScene';
import AmbientArcade from '@/components/landing/3d/AmbientArcade';
import { LEGAL, OPERATOR, LAST_UPDATED } from '@/pages/legalContent';

function LegalPage({ kind }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('bg') ? 'bg' : 'en';
  const copy = LEGAL[lang];
  const doc = copy[kind];
  const other = kind === 'privacy' ? 'terms' : 'privacy';

  const hasContact = OPERATOR.name || OPERATOR.address || OPERATOR.email;

  return (
    <div className="min-h-screen bg-background relative">
      <ArcadeScene>
        <AmbientArcade color="#6B9FD4" />
      </ArcadeScene>

      <div className="relative z-10">
        <Navbar />

        <main className="pt-28 pb-20 max-w-3xl mx-auto px-5 md:px-8">
          <header className="text-center mb-12 py-10 crt-card border-2 border-border/60">
            <h1
              className="font-pixel text-[clamp(0.9rem,3.5vw,1.4rem)] text-foreground mb-4 tracking-wide"
              style={{ textShadow: '0 0 20px #E85D4A88' }}
            >
              {doc.title}
            </h1>
            <p className="font-pixel text-[7px] text-muted-foreground/60 tracking-widest">
              {copy.updatedLabel}: {LAST_UPDATED}
            </p>
          </header>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-10">{doc.intro}</p>

          {doc.sections.map((s) => (
            <section key={s.h} className="mb-9">
              <h2
                className="font-pixel text-[10px] text-[#C8E650] tracking-widest mb-4 pb-2 border-b border-border/50"
                style={{ textShadow: '0 0 10px #C8E65044' }}
              >
                {s.h}
              </h2>
              {s.p?.map((para) => (
                <p key={para} className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                  {para}
                </p>
              ))}
              {s.ul && (
                <ul className="space-y-2.5 mb-3">
                  {s.ul.map((item) => (
                    <li key={item} className="font-body text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-[#E85D4A]/70 shrink-0">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.after && (
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.after}</p>
              )}
            </section>
          ))}

          <section className="mb-9">
            <h2 className="font-pixel text-[10px] text-[#6B9FD4] tracking-widest mb-4 pb-2 border-b border-border/50">
              {copy.contactTitle}
            </h2>
            {hasContact && (
              <div className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                <p className="mb-1">{copy.contactLead}</p>
                {OPERATOR.name && <p className="text-foreground">{OPERATOR.name}</p>}
                {OPERATOR.address && <p>{OPERATOR.address}</p>}
                {OPERATOR.email && (
                  <p>
                    <a href={`mailto:${OPERATOR.email}`} className="text-[#C8E650] hover:underline">
                      {OPERATOR.email}
                    </a>
                  </p>
                )}
              </div>
            )}
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{copy.inApp}</p>
          </section>

          <Link
            to={`/${other}`}
            className="font-pixel text-[8px] tracking-widest text-[#6B9FD4] hover:text-[#C8E650] transition-colors"
          >
            ▸ {copy[other].title}
          </Link>
        </main>

        <FooterCTA />
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return <LegalPage kind="privacy" />;
}

export function TermsOfUse() {
  return <LegalPage kind="terms" />;
}

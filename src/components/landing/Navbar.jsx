import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import logo from '@/assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isBusiness } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'arcade-hud' : 'bg-transparent'
    }`}>
      {/* Top neon line */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #E85D4A66, #E85D4A, #E85D4A66, transparent)',
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={logo}
              alt="SideQuest Logo"
              className="w-10 h-10 object-contain relative z-10"
            />
            {/* Logo glow */}
            <div className="absolute inset-0 bg-[#E85D4A]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="font-pixel text-[11px] text-foreground tracking-tight hidden sm:block"
            style={{ textShadow: '0 0 15px #E85D4A88' }}
          >
            SIDE<span className="text-[#E85D4A]">QUEST</span>
          </span>
        </Link>

        {/* Desktop nav — arcade HUD style */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: '/#features', label: 'FEATURES' },
            { to: '/#how-it-works', label: 'HOW IT WORKS' },
            { to: '/proof', label: 'GALLERY' },
            { to: '/faq', label: 'FAQ' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-pixel text-[8px] text-muted-foreground hover:text-[#C8E650] transition-all tracking-wide px-3 py-2 relative group"
            >
              {/* Hover indicator */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C8E650] transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 6px #C8E650' }}
              />
              {label}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {/* Login / Dashboard */}
          {isAuthenticated && isBusiness ? (
            <Link
              to="/admin"
              className="font-pixel text-[8px] bg-[#C8E650] text-background px-4 py-2 hover:opacity-90 transition-all tracking-wide arcade-btn"
              style={{ boxShadow: '0 2px 0 0 #8fa030, 0 0 12px rgba(200,230,80,0.2)' }}
            >
              ⚙ DASHBOARD
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-pixel text-[8px] border-2 border-[#E85D4A] text-[#E85D4A] px-4 py-2 hover:bg-[#E85D4A] hover:text-white transition-all tracking-wide neon-border-pulse"
            >
              LOG IN
            </Link>
          )}

          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[8px] bg-foreground text-background px-4 py-2 hover:opacity-90 transition-all tracking-wide ml-1 arcade-btn"
            style={{ boxShadow: '0 2px 0 0 rgba(0,0,0,0.5), 0 0 12px rgba(255,255,255,0.1)' }}
          >
            ↓ DOWNLOAD
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-pixel text-[12px] text-[#E85D4A] p-2 border border-[#E85D4A]/30 hover:border-[#E85D4A]/60 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ textShadow: '0 0 8px #E85D4A' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu — arcade panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E85D4A]/20 px-5 pb-5 space-y-1"
          style={{
            background: 'linear-gradient(180deg, rgba(10,9,18,0.98) 0%, rgba(12,11,22,0.98) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Scan line decoration */}
          <div className="h-px my-2" style={{ background: 'linear-gradient(90deg, transparent, #E85D4A44, transparent)' }} />

          {[
            { to: '/#features', label: 'FEATURES' },
            { to: '/#how-it-works', label: 'HOW IT WORKS' },
            { to: '/proof', label: 'GALLERY' },
            { to: '/faq', label: 'FAQ' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block font-pixel text-[8px] text-muted-foreground py-3 px-3 hover:text-[#C8E650] hover:bg-[#C8E650]/5 transition-all border-b border-border/50"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-[#E85D4A] mr-2">▸</span>
              {label}
            </Link>
          ))}

          <div className="pt-3 space-y-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-pixel text-[8px] bg-foreground text-background px-4 py-3 text-center arcade-btn"
            >
              ↓ DOWNLOAD APP
            </a>

            {isAuthenticated && isBusiness ? (
              <Link
                to="/admin"
                className="block font-pixel text-[8px] bg-[#C8E650] text-background px-4 py-3 text-center arcade-btn"
                onClick={() => setMenuOpen(false)}
              >
                ⚙ DASHBOARD
              </Link>
            ) : (
              <Link
                to="/login"
                className="block font-pixel text-[8px] border-2 border-[#E85D4A] text-[#E85D4A] px-4 py-3 text-center hover:bg-[#E85D4A] hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}
              >
                LOG IN
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Bottom neon line */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #E85D4A33, #E85D4A66, #E85D4A33, transparent)',
          }}
        />
      )}
    </nav>
  );
}
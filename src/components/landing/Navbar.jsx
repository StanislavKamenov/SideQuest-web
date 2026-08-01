import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur border-b-2 border-[#E85D4A]/60' : 'bg-transparent'
      }`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="SideQuest Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-pixel text-[11px] text-foreground glow-red tracking-tight hidden sm:block">
            SIDE<span className="text-[#E85D4A]">QUEST</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/#features', label: 'FEATURES' },
            { to: '/#how-it-works', label: 'HOW IT WORKS' },
            { to: '/proof', label: 'GALLERY' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-pixel text-[9px] text-muted-foreground hover:text-[#C8E650] transition-colors tracking-wide"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[9px] bg-foreground text-background px-4 py-2.5 hover:opacity-90 transition-opacity tracking-wide"
          >
            ↓ DOWNLOAD
          </a>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden font-pixel text-[9px] text-[#E85D4A] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-b-2 border-[#E85D4A]/40 px-5 pb-5 space-y-4">
          <Link to="/#features" className="block font-pixel text-[9px] text-muted-foreground py-2 border-b border-border" onClick={() => setMenuOpen(false)}>FEATURES</Link>
          <Link to="/#how-it-works" className="block font-pixel text-[9px] text-muted-foreground py-2 border-b border-border" onClick={() => setMenuOpen(false)}>HOW IT WORKS</Link>
          <Link to="/proof" className="block font-pixel text-[9px] text-muted-foreground py-2 border-b border-border" onClick={() => setMenuOpen(false)}>GALLERY</Link>
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="block font-pixel text-[9px] bg-foreground text-background px-4 py-3 text-center">↓ DOWNLOAD</a>
        </div>
      )}
    </nav>
  );
}
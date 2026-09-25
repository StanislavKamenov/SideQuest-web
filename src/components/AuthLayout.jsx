import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import ArcadeScene from "@/components/landing/3d/ArcadeScene";
import AmbientArcade from "@/components/landing/3d/AmbientArcade";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* 3D Ambient Layer */}
      <ArcadeScene>
        <AmbientArcade color="#A663E0" />
      </ArcadeScene>

      {/* Corner decorations */}
      <div className="absolute top-20 left-8 w-px h-24 bg-[#A663E0]/20 z-10" />
      <div className="absolute top-20 left-8 w-24 h-px bg-[#A663E0]/20 z-10" />
      <div className="absolute bottom-20 right-8 w-px h-24 bg-[#C8E650]/20 z-10" />
      <div className="absolute bottom-20 right-8 w-24 h-px bg-[#C8E650]/20 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src={logo} alt="SideQuest" className="w-12 h-12 object-contain" />
            <span className="font-pixel text-[11px] text-foreground tracking-tight"
              style={{ textShadow: '0 0 15px #A663E088' }}
            >
              SIDE<span className="text-[#A663E0]">QUEST</span>
            </span>
          </Link>

          {/* Terminal badge */}
          <div className="inline-flex items-center gap-2 border border-[#A663E0]/40 px-3 py-1.5 mb-4 neon-border-pulse"
            style={{ borderColor: 'rgba(166,99,224,0.4)' }}
          >
            <span className="w-2 h-2 bg-[#A663E0] animate-pulse" style={{ boxShadow: '0 0 6px #A663E0' }} />
            <span className="font-pixel text-[7px] text-[#A663E0] tracking-widest">
              AUTH TERMINAL
            </span>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 border-2 border-[#A663E0]/40 bg-[#A663E0]/10 flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 20px rgba(166,99,224,0.15)' }}
          >
            <Icon className="w-7 h-7 text-[#A663E0]" aria-hidden="true" />
          </div>

          <h1 className="font-pixel text-[clamp(0.8rem,2.5vw,1.1rem)] text-foreground leading-relaxed mb-2"
            style={{ textShadow: '0 0 20px #A663E088' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Card — Arcade Terminal */}
        <div className="crt-card border-2 border-border p-8 relative">
          {/* Terminal header dots */}
          <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
            <span className="w-1.5 h-1.5 bg-[#E85D4A]" style={{ boxShadow: '0 0 4px #E85D4A' }} />
            <span className="w-1.5 h-1.5 bg-[#C8E650]" style={{ boxShadow: '0 0 4px #C8E650' }} />
            <span className="w-1.5 h-1.5 bg-[#6B9FD4]" style={{ boxShadow: '0 0 4px #6B9FD4' }} />
            <span className="font-pixel text-[5px] text-muted-foreground/30 ml-1 tracking-widest">AUTH_TERMINAL.exe</span>
          </div>

          <div className="relative z-10 pt-4">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <p className="text-center font-pixel text-[7px] text-muted-foreground mt-6 tracking-wide">
            {footer}
          </p>
        )}
      </motion.div>
    </div>
  );
}

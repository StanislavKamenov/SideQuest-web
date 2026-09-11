import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/landing/Navbar';
import MarqueeBar from '../components/landing/MarqueeBar';
import HeroSection from '../components/landing/HeroSection';
import PillarsSection from '../components/landing/PillarsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FooterCTA from '../components/landing/FooterCTA';
import ArcadeScene from '../components/landing/3d/ArcadeScene';
import HeroArcade from '../components/landing/3d/HeroArcade';
import useScrollProgress from '../components/landing/3d/hooks/useScrollProgress';
import useReducedMotion from '../components/landing/3d/hooks/useReducedMotion';

export default function Home() {
  const { progress: scrollProgress } = useScrollProgress();
  const reducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for camera parallax
  const handleMouseMove = useCallback((e) => {
    if (reducedMotion) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
  }, [reducedMotion]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Arcade World — fixed background */}
      <ArcadeScene>
        <HeroArcade
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
        />
      </ArcadeScene>

      {/* DOM Content — renders above the 3D world */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <MarqueeBar />
        <PillarsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FooterCTA />
      </div>
    </div>
  );
}
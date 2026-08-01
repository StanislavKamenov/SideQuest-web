import React from 'react';
import Navbar from '../components/landing/Navbar';
import MarqueeBar from '../components/landing/MarqueeBar';
import HeroSection from '../components/landing/HeroSection';
import PillarsSection from '../components/landing/PillarsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FooterCTA from '../components/landing/FooterCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MarqueeBar />
      <PillarsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FooterCTA />
    </div>
  );
}
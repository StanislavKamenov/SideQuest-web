import React from 'react';
import ArcadeEnvironment from './ArcadeEnvironment';
import NeonGrid from './NeonGrid';
import PixelParticles from './PixelParticles';
import useReducedMotion from './hooks/useReducedMotion';
import useDeviceCapability, { getParticleCount } from './hooks/useDeviceCapability';

/**
 * AmbientArcade — lighter 3D ambient layer for secondary pages.
 * Fewer elements than HeroArcade. Used on ProofFeed, FAQ, Login pages.
 */
export default function AmbientArcade({ color = '#E85D4A' }) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const particleCount = reducedMotion ? 0 : Math.floor(getParticleCount(tier) * 0.5);

  return (
    <>
      <ArcadeEnvironment scrollProgress={0} />
      <NeonGrid color={color} opacity={0.25} position={[0, -3, 0]} />
      {particleCount > 0 && (
        <PixelParticles count={particleCount} spread={15} />
      )}
    </>
  );
}

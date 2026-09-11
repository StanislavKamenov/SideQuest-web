import { useState, useEffect } from 'react';

/**
 * Detects device capability tier for adaptive 3D quality.
 * Returns 'high' | 'medium' | 'low'.
 *
 * Heuristics:
 * - Screen width < 768 → low
 * - hardwareConcurrency <= 4 → low
 * - hardwareConcurrency <= 6 and not wide screen → medium
 * - Everything else → high
 */
export default function useDeviceCapability() {
  const [tier, setTier] = useState('medium');

  useEffect(() => {
    const width = window.innerWidth;
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = width < 768;
    const isTablet = width < 1024;

    if (isMobile || cores <= 4) {
      setTier('low');
    } else if (isTablet || cores <= 6) {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, []);

  return tier;
}

/**
 * Returns particle count based on quality tier.
 */
export function getParticleCount(tier) {
  switch (tier) {
    case 'high': return 200;
    case 'medium': return 120;
    case 'low': return 50;
    default: return 120;
  }
}

/**
 * Returns max DPR based on quality tier.
 */
export function getMaxDPR(tier) {
  switch (tier) {
    case 'high': return 2;
    case 'medium': return 1.5;
    case 'low': return 1;
    default: return 1.5;
  }
}

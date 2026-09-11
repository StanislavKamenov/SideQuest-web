import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import useReducedMotion from './hooks/useReducedMotion';
import useDeviceCapability, { getMaxDPR } from './hooks/useDeviceCapability';

/**
 * ArcadeScene — persistent R3F canvas wrapper.
 * Renders the 3D world behind DOM content.
 * Handles WebGL detection, DPR limiting, tab visibility pause.
 */
export default function ArcadeScene({ children, className = '', style = {} }) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const [webglSupported, setWebglSupported] = useState(true);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef();

  // WebGL detection
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Tab visibility — pause rendering when hidden
  useEffect(() => {
    const handleVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  if (!webglSupported) {
    // CSS-only fallback: just render children without 3D
    return (
      <div className={`arcade-scene-fallback ${className}`} style={style}>
        {/* Fallback ambient CSS effects */}
        <div className="arcade-fallback-ambient" />
      </div>
    );
  }

  const maxDPR = getMaxDPR(tier);

  return (
    <div
      className={`arcade-scene-container ${className}`}
      style={{ position: 'relative', ...style }}
    >
      {/* 3D Canvas — fixed background layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Canvas
          ref={canvasRef}
          dpr={[1, maxDPR]}
          gl={{
            antialias: tier !== 'low',
            alpha: true,
            powerPreference: tier === 'low' ? 'low-power' : 'high-performance',
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 2, 12], fov: 60, near: 0.1, far: 100 }}
          frameloop={visible && !reducedMotion ? 'always' : 'demand'}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

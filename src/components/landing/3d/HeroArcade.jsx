import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ArcadeEnvironment from './ArcadeEnvironment';
import NeonGrid from './NeonGrid';
import FloatingCoins from './FloatingCoins';
import PixelParticles from './PixelParticles';
import ArcadeCabinet from './ArcadeCabinet';
import CRTMonitor from './CRTMonitor';
import { SimpleNeonSign } from './NeonSign';
import useReducedMotion from './hooks/useReducedMotion';
import useDeviceCapability, { getParticleCount } from './hooks/useDeviceCapability';

/**
 * HeroArcade — full 3D composition for the hero / entire landing page.
 * Contains all 3D elements: grid, coins, particles, cabinets, monitors.
 * Camera subtly follows mouse and gently dollies on scroll.
 */
export default function HeroArcade({ scrollProgress = 0, mousePosition = { x: 0, y: 0 } }) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 2, 12));
  const currentPos = useRef(new THREE.Vector3(0, 2, 12));

  const particleCount = reducedMotion ? 0 : getParticleCount(tier);
  const coinCount = tier === 'low' ? 6 : tier === 'medium' ? 10 : 15;
  const showCabinets = tier !== 'low';

  useFrame(() => {
    if (reducedMotion) return;

    // Target position: gentle mouse parallax + scroll dolly
    const mx = mousePosition.x * 0.8;  // mouse X offset
    const my = mousePosition.y * 0.4;  // mouse Y offset
    const scrollDolly = scrollProgress * 4; // gentle forward movement on scroll

    cameraTarget.current.set(
      mx,
      2 - my + scrollProgress * 0.5,
      12 - scrollDolly
    );

    // Smooth interpolation (lerp)
    currentPos.current.lerp(cameraTarget.current, 0.03);

    camera.position.copy(currentPos.current);
    camera.lookAt(0, 1 + scrollProgress * 0.5, -5);
  });

  return (
    <>
      <ArcadeEnvironment scrollProgress={scrollProgress} />

      {/* Neon Grid Floor */}
      <NeonGrid
        color="#E85D4A"
        opacity={0.4}
        position={[0, -2, 0]}
        scrollProgress={scrollProgress}
      />

      {/* Floating Coins */}
      <FloatingCoins
        count={coinCount}
        spread={14}
        scrollProgress={scrollProgress}
      />

      {/* Pixel Particles */}
      {particleCount > 0 && (
        <PixelParticles count={particleCount} spread={20} />
      )}

      {/* Arcade Cabinets — flanking the scene */}
      {showCabinets && (
        <>
          {/* Left side cabinets */}
          <ArcadeCabinet
            position={[-7, -0.5, -3]}
            rotation={[0, 0.3, 0]}
            scale={0.8}
            screenColor="#E85D4A"
          />
          <ArcadeCabinet
            position={[-9, -0.5, -8]}
            rotation={[0, 0.5, 0]}
            scale={0.7}
            screenColor="#00E5FF"
          />

          {/* Right side cabinets */}
          <ArcadeCabinet
            position={[7, -0.5, -4]}
            rotation={[0, -0.3, 0]}
            scale={0.8}
            screenColor="#C8E650"
          />
          <ArcadeCabinet
            position={[9, -0.5, -9]}
            rotation={[0, -0.5, 0]}
            scale={0.7}
            screenColor="#A663E0"
          />

          {/* Background cabinets — far and small */}
          <ArcadeCabinet
            position={[-4, -0.5, -15]}
            rotation={[0, 0.1, 0]}
            scale={0.6}
            screenColor="#FF8A3D"
          />
          <ArcadeCabinet
            position={[4, -0.5, -16]}
            rotation={[0, -0.1, 0]}
            scale={0.6}
            screenColor="#E85D4A"
          />
        </>
      )}

      {/* CRT Monitors — decorative props */}
      {showCabinets && (
        <>
          <CRTMonitor
            position={[-5, 1.5, -6]}
            rotation={[0, 0.4, 0]}
            scale={0.5}
            screenColor="#C8E650"
          />
          <CRTMonitor
            position={[5.5, 2, -7]}
            rotation={[0, -0.3, 0]}
            scale={0.4}
            screenColor="#00E5FF"
          />
        </>
      )}

      {/* Neon sign decorations — distant */}
      {tier === 'high' && (
        <>
          <SimpleNeonSign
            position={[-3, 5, -12]}
            rotation={[0, 0.2, 0]}
            color="#E85D4A"
            width={2.5}
            height={0.35}
            pulseSpeed={1.5}
          />
          <SimpleNeonSign
            position={[4, 4.5, -14]}
            rotation={[0, -0.15, 0]}
            color="#C8E650"
            width={2}
            height={0.3}
            pulseSpeed={2.5}
          />
        </>
      )}
    </>
  );
}

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ArcadeEnvironment — shared lighting, fog, and atmosphere.
 * Creates the dark arcade room ambient feel.
 */
export default function ArcadeEnvironment({ scrollProgress = 0 }) {
  const groupRef = useRef();

  // Subtle lighting color shift based on scroll
  useFrame(() => {
    if (!groupRef.current) return;
    // Very gentle rotation to create living environment feel
    groupRef.current.rotation.y = scrollProgress * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Ambient base — very dark, sets the floor */}
      <ambientLight intensity={0.08} color="#1a1530" />

      {/* Main neon red light — upper left */}
      <pointLight
        position={[-6, 8, 4]}
        intensity={1.2}
        color="#E85D4A"
        distance={30}
        decay={2}
      />

      {/* Cyan accent light — upper right */}
      <pointLight
        position={[6, 6, 2]}
        intensity={0.8}
        color="#00E5FF"
        distance={25}
        decay={2}
      />

      {/* Lime accent — below */}
      <pointLight
        position={[0, -2, 6]}
        intensity={0.4}
        color="#C8E650"
        distance={20}
        decay={2}
      />

      {/* Purple deep accent — far back */}
      <pointLight
        position={[0, 4, -10]}
        intensity={0.6}
        color="#A663E0"
        distance={30}
        decay={2}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0912', 10, 50]} />
    </group>
  );
}

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * CRTMonitor — decorative retro CRT monitor.
 * A boxy monitor with a glowing screen face.
 */
export default function CRTMonitor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenColor = '#00E5FF',
}) {
  const screenRef = useRef();

  useFrame((state) => {
    if (!screenRef.current) return;
    const t = state.clock.elapsedTime;
    screenRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.1;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Monitor body — slightly rounded box */}
      <mesh>
        <boxGeometry args={[1.4, 1.1, 1.0]} />
        <meshStandardMaterial
          color="#1a1530"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.05, 0.51]}>
        <planeGeometry args={[1.1, 0.8]} />
        <meshStandardMaterial
          color="#050510"
          emissive={screenColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.9, 0]}>
        <boxGeometry args={[0.8, 0.08, 0.5]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

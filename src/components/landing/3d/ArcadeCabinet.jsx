import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ArcadeCabinet — procedural arcade cabinet from Three.js primitives.
 * Creates a stylized retro arcade machine shape.
 * The screen face glows with an emissive color.
 */
export default function ArcadeCabinet({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenColor = '#E85D4A',
  bodyColor = '#1a1530',
  hoverGlow = false,
}) {
  const groupRef = useRef();
  const screenRef = useRef();

  // Subtle idle animation
  useFrame((state) => {
    if (!screenRef.current) return;
    // Screen flicker
    const flicker = 0.4 + Math.sin(state.clock.elapsedTime * 3 + Math.random() * 0.1) * 0.1;
    screenRef.current.material.emissiveIntensity = hoverGlow ? 0.8 : flicker;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Cabinet body */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.2, 2.4, 0.8]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Screen — slightly recessed, glowing */}
      <mesh ref={screenRef} position={[0, 1.6, 0.41]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial
          color="#000000"
          emissive={screenColor}
          emissiveIntensity={0.5}
          metalness={0}
          roughness={0.5}
        />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 1.6, 0.405]}>
        <boxGeometry args={[1.0, 0.8, 0.02]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Control panel — angled */}
      <mesh position={[0, 0.5, 0.5]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.0, 0.4, 0.5]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Joystick */}
      <mesh position={[-0.2, 0.6, 0.65]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.2, 0.72, 0.65]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#E85D4A"
          emissive="#E85D4A"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Buttons */}
      {[0.1, 0.25, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.58, 0.65]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
          <meshStandardMaterial
            color={['#E85D4A', '#C8E650', '#00E5FF'][i]}
            emissive={['#E85D4A', '#C8E650', '#00E5FF'][i]}
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Top marquee sign */}
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.82]} />
        <meshStandardMaterial
          color="#0d0d0d"
          emissive={screenColor}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

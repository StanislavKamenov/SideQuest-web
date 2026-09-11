import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PixelParticles — Points-based particle system.
 * Creates a digital dust / pixel particle atmosphere.
 * Uses BufferGeometry + PointsMaterial for maximum efficiency.
 */
export default function PixelParticles({ count = 150, spread = 20 }) {
  const pointsRef = useRef();

  // Generate particle positions and velocities
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#E85D4A'),
      new THREE.Color('#C8E650'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#A663E0'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random positions in a cube
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = Math.random() * 15 - 3;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;

      // Slow upward drift
      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = 0.003 + Math.random() * 0.008;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002;

      // Random color from palette
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, [count, spread]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Move particles
      posArr[i3] += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];

      // Reset particles that drift too high
      if (posArr[i3 + 1] > 12) {
        posArr[i3 + 1] = -3;
        posArr[i3] = (Math.random() - 0.5) * spread;
        posArr[i3 + 2] = (Math.random() - 0.5) * spread;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FloatingCoins — instanced rotating coins/tokens.
 * Uses InstancedMesh for GPU efficiency.
 * Coins float, rotate, and drift based on time.
 */
export default function FloatingCoins({ count = 15, spread = 12, scrollProgress = 0 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions/speeds for each coin
  const coinData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * 8 - 1,
      z: (Math.random() - 0.5) * spread - 2,
      rotSpeed: 0.5 + Math.random() * 1.5,
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2,
      scale: 0.15 + Math.random() * 0.2,
    }));
  }, [count, spread]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    coinData.forEach((coin, i) => {
      // Float up and down
      const floatY = Math.sin(t * coin.floatSpeed + coin.floatOffset) * 0.5;

      dummy.position.set(
        coin.x + Math.sin(t * 0.2 + i) * 0.3,
        coin.y + floatY - scrollProgress * 3,
        coin.z
      );

      // Rotate on Y axis
      dummy.rotation.set(
        Math.sin(t * 0.3 + i) * 0.2,
        t * coin.rotSpeed,
        0
      );

      dummy.scale.setScalar(coin.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.5, 0.5, 0.08, 16]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#E85D4A"
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.2}
      />
    </instancedMesh>
  );
}

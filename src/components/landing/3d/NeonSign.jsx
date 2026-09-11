import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

/**
 * NeonSign — glowing neon text or panel.
 * Uses @react-three/drei Text for 3D text rendering.
 */
export default function NeonSign({
  text = 'ARCADE',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#E85D4A',
  fontSize = 0.5,
  pulseSpeed = 2,
}) {
  const textRef = useRef();
  const backRef = useRef();

  useFrame((state) => {
    if (!textRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 0.8 + Math.sin(t * pulseSpeed) * 0.2;
    textRef.current.material.emissiveIntensity = pulse;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Backing panel */}
      <mesh ref={backRef} position={[0, 0, -0.05]}>
        <boxGeometry args={[text.length * fontSize * 0.7 + 0.4, fontSize + 0.3, 0.08]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Neon text */}
      <Text
        ref={textRef}
        font="/fonts/PressStart2P-Regular.ttf"
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        material-emissive={color}
        material-emissiveIntensity={0.8}
        material-toneMapped={false}
      >
        {text}
      </Text>
    </group>
  );
}

/**
 * SimpleNeonSign — fallback neon sign using plane geometry instead of text.
 * No font dependency required.
 */
export function SimpleNeonSign({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#E85D4A',
  width = 2,
  height = 0.4,
  pulseSpeed = 2,
}) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.material.emissiveIntensity = 0.6 + Math.sin(t * pulseSpeed) * 0.3;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Backing */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.2, height + 0.15, 0.06]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Glowing panel */}
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#050510"
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

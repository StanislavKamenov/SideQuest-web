import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NeonGrid — animated infinite neon grid floor.
 * Uses a custom ShaderMaterial for GPU-efficient rendering.
 * The grid scrolls to create a sense of movement.
 */

const gridVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    // Scale UVs to create grid
    vec2 grid = fract((vUv - vec2(0.0, uTime * 0.05)) * 20.0);
    
    // Grid lines
    float lineX = smoothstep(0.02, 0.0, abs(grid.x - 0.5) - 0.48);
    float lineY = smoothstep(0.02, 0.0, abs(grid.y - 0.5) - 0.48);
    float line = max(lineX, lineY);
    
    // Distance fade — stronger at center, fades at edges
    float dist = length(vUv - 0.5) * 2.0;
    float fade = 1.0 - smoothstep(0.3, 1.0, dist);
    
    // Glow effect on lines
    float glow = line * fade * uOpacity;
    
    gl_FragColor = vec4(uColor, glow * 0.6);
  }
`;

export default function NeonGrid({ 
  color = '#E85D4A', 
  opacity = 0.5,
  position = [0, -2, 0],
  scrollProgress = 0
}) {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + scrollProgress * 10;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

import { useEffect, useRef, type JSX } from 'react';
import * as THREE from 'three';
import { experienceRegistry } from './registry';
import { runtime } from './runtime';
import { useFrame } from '@react-three/fiber';

export function InteriorRoot(): JSX.Element {
  const root = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!root.current) return;
    return experienceRegistry.register('interiorRoot', root.current);
  }, []);

  useFrame(() => {
    if (!root.current) return;
    root.current.visible = runtime.channels.interiorReveal > 0.001;
  });

  return (
    <group ref={root} position={[0, 0, -3]} visible={false}>
      {Array.from({ length: 14 }, (_, index) => (
        <mesh key={index} position={[0, 0, -index * 0.55]}>
          <torusGeometry args={[1.5, 0.03, 8, 64]} />
          <meshBasicMaterial transparent opacity={0.28} />
        </mesh>
      ))}
    </group>
  );
}

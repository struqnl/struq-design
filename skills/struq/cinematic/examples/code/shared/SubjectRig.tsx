import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, type JSX } from 'react';
import * as THREE from 'three';
import { experienceRegistry } from './registry';
import { runtime } from './runtime';
import { damp } from './math';

export function SubjectRig(): JSX.Element {
  const narrativeRig = useRef<THREE.Group>(null);
  const reactionRig = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!narrativeRig.current || !reactionRig.current || !mesh.current) return;

    const unregister = [
      experienceRegistry.register('subjectNarrativeRig', narrativeRig.current),
      experienceRegistry.register('subjectReactionRig', reactionRig.current),
      experienceRegistry.register('subjectMesh', mesh.current),
    ];

    return () => unregister.forEach((dispose) => dispose());
  }, []);

  useFrame((state, delta) => {
    if (!reactionRig.current) return;

    const interactionAllowed = runtime.activeHandoff === null;
    const targetYaw = interactionAllowed ? runtime.pointer.x * 0.06 : 0;
    const targetPitch = interactionAllowed ? -runtime.pointer.y * 0.03 : 0;

    reactionRig.current.rotation.y = damp(
      reactionRig.current.rotation.y,
      targetYaw,
      7,
      delta,
    );
    reactionRig.current.rotation.x = damp(
      reactionRig.current.rotation.x,
      targetPitch,
      7,
      delta,
    );

    reactionRig.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
  });

  return (
    <group ref={narrativeRig} position={[0.55, -0.1, 0]} rotation={[0.08, -0.55, 0]}>
      <group ref={reactionRig}>
        <mesh ref={mesh}>
          <torusKnotGeometry args={[0.8, 0.24, 160, 24]} />
          <meshStandardMaterial metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

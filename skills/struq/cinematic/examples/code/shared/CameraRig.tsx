import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, type JSX } from 'react';
import * as THREE from 'three';
import { experienceRegistry } from './registry';
import { runtime } from './runtime';
import { damp } from './math';

const targetWorld = new THREE.Vector3();

export function CameraRig(): JSX.Element {
  const narrativeRig = useRef<THREE.Group>(null);
  const reactionRig = useRef<THREE.Group>(null);
  const targetNarrativeRig = useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (!narrativeRig.current || !targetNarrativeRig.current || !camera.current) return;

    const unregister = [
      experienceRegistry.register('cameraNarrativeRig', narrativeRig.current),
      experienceRegistry.register('cameraTargetNarrativeRig', targetNarrativeRig.current),
      experienceRegistry.register('camera', camera.current),
    ];

    return () => unregister.forEach((dispose) => dispose());
  }, []);

  useFrame((state, delta) => {
    if (!reactionRig.current || !targetNarrativeRig.current || !camera.current) return;

    runtime.elapsedTime = state.clock.elapsedTime;
    runtime.deltaTime = delta;

    const multiplier = runtime.viewport === 'mobile' ? 0 : 1;
    const strength = runtime.channels.pointerCameraStrength * multiplier;

    reactionRig.current.rotation.y = damp(
      reactionRig.current.rotation.y,
      runtime.pointer.x * strength,
      8,
      delta,
    );
    reactionRig.current.rotation.x = damp(
      reactionRig.current.rotation.x,
      -runtime.pointer.y * strength * 0.55,
      8,
      delta,
    );

    targetNarrativeRig.current.getWorldPosition(targetWorld);
    camera.current.lookAt(targetWorld);
  });

  return (
    <>
      <group ref={narrativeRig} position={[0, 0.25, 5.8]}>
        <group ref={reactionRig}>
          <PerspectiveCamera ref={camera} makeDefault position={[0, 0, 0]} fov={34} />
        </group>
      </group>
      <group ref={targetNarrativeRig} position={[0, 0, 0]} />
    </>
  );
}

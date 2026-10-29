import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { GsapFrameLoop } from './GsapFrameLoop';
import { SubjectRig } from './SubjectRig';
import { InteriorRoot } from './InteriorRoot';

export function ExperienceCanvas(): JSX.Element {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} frameloop="never">
      <GsapFrameLoop />
      <color attach="background" args={['#080808']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <CameraRig />
      <SubjectRig />
      <InteriorRoot />
    </Canvas>
  );
}

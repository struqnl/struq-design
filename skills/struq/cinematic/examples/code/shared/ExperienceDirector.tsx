import { useGSAP } from '@gsap/react';
import { useEffect, useState, type RefObject } from 'react';
import { buildExperienceTimeline } from './build-experience-timeline';
import { gsap, registerGsap } from './gsap-client';
import { experienceRegistry } from './registry';

registerGsap();
if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

const REQUIRED_TARGETS = [
  'cameraNarrativeRig',
  'cameraTargetNarrativeRig',
  'camera',
  'subjectNarrativeRig',
  'subjectReactionRig',
  'subjectMesh',
  'interiorRoot',
  'heroTitle',
  'bridgePath',
] as const;

type ExperienceDirectorProps = {
  scopeRef: RefObject<HTMLDivElement | null>;
  narrativeRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
};

export function ExperienceDirector({
  scopeRef,
  narrativeRef,
  stageRef,
}: ExperienceDirectorProps): null {
  const [registryVersion, setRegistryVersion] = useState(0);

  useEffect(
    () => experienceRegistry.subscribe(() => setRegistryVersion((value) => value + 1)),
    [],
  );

  useGSAP(() => {
    if (!narrativeRef.current || !stageRef.current) return;
    if (!experienceRegistry.hasAll([...REQUIRED_TARGETS])) return;

    const experience = buildExperienceTimeline({
      narrativeElement: narrativeRef.current,
      stageElement: stageRef.current,
    });

    return experience.cleanup;
  }, {
    scope: scopeRef,
    dependencies: [registryVersion],
    revertOnUpdate: true,
  });

  return null;
}

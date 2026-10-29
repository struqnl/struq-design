import type * as THREE from 'three';
import { experienceDirection, shots, type Shot } from './direction';
import {
  DrawSVGPlugin,
  ScrollTrigger,
  SplitText,
  gsap,
  registerGsap,
} from './gsap-client';
import { experienceRegistry } from './registry';
import { runtime } from './runtime';

export type BuildExperienceTimelineArgs = {
  narrativeElement: HTMLElement;
  stageElement: HTMLElement;
};

function addShot(
  timeline: gsap.core.Timeline,
  shot: Shot,
  position: gsap.Position,
  duration: number,
): void {
  const cameraRig = experienceRegistry.require('cameraNarrativeRig');
  const targetRig = experienceRegistry.require('cameraTargetNarrativeRig');
  const camera = experienceRegistry.require('camera');
  const subjectRig = experienceRegistry.require('subjectNarrativeRig');

  timeline.to(cameraRig.position, {
    x: shot.camera.position[0],
    y: shot.camera.position[1],
    z: shot.camera.position[2],
    duration,
    ease: 'power2.inOut',
  }, position);

  timeline.to(targetRig.position, {
    x: shot.camera.target[0],
    y: shot.camera.target[1],
    z: shot.camera.target[2],
    duration,
    ease: 'power2.inOut',
  }, position);

  timeline.to(camera, {
    fov: shot.camera.fov,
    duration,
    ease: 'power1.inOut',
    onUpdate: () => camera.updateProjectionMatrix(),
  }, position);

  timeline.to(subjectRig.position, {
    x: shot.subject.position[0],
    y: shot.subject.position[1],
    z: shot.subject.position[2],
    duration,
    ease: 'power2.inOut',
  }, position);

  timeline.to(subjectRig.rotation, {
    x: shot.subject.rotation[0],
    y: shot.subject.rotation[1],
    z: shot.subject.rotation[2],
    duration,
    ease: 'power2.inOut',
  }, position);

  timeline.to(subjectRig.scale, {
    x: shot.subject.scale,
    y: shot.subject.scale,
    z: shot.subject.scale,
    duration,
    ease: 'power2.inOut',
  }, position);
}

function buildArrival(): { timeline: gsap.core.Timeline; cleanup: () => void } {
  const title = experienceRegistry.require('heroTitle');
  const path = experienceRegistry.require('bridgePath');
  const split = SplitText.create(title, { type: 'lines', mask: 'lines' });

  const timeline = gsap.timeline({ defaults: { ease: 'none' } });
  timeline.addLabel('arrival:enter', 0)
    .from(split.lines, {
      yPercent: 110,
      autoAlpha: 0,
      duration: 0.28,
      stagger: 0.04,
      ease: 'power3.out',
    }, 0.08)
    .fromTo(path, { drawSVG: '0%' }, {
      drawSVG: '65%',
      duration: 0.48,
      ease: 'power2.inOut',
    }, 0.22)
    .addLabel('arrival:hero', 0.48)
    .addLabel('arrival:handoff-armed', 0.82);

  addShot(timeline, shots.material, 0.54, 0.46);

  return { timeline, cleanup: () => split.revert() };
}

function buildMaterial(): gsap.core.Timeline {
  const subject = experienceRegistry.require('subjectNarrativeRig');
  const timeline = gsap.timeline({ defaults: { ease: 'none' } });

  timeline.addLabel('material:enter', 0)
    .to(subject.rotation, {
      y: 0,
      duration: 0.45,
      ease: 'power2.inOut',
    }, 0.10)
    .to(subject.scale, {
      x: 1.18,
      y: 1.18,
      z: 1.18,
      duration: 0.34,
      ease: 'power2.in',
    }, 0.60)
    .addLabel('portal:armed', 0.74);

  addShot(timeline, shots.portal, 0.56, 0.44);

  return timeline;
}

function buildPortalHandoff(): gsap.core.Timeline {
  const interior = experienceRegistry.require('interiorRoot');
  const subject = experienceRegistry.require('subjectNarrativeRig');
  const timeline = gsap.timeline({ defaults: { ease: 'none' } });

  timeline.addLabel('handoff:enter', 0)
    .to(runtime.channels, {
      pointerCameraStrength: experienceDirection.pointerStrength.critical,
      duration: 0.18,
      ease: 'power2.out',
    }, 0)
    .set(interior, { visible: true }, 0.22)
    .to(runtime.channels, {
      interiorReveal: 1,
      duration: 0.58,
      ease: 'power1.inOut',
    }, 0.22)
    .to(subject.scale, {
      x: runtime.viewport === 'mobile'
        ? experienceDirection.mobile.portalScale
        : 2.1,
      y: runtime.viewport === 'mobile'
        ? experienceDirection.mobile.portalScale
        : 2.1,
      z: runtime.viewport === 'mobile'
        ? experienceDirection.mobile.portalScale
        : 2.1,
      duration: 0.72,
      ease: 'power2.in',
    }, 0)
    .addLabel('cover:safe', 0.68)
    .set(subject, { visible: false }, 0.72)
    .to(runtime.channels, {
      pointerCameraStrength: experienceDirection.pointerStrength.interior,
      duration: 0.22,
      ease: 'power2.out',
    }, 0.76)
    .addLabel('handoff:resolved', 1);

  addShot(timeline, shots.interior, 0.54, 0.46);

  return timeline;
}

export function buildExperienceTimeline({
  narrativeElement,
  stageElement,
}: BuildExperienceTimelineArgs): {
  timeline: gsap.core.Timeline;
  trigger: ScrollTrigger;
  cleanup: () => void;
} {
  registerGsap();

  const master = gsap.timeline({ paused: true });
  const arrival = buildArrival();
  const material = buildMaterial();
  const portal = buildPortalHandoff();

  master
    .addLabel('chapter:arrival', 0)
    .add(arrival.timeline, 'chapter:arrival')
    .addLabel('chapter:material', 1)
    .add(material, 'chapter:material')
    .addLabel('handoff:portal', 2)
    .add(portal, 'handoff:portal')
    .addLabel('chapter:interior', 3);

  const trigger = ScrollTrigger.create({
    trigger: narrativeElement,
    start: 'top top',
    end: 'bottom bottom',
    pin: stageElement,
    pinSpacing: false,
    // Lenis smooths the scroll input and a numeric scrub smooths the output on
    // top. Keep the two paired (lower Lenis lerp, lower scrub number).
    scrub: 0.65,
    animation: master,
    invalidateOnRefresh: true,
    onUpdate(self) {
      runtime.globalProgress = self.progress;
      runtime.scrollVelocity = self.getVelocity();
      runtime.scrollDirection = self.direction as -1 | 1;

      if (self.progress < 1 / 3) {
        runtime.activeChapter = 'arrival';
        runtime.activeHandoff = null;
        runtime.chapterProgress = self.progress * 3;
      } else if (self.progress < 2 / 3) {
        runtime.activeChapter = 'material';
        runtime.activeHandoff = null;
        runtime.chapterProgress = (self.progress - 1 / 3) * 3;
      } else {
        runtime.activeChapter = 'interior';
        runtime.activeHandoff = 'material-interior';
        runtime.chapterProgress = (self.progress - 2 / 3) * 3;
      }
    },
  });

  return {
    timeline: master,
    trigger,
    cleanup: () => {
      trigger.kill();
      master.kill();
      arrival.cleanup();
    },
  };
}

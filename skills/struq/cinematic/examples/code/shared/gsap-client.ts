import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

let registered = false;

export function registerGsap(): typeof gsap {
  if (typeof window !== 'undefined' && !registered) {
    gsap.registerPlugin(
      ScrollTrigger,
      SplitText,
      DrawSVGPlugin,
      MorphSVGPlugin,
      MotionPathPlugin,
    );
    registered = true;
  }

  return gsap;
}

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
};

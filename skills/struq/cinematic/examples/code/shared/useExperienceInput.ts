import { useEffect } from 'react';
import { runtime, updateViewportClass } from './runtime';

export function useExperienceInput(): void {
  useEffect(() => {
    let previousX = window.innerWidth / 2;
    let previousY = window.innerHeight / 2;

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      runtime.pointer.x = x;
      runtime.pointer.y = y;
      runtime.pointer.speed = Math.min(1, Math.hypot(dx, dy) / 80);

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onResize = () => updateViewportClass(window.innerWidth);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      runtime.reducedMotion = reducedMotion.matches;
    };

    onResize();
    onMotionChange();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, []);
}

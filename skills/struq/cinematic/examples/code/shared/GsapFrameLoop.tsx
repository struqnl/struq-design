import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { gsap, registerGsap } from './gsap-client';

registerGsap();

/**
 * The single clock. The canvas is mounted with frameloop="never", so R3F does
 * not run its own requestAnimationFrame loop. This component renders one frame
 * per gsap.ticker tick, the same ticker that advances Lenis in LenisRoot.
 *
 * gsap.ticker passes its time in seconds, which is what advance() expects when
 * frameloop is "never". Verify against the installed @react-three/fiber version.
 */
export function GsapFrameLoop(): null {
  const advance = useThree((state) => state.advance);
  const clock = useThree((state) => state.clock);

  useEffect(() => {
    const tick = (time: number) => advance(time);

    // Sync R3F's clock to the ticker before the first tick, or the first frame
    // sees a delta from 0 to gsap.ticker.time and every useFrame consumer jumps.
    clock.elapsedTime = gsap.ticker.time;
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance, clock]);

  return null;
}

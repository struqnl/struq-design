import { motion } from 'motion/react';
import { useEffect, useRef, type JSX } from 'react';
import { experienceRegistry } from './registry';

export function ExperienceOverlay(): JSX.Element {
  const title = useRef<HTMLHeadingElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const unregister: Array<() => void> = [];
    if (title.current) unregister.push(experienceRegistry.register('heroTitle', title.current));
    if (path.current) unregister.push(experienceRegistry.register('bridgePath', path.current));
    return () => unregister.forEach((dispose) => dispose());
  }, []);

  return (
    <div className="experience-overlay">
      <div className="experience-copy">
        <h1 ref={title}>One world, continuously directed.</h1>
        <p>Scroll to move through arrival, material, and interior states.</p>
      </div>

      <svg className="experience-bridge" viewBox="0 0 100 100" aria-hidden="true">
        <path ref={path} d="M10,75 C35,15 65,15 90,75" fill="none" stroke="currentColor" />
      </svg>

      <motion.button
        className="local-ui-button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        type="button"
      >
        Local Motion interaction
      </motion.button>
    </div>
  );
}

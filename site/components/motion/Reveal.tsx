"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

/**
 * Staggered group reveal (scroll-reveals.md §1): every [data-reveal] descendant rises
 * with transform and autoAlpha, 0.08s apart, once. Hidden states exist only inside the
 * motion branch, so reduced motion, no-JS and full-page captures show the final state.
 * A group already in view on load (or one that sits too low for "top 85%" to happen,
 * pitfalls.md §3.6) plays immediately instead of waiting for a start it can never reach.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  y = 40,
  stagger = 0.08,
  start = "top 85%",
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" },
        (ctx) => {
          const { motion, small } = ctx.conditions!;
          if (!motion) return;
          const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current);
          if (!items.length) return;
          const tween = gsap.from(items, {
            y: small ? Math.round(y * 0.6) : y,
            autoAlpha: 0,
            duration: small ? 0.8 : 0.95,
            ease: "expo.out",
            stagger,
            paused: true,
          });
          const st = ScrollTrigger.create({
            trigger: root.current,
            start,
            once: true,
            onEnter: () => tween.play(),
          });
          if (ScrollTrigger.isInViewport(root.current!)) tween.play();
          return () => st.kill();
        }
      );
    },
    { scope: root }
  );

  return (
    <Tag ref={root} className={className} {...rest}>
      {children}
    </Tag>
  );
}

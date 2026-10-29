"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Lenis on the GSAP ticker: one clock (setup.md §2). The ticker callback is registered
// unconditionally and resolves the instance per frame, so it can never lose the ref race.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => ScrollTrigger.update();

    let poll: ReturnType<typeof setInterval> | undefined;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const bind = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return false;
      lenis.on("scroll", onScroll);
      settle = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 400);
      return true;
    };
    if (!bind()) poll = setInterval(() => { if (bind()) clearInterval(poll); }, 50);

    // Triggers measured before the webfonts land are stale (pitfalls.md §2.3).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const ref = lenisRef.current;
    return () => {
      if (poll) clearInterval(poll);
      if (settle) clearTimeout(settle);
      ref?.lenis?.off("scroll", onScroll);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, autoRaf: false, anchors: true }}>
      {children}
    </ReactLenis>
  );
}

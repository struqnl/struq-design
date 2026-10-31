"use client";
// components/struq/Cursor.tsx (Struq recipe)
// A small dot that follows the pointer exactly and a ring that trails it, inverted against
// whatever is under it (mix-blend difference), so it reads on light and dark sections alike.
// The ring grows over links, buttons and anything marked data-cursor. Mounted once in the layout.
// Only on a fine pointer with motion allowed: touch screens and reduced motion keep the
// native cursor and render nothing.
//
// Leave it out for a genre where a custom cursor fights the job (a booking flow, a dense shop).
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const dot = el.querySelector<HTMLElement>("[data-dot]");
      const ring = el.querySelector<HTMLElement>("[data-ring]");
      if (!dot || !ring) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const html = document.documentElement;
        const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
        const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
        const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
        let shown = false;
        const move = (e: PointerEvent) => {
          if (!shown) {
            shown = true;
            html.classList.add("has-cursor");
            gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
          }
          dx(e.clientX);
          dy(e.clientY);
          rx(e.clientX);
          ry(e.clientY);
        };
        const over = (e: PointerEvent) => {
          const hit = (e.target as Element | null)?.closest("a, button, [data-cursor]");
          gsap.to(ring, { scale: hit ? 1.8 : 1, duration: 0.4, ease: "power3.out" });
        };
        const out = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerover", over, { passive: true });
        document.addEventListener("pointerleave", out);
        return () => {
          html.classList.remove("has-cursor");
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerover", over);
          document.removeEventListener("pointerleave", out);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div data-dot="" className="invisible absolute left-0 top-0 -ml-1 -mt-1 size-2 rounded-full bg-white opacity-0" />
      <div data-ring="" className="invisible absolute left-0 top-0 -ml-5 -mt-5 size-10 rounded-full border border-white opacity-0" />
    </div>
  );
}

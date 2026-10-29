"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

type Tag = "h2" | "h3" | "p";

/**
 * Masked line rise on scroll (scroll-reveals.md §3). Headings are split directly, so
 * SplitText's aria "auto" label sits on an element with a role. A paragraph renders an
 * sr-only copy and splits an aria-hidden visual copy (typography.md "Where the accessible
 * name lives"). The server markup is the final state; nothing is hidden without motion.
 */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className = "",
  start = "top 82%",
}: {
  as?: Tag;
  children: string;
  className?: string;
  start?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!.querySelector<HTMLElement>("[data-split]");
        if (!el) return;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: Tag === "p" ? "none" : "auto",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: root.current, start, once: true },
            }),
        });
      });
    },
    { scope: root }
  );

  if (Tag === "p") {
    return (
      <div ref={root}>
        <p className="sr-only">{children}</p>
        <p data-split aria-hidden className={className}>
          {children}
        </p>
      </div>
    );
  }

  return (
    <div ref={root}>
      <Tag data-split className={className}>
        {children}
      </Tag>
    </div>
  );
}

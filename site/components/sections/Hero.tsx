"use client";

import { useRef } from "react";
import { External, ArrowDown } from "@deckdot/struq-icons";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import { CopyCommand } from "@/components/site/CopyCommand";

/**
 * Hook. The declared "stack-in" entrance (STRUQ.md SYSTEM): the mark's three bars drop
 * into place top to bottom while the h1 lines rise from masks and the weight arrives
 * 300 to 400 (Comfortaa's wght floor). On departure the bars pull apart, the brand's
 * own split-apart motion, tied to the hand (scrub: true).
 *
 * Ownership: entrances animate the bars (rect) and the split lines; the departure
 * animates their wrappers (g, [data-hero-title]), so no element has two owners.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" },
        (ctx) => {
          const { motion, small } = ctx.conditions!;
          if (!motion) return;
          const scope = root.current!;
          const h1 = scope.querySelector<HTMLElement>("[data-split-hero]")!;
          const mark = scope.querySelector<HTMLElement>("[data-hero-mark]")!;
          const bars = gsap.utils.toArray<SVGElement>("[data-bar]", scope);

          // Bars: hidden by CSS until this tween owns them, then they drop in, narrow to wide.
          gsap.from(bars, {
            y: -26, autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.15,
          });
          mark.dataset.ready = "1";

          SplitText.create(h1, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              h1.dataset.ready = "1";
              return gsap.from(self.lines, {
                yPercent: 115, fontWeight: 300, duration: 1.3, ease: "expo.out", stagger: 0.1,
              });
            },
          });



          // Departure scrub (pinning-scrub.md §3): four layers, four rates.
          const spread = small ? 7 : 11;
          gsap.timeline({
            scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
            .to("[data-hero-title]", { yPercent: -18 }, 0)
            .to("[data-bar-wrap='top']", { y: -spread * 1.6 }, 0)
            .to("[data-bar-wrap='core']", { y: -spread * 0.4 }, 0)
            .to("[data-bar-wrap='base']", { y: spread }, 0)
            .to("[data-hero-meta]", { autoAlpha: 0, y: -24 }, 0);
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-[100svh] overflow-x-clip pb-[8rem] pt-[8.5rem] md:pb-[10rem] md:pt-[10.5rem]"
    >
      <div className="content-grid relative z-20">
        <div>
          <p data-hero-in style={{ "--d": "0.35s" } as React.CSSProperties} className="eyebrow text-eyebrow text-ink-muted">Open-source design skill</p>
          <div data-hero-title className="mt-7">
            <h1 data-split-hero className="font-brand text-display max-w-[12ch]">
              Design taste for your coding agent.
            </h1>
          </div>
          <p data-hero-in style={{ "--d": "0.6s" } as React.CSSProperties} className="text-lead mt-10 max-w-[44ch] text-ink-muted">
            Struq is an open-source design skill for Claude Code, Codex, Cursor and OpenCode. Install it with one
            command, then give <code className="text-ink">/struq</code> a brief: it plans the site, stops once for
            your veto, and builds it.
          </p>
          <div data-hero-in style={{ "--d": "0.7s" } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <CopyCommand command={SITE.install} />
            <a href={SITE.repo} className="font-ui text-ui inline-flex h-12 items-center gap-2 text-ink">
              <span className="link-draw pb-1">Star on GitHub</span>
              <External size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* The mark: bleeds off the right edge and down across the seam into the statement (grid-break 1). */}
      <div
        data-hero-mark
        aria-hidden
        className="pointer-events-none absolute -bottom-[16vw] -right-[9vw] z-10 w-[58vw] text-ink
                   md:-bottom-[9vw] md:-right-[6vw] md:w-[40vw]
                   lg:bottom-auto lg:top-[23%] lg:-right-[4vw] lg:w-[30vw]"
      >
        <svg viewBox="18 14 64 72" className="h-auto w-full overflow-visible" fill="none">
          <g data-bar-wrap="top">
            <rect data-bar x="34" y="22" width="32" height="18" rx="9" fill="currentColor" opacity="0.7" />
          </g>
          <g data-bar-wrap="core">
            <rect data-bar x="26" y="41" width="48" height="18" rx="9" fill="currentColor" />
          </g>
          <g data-bar-wrap="base">
            <rect data-bar x="18" y="60" width="64" height="18" rx="9" fill="var(--color-accent)" />
          </g>
        </svg>
      </div>

      {/* Poster meta at the edges. */}
      <div data-hero-meta className="content-grid absolute inset-x-0 bottom-8 z-20 max-md:hidden lg:bottom-auto lg:top-[calc(100svh-4.25rem)]">
        <div className="flex items-end justify-between gap-8 lg:justify-end">
          <a href="#how" className="text-small group inline-flex items-center gap-2 text-ink-muted">
            <ArrowDown size={20} strokeWidth={1.5} />
            <span className="link-draw pb-0.5">This page was built from one /struq prompt</span>
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";
// toonstuk-scrub-connector (Struq showpiece recipe)
// Two words on either side of an empty ground and one bar of the accent between them. As you
// scroll the stage pins and the bar rotates, stretches and travels: it swings up from under the
// first word, crosses the screen on a steep diagonal, turns the other way, and lands as a level
// line joining the two words. Each word carries one short line of copy under it.
// Lead for an agency or a creative brand (or toonstuk-fill-rows instead).
//
// <ScrubConnector left="Kijken" right="Maken" leftText="Elk project begint met wat er al staat." rightText="Daarna tekenen we pas." />
//
// Reduced motion and phones: the composed still, the two words joined by the level bar.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  left: string;
  right: string;
  leftText?: string;
  rightText?: string;
  className?: string;
};

export function ScrubConnector({ left, right, leftText, rightText, className = "" }: Props) {
  const stage = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const bar = q("[data-bar]");
        gsap.set(bar, { rotate: -62, scaleX: 0.18, xPercent: -95, yPercent: 900 });
        gsap.set(q("[data-word-text]"), { autoAlpha: 0, y: 24 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=280%", pin: true, scrub: 1.2 },
        });
        tl.to(bar, { rotate: -38, scaleX: 0.9, xPercent: -10, yPercent: 0, duration: 1, ease: "power2.inOut" })
          .to({}, { duration: 0.2 })
          .to(bar, { rotate: 41, scaleX: 1.05, xPercent: 4, duration: 1, ease: "power2.inOut" })
          .to({}, { duration: 0.2 })
          .to(bar, { rotate: 0, scaleX: 1, xPercent: 0, yPercent: 0, duration: 1, ease: "power3.inOut" })
          .to(q("[data-word-text]"), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.4, ease: "expo.out" }, "-=0.4")
          .to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  // One fluid size, no breakpoint ladder and no px: the words scale with clamp(), and the bar's
  // thickness and its line-up with the words follow the same size, so they stay in step at any width.
  const word = "font-display block text-[length:var(--connector-word)] leading-[0.9] tracking-[-0.03em]";
  return (
    <section
      ref={stage}
      data-showpiece="scrub-connector"
      style={{ "--connector-word": "clamp(2.75rem, 1.2rem + 7vw, 9.5rem)" } as React.CSSProperties}
      className={`relative flex items-center overflow-hidden bg-surface-0 px-6 py-24 md:h-svh md:px-[5vw] md:py-0 ${className}`}
    >
      <div className="relative grid w-full grid-cols-[auto_1fr_auto] items-start gap-4">
        <div className="flex flex-col gap-4">
          <span className={`${word} text-accent`}>{left}</span>
          {leftText ? <p data-word-text="" className="max-w-[24ch] text-small text-ink-muted">{leftText}</p> : null}
        </div>
        <div className="relative mt-[calc(var(--connector-word)*0.42)] h-[calc(var(--connector-word)*0.16)] min-h-2">
          <div data-bar="" aria-hidden className="absolute inset-0 origin-center bg-ink" />
        </div>
        <div className="flex flex-col items-end gap-4 text-right">
          <span className={`${word} text-accent`}>{right}</span>
          {rightText ? <p data-word-text="" className="max-w-[24ch] text-small text-ink-muted">{rightText}</p> : null}
        </div>
      </div>
    </section>
  );
}

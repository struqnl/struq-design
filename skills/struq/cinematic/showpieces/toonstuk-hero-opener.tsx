"use client";
// toonstuk-hero-opener (Struq showpiece recipe): the full-bleed cinematic opener
// The first screen is the photo (or the WebGL scene over it), edge to edge, with the display line
// set across it at 14 to 20vw: either one poster line along the held-clear bottom ("across"), or
// the name split to the left and right edges with the photo between ("split"). One short lead and
// one confident rectangular CTA sit above the line. On scroll the opener hands over with a real
// move: it pins, scales down and darkens while the next section slides up over it.
//
// <HeroOpener image={images.hero[0]} title="Koken op" accent="vuur." lead="..." cta={{ href: "#reserveren", label: "Reserveer een tafel" }} header={<SiteHeader />} />
// <HeroOpener image={images.hero[0]} split={["Vuur", "Noord"]} lead="..." cta={...} />
//
// The line is the display face at poster size, with at most one italic accent word. The flat scrim
// keeps the copy at 4.5:1; never a gradient. Reduced motion and phones: the composed still, no pin.
// The section after the opener slides over it: globals.css gives it a ground and a higher layer.
import { useRef } from "react";
import { HeroCanvas } from "@/components/struq/HeroCanvas";
import { MagneticButton } from "@/components/struq/MagneticButton";
import { SplitHeadline } from "@/components/struq/SplitHeadline";
import { gsap, useGSAP } from "@/lib/gsap";
import type { StruqImage } from "@/lib/struq-images";

type Props = {
  image: StruqImage;
  /** The poster line ("across"). */
  title?: string;
  /** One word in the display face's italic, after the title. */
  accent?: string;
  /** Two words for the split wordmark; replaces title. */
  split?: [string, string];
  lead: string;
  cta: { href: string; label: string };
  /** The site header (with the data-wordmark name), set over the photo. */
  header?: React.ReactNode;
  /** 0.2 to 0.5: the flat scrim under the copy. */
  scrim?: number;
  className?: string;
};

export function HeroOpener({ image, title, accent, split, lead, cta, header, scrim = 0.34, className = "" }: Props) {
  const stage = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (split) {
          gsap.from(q("[data-split-word]"), { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.25 });
        }
        gsap.from(q("[data-opener-copy] > *"), { y: 32, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.7 });
      });
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // The handover: the opener holds, then scales down and darkens under the next section.
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", pin: true, pinSpacing: false, scrub: true },
        })
          .to(q("[data-opener-inner]"), { scale: 0.84, yPercent: -4, ease: "none" }, 0)
          .to(q("[data-opener-dim]"), { opacity: 0.6, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  const poster = "font-display block text-[19vw] leading-[0.92] tracking-[-0.045em] md:text-[16vw]";
  return (
    <section ref={stage} data-showpiece="hero-opener" className={`relative h-svh overflow-hidden bg-black text-on-photo ${className}`}>
      <div data-opener-inner="" className="absolute inset-0 origin-top">
        <HeroCanvas scene="ripple" image={image} grade={0.15} priority />
        <div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: scrim }} />
        <div data-opener-dim="" aria-hidden className="absolute inset-0 bg-black opacity-0" />
        {header ? <div className="absolute inset-x-0 top-0 z-20">{header}</div> : null}
        {split ? (
          <h1 aria-label={split.join(" ")} className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-6 md:px-[3vw]">
            {split.map((word) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <span data-split-word="" data-quiet="" className={poster}>
                  {word}
                </span>
              </span>
            ))}
          </h1>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-[3vh] px-6 pb-[3vh] md:px-[3vw]">
          <div data-opener-copy="" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p data-quiet="" className="max-w-[32ch] text-lead">{lead}</p>
            <div>
              <MagneticButton href={cta.href} size="lg">
                {cta.label}
              </MagneticButton>
            </div>
          </div>
          {!split && title ? (
            <SplitHeadline as="h1" className={poster}>
              {title}
              {accent ? (
                <>
                  {" "}
                  <em className="font-display font-light italic tracking-[-0.02em]">{accent}</em>
                </>
              ) : null}
            </SplitHeadline>
          ) : null}
        </div>
      </div>
    </section>
  );
}

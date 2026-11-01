"use client";
// toonstuk-manifesto-scrub (Struq showpiece recipe)
// One large statement paragraph that fills word by word as it scrolls through the screen, from a
// faint ink to full ink, with small photos set into the line that open as their place is reached.
// Write the text with {0}, {1} where a photo goes: "We koken {0} wat de markt brengt en {1} niets meer."
// Lead for editorial sites; the supporting move for restaurants and hospitality.
//
// <ManifestoScrub text="Wij koken {0} met wat de zee en het land die week geven, {1} en verder niets." images={[images.detail[3], images.card[1]]} />
//
// Reduced motion and phones: the composed still, the whole paragraph in full ink with its photos.
import Image from "next/image";
import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { StruqImage } from "@/lib/struq-images";

type Props = { text: string; images?: StruqImage[]; className?: string };

export function ManifestoScrub({ text, images = [], className = "" }: Props) {
  const stage = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-word]"), { opacity: 0.16 });
        gsap.set(q("[data-inline]"), { width: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=200%", pin: true, scrub: 1 },
        });
        q("[data-word], [data-inline]").forEach((node: Element, i: number) => {
          const at = i * 0.12;
          if ((node as HTMLElement).dataset.inline !== undefined) {
            tl.to(node, { width: "1.9em", duration: 0.5, ease: "power2.inOut" }, at);
          } else {
            tl.to(node, { opacity: 1, duration: 0.3 }, at);
          }
        });
        tl.to({}, { duration: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  const parts = text.split(/(\{\d+\})/);
  return (
    <section ref={stage} data-showpiece="manifesto-scrub" className={`relative flex items-center bg-surface-0 px-6 py-32 md:min-h-svh md:px-[8vw] md:py-0 ${className}`}>
      <p className="font-display max-w-[22ch] text-[9vw] leading-[1.02] tracking-[-0.025em] md:text-[5.2vw]">
        {parts.map((part, i) => {
          const slot = part.match(/^\{(\d+)\}$/);
          if (slot) {
            const image = images[Number(slot[1])];
            if (!image) return null;
            return (
              <span
                key={i}
                data-inline=""
                className="relative mx-[0.12em] inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden align-baseline"
              >
                <Image src={image.src} alt={image.alt} fill sizes="12vw" unoptimized={image.unoptimized} className="object-cover" />
              </span>
            );
          }
          return (
            <Fragment key={i}>
              {part
                .split(/(\s+)/)
                .map((w, j) => (w.trim() ? <span key={j} data-word="">{w}</span> : w))}
            </Fragment>
          );
        })}
      </p>
    </section>
  );
}

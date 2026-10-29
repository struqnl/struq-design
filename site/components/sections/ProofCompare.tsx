"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * One pair from the blind review. Server markup: the two heroes side by side (stacked on
 * phones), each labelled with its score, so nothing depends on motion. On wide screens
 * with motion allowed the pair becomes one frame and the with-Struq hero wipes over the
 * plain one as the reader scrolls (scrubbed, so it can be scrubbed back). At no point is
 * the frame empty: the plain build is always underneath.
 */
const GATE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function ProofCompare({
  id,
  brief,
  plain,
  struq,
}: {
  id: string;
  brief: string;
  plain: number;
  struq: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(GATE, () => {
        const el = root.current!;
        el.dataset.mode = "wipe";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 72%", end: "bottom 45%", scrub: 1, invalidateOnRefresh: true },
        });
        tl.fromTo("[data-wipe]", { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
          .fromTo("[data-wipe-edge]", { xPercent: 100 }, { xPercent: 0 }, 0);
        return () => {
          delete el.dataset.mode;
        };
      });
    },
    { scope: root }
  );

  const frame = "relative aspect-[16/10] overflow-hidden rounded-[var(--radius-base)] border border-line bg-surface-2 group-data-[mode=wipe]/cmp:rounded-r-none group-data-[mode=wipe]/cmp:border-r-0";
  const chip = "font-ui text-ui inline-flex h-9 items-center gap-2 rounded-full px-3.5";

  return (
    <div ref={root} className="group/cmp relative">
      <div className="grid gap-5 sm:grid-cols-2 group-data-[mode=wipe]/cmp:block">
        <figure className="relative">
          <div className={frame}>
            <Image
              src={`/proof/${id}-plain.webp`}
              alt={`Without Struq: the plain build for the brief "${brief}"`}
              fill
              sizes="(min-width: 1024px) 62vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <figcaption className="mt-3 group-data-[mode=wipe]/cmp:absolute group-data-[mode=wipe]/cmp:bottom-4 group-data-[mode=wipe]/cmp:left-4 group-data-[mode=wipe]/cmp:mt-0">
            <span className={`${chip} bg-surface-0 text-ink-muted ring-1 ring-line`}>
              Without <span className="stat tabular-nums text-ink">{plain}</span>
            </span>
          </figcaption>
        </figure>

        <figure
          data-wipe
          className="relative group-data-[mode=wipe]/cmp:absolute group-data-[mode=wipe]/cmp:inset-0"
        >
          <div className={`${frame} group-data-[mode=wipe]/cmp:h-full`}>
            <Image
              src={`/proof/${id}-struq.webp`}
              alt={`With Struq: the build for the same brief, "${brief}"`}
              fill
              sizes="(min-width: 1024px) 62vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <figcaption className="mt-3 group-data-[mode=wipe]/cmp:absolute group-data-[mode=wipe]/cmp:bottom-4 group-data-[mode=wipe]/cmp:right-4 group-data-[mode=wipe]/cmp:mt-0">
            <span className={`${chip} bg-ink text-surface-0`}>
              With Struq <span className="stat tabular-nums">{struq}</span>
            </span>
          </figcaption>
        </figure>

        {/* The wipe's leading edge: a flame rule riding the clip. Exists only in wipe mode. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden overflow-hidden group-data-[mode=wipe]/cmp:block"
        >
          <div data-wipe-edge className="absolute inset-0">
            <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * SHOWPIECE: pin-scrub-timeline (pinning-scrub.md §1). Four phases from README
 * "How a build runs". One GATE string decides the stage layout and the pin; below it
 * (touch, under 1024px, reduced motion, no JS) the server markup is a stacked list in
 * which every phase and its visual is readable. Continuous element: the rail fill.
 */
const GATE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const BRIEF =
  "/struq Landing page for Struq, an open-source design skill for coding agents (Claude Code, Codex, Cursor, OpenCode). One command installs it; /struq <brief> then plans and builds an award-tier, cinematic marketing site. English, one long page, for developers and designers. Goal: installs and GitHub stars. Existing brand: Struq.";

const PLAN_LINES: Array<[string, string]> = [
  ["## CONCEPT", ""],
  ["Idea", "one line in, a plan, a site"],
  ["Motif", "the mark's three bars, narrow to wide"],
  ["## SYSTEM", ""],
  ["Display", "Comfortaa 400 · House pairing"],
  ["Palette", "light · accent #E4572E"],
  ["Signature move", "fit-width-wordmark"],
  ["## PLAN", ""],
  ["Showpieces", "pin-scrub-timeline"],
  ["WebGL", "none"],
];

// Static layout first, then motion in layers (README "How a build runs"), drawn as the
// mark: the widest bar at the base, each layer narrower on top.
const LAYERS = ["3D, last", "Pointer", "Text and SVG", "Showpieces", "Composition", "Reveals", "Static layout"];

const SHOTS = [
  { w: 390, src: "/proof/verify-390.webp", ratio: "390/844", width: 390, height: 844, flex: 0.62 },
  { w: 768, src: "/proof/verify-768.webp", ratio: "768/1024", width: 768, height: 1024, flex: 1 },
  { w: 1440, src: "/proof/verify-1440.webp", ratio: "1440/900", width: 1440, height: 900, flex: 2.13 },
  { w: 1920, src: "/proof/verify-1920.webp", ratio: "1920/1080", width: 1920, height: 1080, flex: 2.36 },
];

const PHASES = [
  {
    key: "plan",
    label: "Plan",
    title: "It writes one plan.",
    body: "It reads your brief and writes one STRUQ.md: brand, concept, the two typefaces, palette tokens, icon family, the page arc, which showcase recipes go where, and whether 3D is warranted.",
  },
  {
    key: "stop",
    label: "One stop",
    title: "It asks once.",
    body: "It shows the summary and stops a single time: veto anything, and send a logo, photos or real numbers if you have them. Only an empty or vague brief gets a short wizard first.",
  },
  {
    key: "build",
    label: "Build",
    title: "It builds in layers.",
    body: "Static layout to the baseline first, at desktop and mobile at once. Then motion goes on in layers: reveals, composition, showpieces, text and SVG, pointer, then 3D.",
  },
  {
    key: "look",
    label: "Look",
    title: "It looks at its work.",
    body: "Screenshots at four widths, a tell scan, a feel audit and one full scroll, with an empty-region check on every capture. Then it fixes and shoots again.",
  },
] as const;

function PlanVisual() {
  return (
    <div className="rounded-[var(--radius-base)] border border-inverse-line bg-inverse-1 p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-inverse-line pb-4">
        <span className="eyebrow text-eyebrow text-inverse-muted">STRUQ.md</span>
        <span className="text-small text-inverse-muted">this page, abridged</span>
      </div>
      <p className="text-small mt-5 font-mono leading-relaxed text-inverse-muted">
        <span className="text-inverse-accent">&gt; </span>
        {BRIEF}
      </p>
      <dl data-plan-lines className="text-small mt-5 space-y-1.5 font-mono">
        {PLAN_LINES.map(([k, v]) =>
          v ? (
            <div key={k} data-plan-line className="flex flex-wrap gap-x-2">
              <dt className="text-inverse-muted">{k}:</dt>
              <dd className="text-inverse-ink">{v}</dd>
            </div>
          ) : (
            <div key={k} data-plan-line className="pt-2 text-inverse-accent">
              <dt>{k}</dt>
              <dd className="sr-only">section</dd>
            </div>
          )
        )}
      </dl>
    </div>
  );
}

function StopVisual() {
  return (
    <div className="space-y-8">
      <div className="border-l-2 border-inverse-accent pl-6">
        <p className="eyebrow text-eyebrow text-inverse-muted">Struq</p>
        <p className="font-display text-statement mt-3 max-w-[22ch]">
          Veto anything? If you have a logo, photos or real numbers, send them now.
        </p>
      </div>
      <div className="ml-auto max-w-[22ch] border-r-2 border-inverse-line pr-6 text-right">
        <p className="eyebrow text-eyebrow text-inverse-muted">This run</p>
        <p className="type-h3 text-h3 mt-3">No veto, go.</p>
      </div>
    </div>
  );
}

function BuildVisual() {
  return (
    <ol aria-label="Build order, foundation at the bottom" className="flex flex-col items-center gap-2.5">
      {LAYERS.map((l, i) => {
        const base = i === LAYERS.length - 1;
        const width = 34 + (i / (LAYERS.length - 1)) * 66; // narrow to wide, like the mark
        return (
          <li
            key={l}
            data-layer
            style={{ width: `${width}%` }}
            className={`font-ui text-ui flex h-12 items-center justify-center rounded-full px-4 text-center ${
              base ? "bg-inverse-accent text-inverse" : "border border-inverse-line bg-inverse-1 text-inverse-ink"
            }`}
          >
            {l}
          </li>
        );
      })}
    </ol>
  );
}

function LookVisual() {
  return (
    <figure>
      <div className="grid grid-cols-2 items-end gap-3 md:flex md:gap-4">
        {SHOTS.map((s) => (
          <div key={s.w} data-shot className="min-w-0" style={{ flex: s.flex }}>
            <div
              className="relative overflow-hidden rounded-[6px] border border-inverse-line bg-inverse-1"
              style={{ aspectRatio: s.ratio }}
            >
              <Image
                src={s.src}
                alt={`The dev-tool dry run's home page at ${s.w} pixels wide`}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover object-top"
              />
            </div>
            <p className="text-small mt-2 text-inverse-muted tabular-nums">{s.w}</p>
          </div>
        ))}
      </div>
      <figcaption className="text-small mt-4 text-inverse-muted">
        Verify shots from the dev-tool dry run in the blind review.
      </figcaption>
    </figure>
  );
}

const VISUALS = { plan: PlanVisual, stop: StopVisual, build: BuildVisual, look: LookVisual };

export function BuildSequence() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The stage opens as it arrives: a section-curtain (transitions.md §2), any width.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-stage]",
          { clipPath: "inset(0% 2.5% 0% 2.5% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: section.current, start: "top bottom", end: "top 15%", scrub: true },
          }
        );
      });

      mm.add(GATE, () => {
        const root = section.current!;
        root.dataset.mode = "rig";
        const phases = gsap.utils.toArray<HTMLElement>("[data-phase]", root);
        const labels = gsap.utils.toArray<HTMLElement>("[data-rail-label]", root);
        gsap.set(phases.slice(1), { autoAlpha: 0, yPercent: 10 });
        gsap.set(labels.slice(1), { opacity: 0.4 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.from("[data-plan-line]", { autoAlpha: 0, x: -12, stagger: 0.05, duration: 0.3 }, 0.02).to({}, { duration: 0.25 });

        phases.forEach((phase, i) => {
          if (i === 0) return;
          tl.to(phases[i - 1], { yPercent: -10, autoAlpha: 0, ease: "power2.in", duration: 0.35 })
            .to(phase, { yPercent: 0, autoAlpha: 1, duration: 0.4 }, "<0.15")
            .to(labels[i - 1], { opacity: 0.4, duration: 0.2 }, "<")
            .to(labels[i], { opacity: 1, duration: 0.2 }, "<");
          if (phase.dataset.phase === "build") {
            tl.from(
              phase.querySelectorAll("[data-layer]"),
              { autoAlpha: 0, y: 14, stagger: { each: 0.06, from: "end" }, duration: 0.3 },
              "<0.1"
            );
          }
          if (phase.dataset.phase === "look") {
            tl.from(phase.querySelectorAll("[data-shot]"), { autoAlpha: 0, y: 30, stagger: 0.07, duration: 0.35 }, "<0.1");
          }
          tl.to({}, { duration: 0.3 }); // hold, so each phase can be read standing still
        });

        // The continuous element: the rail fills across the whole sequence.
        tl.fromTo("[data-rail-fill]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: tl.duration() }, 0);

        return () => {
          delete root.dataset.mode;
        };
      });
    },
    { scope: section }
  );

  return (
    <section
      id="how"
      ref={section}
      aria-labelledby="how-title"
      data-surface="inverse"
      className="group/seq relative z-10"
    >
      <div data-stage className="bg-inverse text-inverse-ink">
        <div className="content-grid py-[7rem] md:py-[9rem] group-data-[mode=rig]/seq:h-[100svh] group-data-[mode=rig]/seq:py-0">
          <div className="grid gap-x-10 group-data-[mode=rig]/seq:h-full lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-3 group-data-[mode=rig]/seq:py-[7rem]">
              <div>
                <p className="eyebrow text-eyebrow text-inverse-muted">How a build runs</p>
                <h2 id="how-title" className="font-display text-h2 mt-6 max-w-[14ch]">
                  One prompt in. A checked site out.
                </h2>
              </div>
              <div aria-hidden className="relative hidden pl-6 group-data-[mode=rig]/seq:block">
                <span className="absolute inset-y-0 left-0 w-px bg-inverse-line" />
                <span data-rail-fill className="absolute inset-y-0 left-0 w-px origin-top bg-inverse-accent" />
                <ul className="space-y-4">
                  {PHASES.map((p, i) => (
                    <li key={p.key} data-rail-label className="font-ui text-ui flex gap-3">
                      <span className="tabular-nums text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                      {p.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="relative mt-16 space-y-24 lg:col-span-9 lg:mt-0 group-data-[mode=rig]/seq:h-full group-data-[mode=rig]/seq:space-y-0">
              {PHASES.map((p, i) => {
                const Visual = VISUALS[p.key];
                return (
                  <li
                    key={p.key}
                    data-phase={p.key}
                    className="grid gap-x-10 gap-y-10 lg:grid-cols-9 group-data-[mode=rig]/seq:absolute group-data-[mode=rig]/seq:inset-0 group-data-[mode=rig]/seq:content-center"
                  >
                    <div className="lg:col-span-3">
                      <p className="eyebrow text-eyebrow text-inverse-muted">
                        <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {p.label}
                      </p>
                      <h3 className="type-h3 text-h3 mt-4">{p.title}</h3>
                      <p className="text-body mt-4 max-w-[40ch] text-inverse-muted">{p.body}</p>
                    </div>
                    <div className="lg:col-span-6">
                      <Visual />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

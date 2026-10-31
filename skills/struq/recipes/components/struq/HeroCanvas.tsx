"use client";
// components/struq/HeroCanvas.tsx (Struq recipe): the WebGL hero layer
// A three.js layer behind the hero, with everything a production hero needs built in:
// - three.js loads in its own chunk after the page paints, never in the first-load bundle;
// - the poster (the hero photo, or the flat page surface) shows first and stays when WebGL is
//   missing; the canvas fades in over it only after its first frame;
// - device pixel ratio capped at 1.75 (1.5 on phones);
// - rendering pauses when the hero leaves the viewport or the tab is hidden;
// - prefers-reduced-motion renders ONE still frame and never animates;
// - colours come from the site tokens on :root (--surface-0, --surface-2, --ink, --accent), so the
//   scene is recoloured to the palette automatically;
// - it runs on gsap.ticker, the same clock as Lenis and ScrollTrigger.
//
// Place it as the first child of a `relative` hero section:
// <section className="relative min-h-svh">
//   <HeroCanvas scene="contours" />                      (no photo needed)
//   <HeroCanvas scene="ripple" image={images.hero[0]} /> (the hero photo, liquid under the pointer)
//   <HeroCanvas scene="dots" />                          (a field of points, for tech and mobility)
//   <div className="relative z-10">...headline...</div>
// </section>
//
// A scene from the Struq MCP (struq_achtergrond) or one of your own: write it as
// components/struq/scenes/<name>.ts exporting createScene (see scenes/types.ts) and add it to SCENES.
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { StruqImage } from "@/lib/struq-images";
import type { CreateScene, Palette } from "./scenes/types";

const SCENES: Record<string, () => Promise<{ createScene: CreateScene }>> = {
  contours: () => import("./scenes/contours"),
  ripple: () => import("./scenes/ripple"),
  dots: () => import("./scenes/dots"),
};

export type HeroSceneName = keyof typeof SCENES;

type Props = {
  scene: HeroSceneName;
  /** The poster, and the texture for "ripple". Use the same image as the hero photo. */
  image?: StruqImage;
  /** 0 to 1: how strongly the palette grade covers the photo (ripple only). */
  grade?: number;
  /** 0 to 0.6: a flat black scrim over the layer, so type set in text-on-photo reads on a photo. */
  scrim?: number;
  className?: string;
  /** Set when the poster image is the page's LCP element. */
  priority?: boolean;
};

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    surface: pick("--surface-0", "#f4efe6"),
    surface2: pick("--surface-2", "#e2d7c4"),
    ink: pick("--ink", "#1c1a17"),
    accent: pick("--accent", "#8a3b22"),
  };
}

export function HeroCanvas({ scene, image, grade = 0.25, scrim = 0, className = "", priority = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvasSlot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const slot = canvasSlot.current;
    if (!el || !slot) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const load = SCENES[scene];
      if (!load) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const { createScene } = await load();
      const THREE = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the poster stays, which is the designed fallback
      }
      const phone = window.matchMedia("(max-width: 767px)").matches;
      const dprCap = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.75);
      const canvas = renderer.domElement;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0";
      canvas.setAttribute("aria-hidden", "true");
      slot.appendChild(canvas);

      let hero: Awaited<ReturnType<CreateScene>>;
      try {
        hero = await createScene({
          THREE,
          renderer,
          palette: readPalette(),
          image: image ? { src: image.src, width: image.width, height: image.height } : undefined,
          grade,
        });
      } catch (error) {
        console.warn("[HeroCanvas] scene failed, keeping the poster:", error);
        renderer.dispose();
        canvas.remove();
        return;
      }
      if (disposed) {
        canvas.remove();
        hero.dispose();
        renderer.dispose();
        return;
      }

      const state = { time: 0, pointer: { x: 0, y: 0 }, target: { x: 0, y: 0 }, scroll: 0, velocity: 0 };
      const size = () => {
        const w = el.clientWidth || window.innerWidth;
        const h = el.clientHeight || window.innerHeight;
        // DPR cap, then a pixel budget: a full-screen shader on a 4K or ultrawide screen renders at
        // most about 2.4 million pixels. The fields are soft, so the drop in resolution is invisible.
        renderer.setPixelRatio(Math.min(dprCap, Math.sqrt(2_400_000 / Math.max(1, w * h))));
        renderer.setSize(w, h, false);
        hero.resize(w, h);
      };
      size();

      const draw = () => {
        hero.update(state);
        renderer.render(hero.scene, hero.camera);
      };

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0 });
      io.observe(el);

      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        state.velocity = Math.min(1, state.velocity + Math.hypot(x - state.target.x, y - state.target.y) * 2);
        state.target.x = x;
        state.target.y = y;
      };

      const tick = (time: number) => {
        if (!visible || document.hidden) return;
        state.time = time;
        state.pointer.x += (state.target.x - state.pointer.x) * 0.06;
        state.pointer.y += (state.target.y - state.pointer.y) * 0.06;
        state.velocity *= 0.95;
        state.scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.clientHeight)));
        draw();
      };

      const ro = new ResizeObserver(() => {
        size();
        if (reduce) draw();
      });
      ro.observe(el);

      if (reduce) {
        state.time = 12; // one composed still frame
        draw();
      } else {
        window.addEventListener("pointermove", onPointer, { passive: true });
        gsap.ticker.add(tick);
        draw();
      }
      gsap.to(canvas, { opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.1 });

      cleanup = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onPointer);
        io.disconnect();
        ro.disconnect();
        hero.dispose();
        renderer.dispose();
        canvas.remove();
      };
    };

    // Start after the page has painted, so the canvas never competes with the LCP.
    const idle = window.setTimeout(() => void start(), 120);
    return () => {
      disposed = true;
      window.clearTimeout(idle);
      cleanup();
    };
  }, [scene, image, grade]);

  return (
    <div ref={host} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden bg-surface-0 ${className}`}>
      {image ? (
        <Image
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized={image.unoptimized}
          className="object-cover"
        />
      ) : null}
      <div ref={canvasSlot} className="absolute inset-0" />
      {scrim > 0 ? <div className="absolute inset-0 bg-black" style={{ opacity: Math.min(0.6, scrim) }} /> : null}
    </div>
  );
}

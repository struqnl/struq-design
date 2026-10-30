# Stack Targets: detect Vite vs Next.js, then adapt

Every other reference file is written for **Next.js App Router** (Struq's default
stack). Most of the doctrine is framework-agnostic, but a handful of primitives are
Next-specific and will break or mislead in a Vite project. **Detect the stack before
writing any wiring code**, then translate the Next-only pieces.

---

## 1. Detect first

| Signal | Stack |
|---|---|
| `next.config.{js,ts,mjs}` present, or an `app/` directory with `layout.tsx` | **Next.js App Router**: use the reference files as written |
| `next.config` present but `pages/` not `app/` | **Next Pages Router**: providers wrap in `_app.tsx`; `template.tsx` patterns use route events instead |
| `vite.config.{js,ts}` present | **Vite**: translate per §2 (React assumed; Vue/Svelte share the concepts, different syntax) |
| neither (CRA, Astro island, Webflow, plain Vite-less) | framework-agnostic core only: Lenis/GSAP provider + CSS; skip Next primitives |

Check `package.json` deps to confirm: `next` vs `vite` + `react-dom`. If a router is
present in Vite, it is almost always `react-router-dom`, and that is what the transition
patterns below assume.

Then read the installed majors (`vite`, `react`, `tailwindcss`, `gsap`, `lenis`, the router) and record them on the `Stack:` line; the installed version beats this file whenever they disagree ([setup.md](setup.md) §0, Known API shifts). Scaffold an empty folder with `npm create vite@latest`.

---

## 2. Translation table: Next App Router → Vite

| Concern | Next App Router | Vite (React SPA) |
|---|---|---|
| **Fonts** | `next/font/google` / `next/font/local` exposing CSS vars | `@fontsource/<face>` (npm) **or** self-hosted `@font-face` in CSS; `<link rel="preload">` the woff2 in `index.html`. Map the same `--font-display-face` / `--font-body-face` vars. (Pairing and weight decisions: [typography.md](typography.md).) |
| **Lazy / SSR-free island** (WebGL) | `next/dynamic(() => import("./X"), { ssr: false })` | `React.lazy(() => import("./X"))` + `<Suspense fallback={poster}>`. A Vite SPA is already client-only, so there is no SSR tree to exclude; the lazy boundary is purely for bundle-splitting. |
| **Client/server boundary** | `"use client"` directive on leaf components | **Drop it.** It is a no-op in Vite; everything is a client component. Remove the directive when porting snippets. |
| **Providers mount point** | `app/layout.tsx` wrapping `{children}` | `src/main.tsx` (or `App.tsx`) wrapping `<App/>`: `<SmoothScrollProvider>`, etc. Same component, different host file. |
| **Per-navigation remount** (page-transition entrance) | `app/template.tsx` (re-mounts each navigation) | a wrapper keyed on `useLocation().pathname`, e.g. `<motion.div key={pathname}>` or an `<AnimatePresence mode="wait">` around the routed outlet. Same effect: fresh mount per route. |
| **Route-change transitions** | `template.tsx` + `PageTransitionProvider` ([route-transitions.md](route-transitions.md)) | `AnimatePresence` driven by the router location; the curtain/overlay logic is identical, only the trigger source changes. |
| **Images** | `next/image` (auto sizing, lazy, AVIF/WebP) | `<img>` with **explicit `width`/`height`** (or aspect-ratio box) + `loading="lazy"` + `decoding="async"`; for responsive sources use `srcset` or `vite-imagetools`. Keep explicit dims for CLS regardless. |
| **Metadata / head** | `metadata` export / `generateMetadata` | `react-helmet-async` or set tags in `index.html`. |
| **Icons** | `@struq/icons` (the default; Phosphor light the fallback) | The same React package and root CSS imports in `src/main.tsx`; non-React or Iconify-based stacks use its `iconify.json` (prefix `struq`) or `sprite.svg` ([iconography.md](iconography.md) §2). |
| **Env / public assets** | `/public`, `process.env.NEXT_PUBLIC_*` | `/public`, `import.meta.env.VITE_*`. |

---

## 3. What is identical on both (do NOT re-derive)

These carry over unchanged. Only the *mount file* differs:

- **The smooth-scroll provider**: Lenis driven by `gsap.ticker` with `autoRaf: false` +
  `lagSmoothing(0)` ([setup.md](setup.md) §2). One RAF clock. Identical code; mount it in
  `app/layout.tsx` (Next) or `main.tsx` (Vite).
- **The GSAP registry module** (`lib/gsap.ts`), `gsap.defaults`, and **all `useGSAP`
  rules**: scope ref, `contextSafe`, `autoAlpha`, animate `from` so the SSR/initial HTML
  is the final state ([setup.md](setup.md) §1, §3). The same registry covers the plugins used by [svg-motion.md](svg-motion.md) (DrawSVG, MorphSVG).
- **`gsap.matchMedia` reduced-motion guard** ([setup.md](setup.md) §4).
- **The WebGL island's `frameloop:"never"` + GSAP-ticker bridge** ([webgl-r3f.md](webgl-r3f.md) §2,
  scene recipes in [webgl-scenes.md](webgl-scenes.md)). R3F is router-agnostic; the single-clock
  wiring is the same. Only the lazy-boundary primitive changes (`next/dynamic` → `React.lazy`, per §2).
- **The scaling knob**: one CSS rule in the global stylesheet ([scaling.md](scaling.md)),
  `app/globals.css` vs `src/index.css`.
- **All Iconify usage**, the token/`@theme` system, every ScrollTrigger/scrub/pin
  technique (including every recipe in [showcase.md](showcase.md)), and all motion *values* ([feel-layer.md](feel-layer.md)).

The rule of thumb: **anything that touches the DOM, the GSAP ticker, or CSS is portable;
anything that says `next/...` or `"use client"` needs the §2 translation.**

---

## 4. Vite gotchas worth flagging

- **No SSR safety net by default.** Code that reads `window` at module scope is fine in a
  Vite SPA (no server render), but keep it in effects anyway for correctness and so the
  component stays portable back to Next.
- **`ScrollTrigger.refresh()`** is still needed after route changes and after fonts/images
  settle. Wire it to the router's location change (the App Router note in
  [setup.md](setup.md) §6 applies, just via `react-router` instead of `template.tsx`).
- **StrictMode double-invoke** in dev re-runs effects twice. `useGSAP` cleanup handles
  it, but raw `useEffect` GSAP setup will leak, which is another reason never to write raw
  `useEffect` for GSAP ([setup.md](setup.md) §3).

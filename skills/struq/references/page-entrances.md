# Per-Zone Page Entrances: the `template.tsx` layer

One arm of the page-flow system: what the *revealed* page does. Siblings: [route-transitions.md](route-transitions.md) (the cover→swap→reveal wipe this entrance overlaps) and [loaders.md](loaders.md) (the first-load overlay).

`template.tsx` re-mounts on every navigation within a route group ([setup.md](setup.md) §6), so it's where the revealed page gets a subtle entrance. It overlaps the reveal so content rises in the cover's wake rather than popping. Differentiate zones: richer for marketing, quick for app.

```tsx
// app/(marketing)/template.tsx: expressive
"use client";
import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.from(ref.current, reduce
      ? { opacity: 0, duration: 0.3, clearProps: "all" }
      : { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", clearProps: "all",
          onComplete: () => ScrollTrigger.refresh() });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

```tsx
// app/(app)/template.tsx: functional, fast
"use client";
import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, duration: 0.25, ease: "power1.out", clearProps: "all" });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

**Two non-obvious, load-bearing details:**
- **`clearProps: "all"`**: a leftover transform on this wrapper (even `translate(0,0)`) makes it a containing block for `position: fixed`, which silently breaks ScrollTrigger pinning for *every* section inside. Clearing props after the entrance removes the wrapper's footprint.
- **`ScrollTrigger.refresh()` on complete**: trigger positions measured while the page was still offset (mid-entrance) are wrong. Refreshing after it settles re-measures against the final layout so pinned/scrubbed sections don't jump.

---

## Timing reference

| Phase | Duration | Ease | Transform |
|---|---|---|---|
| Marketing entrance | 0.8s | `power3.out` | `y 24→0` + fade |
| App entrance | 0.25s | `power1.out` | fade |
| **Reduced motion** | 0.3s | none | opacity only |

---

## Anti-pattern (sweep before shipping)

- **Forgetting `clearProps`/`refresh`** → broken pins on revealed pages. If a pinned section jumps only after navigating (not on hard reload), this is the cause.

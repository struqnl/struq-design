# Navigation & Header: the most persistent component

The header is on screen for 100% of the session; the menu is the one interaction every visitor performs. Templates treat both as chrome (white sticky bar, shadow on scroll, hamburger dropdown); agencies treat the menu as **a scene**, often the most art-directed moment on the site. Assumes the providers from [setup.md](setup.md) and the z-ladder from [composition.md](composition.md) §5 (nav = `z-50`, overlay menu joins it).

---

## 1. Header anatomy

- **Contents:** wordmark left, 3 to 5 links + one CTA right (or wordmark + menu button only, the "editorial minimal" header). Anything more belongs in the footer's nav echo ([page-architecture.md](page-architecture.md) §4).
- **Height:** 4 to 5rem, authored in rem so it rides the scaling knob ([scaling.md](scaling.md)).
- **Surface:** transparent over the hero, then, once real content scrolls under it, either a **hard surface swap** (`bg-surface-0` + `border-b border-line`, on-genre for editorial/brutalist) or `bg-surface-0/80` + `backdrop-blur-md` (the one sanctioned blur in the system, cinematic and luxury registers only; every other `backdrop-blur`, glass cards above all, stays on the blocklist in [../SKILL.md](../SKILL.md) AI-default blocklist). Never a drop shadow: the border *is* the elevation ([anti-patterns.md](anti-patterns.md) §1).
- **Links:** body-size or smaller, tracked; hover = the origin-flipping underline ([micro-interactions.md](micro-interactions.md) §3 (a)), not a color swap.
- Wordmark and CTA are prime candidates for the page's 1 to 3 magnetic elements ([micro-interactions.md](micro-interactions.md) §1).

**Cheap tell:** `sticky top-0 bg-white shadow-md` with 7 gray links and a blue button. **Instead:** Transparent → surfaced on scroll, hairline-separated, 3 to 5 links, one designed CTA.

---

## 2. Scroll behavior: hide-on-down / show-on-up

The default for narrative pages: the header gets out of the way while reading (scrolling down) and returns the instant intent reverses (scrolling up). **Pick hide-on-scroll or shrink-on-scroll, never both.** Stacked behaviors read as nervous.

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

export function Header({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLElement>(null);

  useGSAP(() => {
    const show = gsap.quickTo(el.current, "yPercent", { duration: 0.4, ease: "power4.out" });

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.scroll() < 80) { show(0); el.current!.dataset.surfaced = "false"; return; }
        el.current!.dataset.surfaced = "true";
        show(self.direction === 1 ? -100 : 0); // down → hide, up → return
      },
    });
  }, { scope: el });

  return (
    <header ref={el} data-surfaced="false"
            className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6
                       transition-colors duration-300
                       data-[surfaced=true]:border-b data-[surfaced=true]:border-line
                       data-[surfaced=true]:bg-surface-0/80 data-[surfaced=true]:backdrop-blur-md">
      {children}
    </header>
  );
}
```

Craft notes:
- `quickTo` (not a tween per event): this fires every scroll frame; same one-clock rule as magnetic buttons.
- The **80px grace zone** keeps the header stable over the hero; the surface swap and the hide behavior arrive together.
- Direction flips mid-gesture must respond instantly. That's why show/hide is a `quickTo` chase, not a toggled class with a CSS transition fighting itself.
- The **shrink variant** (height 5rem → 3.5rem + wordmark scale 0.85, same trigger, `power3.out` 0.35s) suits content-heavy sites where the header should stay visible but quiet.
- Skip hiding entirely on short pages (< ~3 viewports): the behavior never gets room to read as intentional.

---

## 3. The full-screen overlay menu (the agency staple)

Menu opens = a full-viewport inverted panel wipes in; nav links render as **display type** with masked line staggers; a meta column carries contact/socials. The menu is a *destination*, not a dropdown.

**Colour: invert the page.** The recipes ship `bg-ink text-surface-0`, which reads on every light preset (Soft Modern, Warm Editorial, Luxury Minimal). On a dark preset (Dark Cinematic), where `ink` is the light colour, use `bg-surface-3 text-ink` instead. Never `bg-surface-3 text-surface-0` on a light preset: that is cream on cream. On the inverted panel, `surface-0` is the text and `surface-2` the muted tier; `ink-muted` on `ink` fails contrast ([vibe-presets.md](vibe-presets.md), token contract).

**Build it on an accessible primitive.** An overlay that covers the page is a modal dialog, and a modal needs a focus trap, Escape to close, `aria-modal` semantics, inert background content, and focus return to the trigger. Hand-rolling all of that is where menus break. Use **Radix Dialog** (`Dialog` from the unified `radix-ui` package that [setup.md](setup.md) installs) or an equivalent primitive (React Aria, Ark UI) and let it own accessibility while GSAP owns the motion. §3a shows the motion; §3b shows it wrapped in Radix, which is the version to ship.

### 3a. The motion (reference sketch)

```tsx
"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function OverlayMenu() {
  const scope = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  const { contextSafe } = useGSAP({ scope });

  const toggle = contextSafe(() => {
    const next = !open;
    setOpen(next);
    const links = gsap.utils.toArray<HTMLElement>("[data-menu-link]");

    if (next) {
      lenis?.stop(); // scroll lock: the Lenis-native way, no overflow:hidden fights
      gsap.timeline()
        .set(panel.current, { display: "block" })
        .fromTo(panel.current, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: "power4.inOut" })
        .fromTo(links,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "-=0.15")
        .fromTo("[data-menu-meta]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.1");
    } else {
      gsap.timeline({ onComplete: () => { gsap.set(panel.current, { display: "none" }); lenis?.start(); } })
        .to(links, { yPercent: -110, duration: 0.35, ease: "power2.in", stagger: { each: 0.03, from: "end" } })
        .to(panel.current, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, "-=0.1");
    }
  });

  return (
    <div ref={scope}>
      <button onClick={toggle} aria-expanded={open} aria-controls="site-menu"
              className="font-ui text-ui relative z-[60]">
        {open ? "Close" : "Menu"}
      </button>

      <div ref={panel} id="site-menu" role="dialog" aria-modal="true"
           className="fixed inset-0 z-50 hidden bg-ink text-surface-0">
        <nav className="flex h-full flex-col justify-between px-6 pb-10 pt-32">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href} className="-my-[0.1em] overflow-hidden py-[0.1em]">{/* the mask, with descender room */}
                <a data-menu-link href={l.href}
                   className="font-display text-display block">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-meta className="text-small flex justify-between">
            <span>hello@studio.com</span><span>Oslo, 14:32</span>
          </div>
        </nav>
      </div>
    </div>
  );
}
```

Load-bearing details:
- **`lenis.stop()` / `lenis.start()`** is the scroll lock. Never `overflow: hidden` on body, which fights the smooth-scroll provider and jumps the page.
- Links live in `overflow-hidden` `<li>` masks: the masked line reveal ([scroll-reveals.md](scroll-reveals.md) §3) at menu scale, with the same 0.1em descender padding as `.split-line-mask`. The exit reverses with `power2.in` at ~60% duration and `from: "end"`, the designed exit rule ([transitions.md](transitions.md) §4).
- The menu button sits **above** the panel (`z-[60]`) and swaps its label. The close affordance is designed, not a reflexive close-icon glyph.
- Menu links can navigate through the page-flow wipe ([route-transitions.md](route-transitions.md)): close the menu, then `push(href)`, never both animations at once.
- **A11y is non-optional:** `role="dialog"` + `aria-modal`, `aria-expanded`/`aria-controls` on the trigger, `Esc` closes, focus moves into the panel on open and returns to the trigger on close, and focus is trapped while open. The sketch above declares the semantics but does not implement the trap or Escape; §3b gets all of it from the primitive. Reduced motion: panel and links fade 0.2s, no travel.
- In-page anchor variant (one-pagers): links call `lenis.scrollTo(target)` after close. `anchors: true` covers plain hash links already.

### 3b. The same menu on Radix Dialog (ship this)

Radix supplies the focus trap, Escape handling, `aria-modal`, inert background, and focus return to the trigger. GSAP keeps the choreography. The only wiring decisions are who controls `open`, and when the exit finishes.

```tsx
"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { gsap } from "@/lib/gsap";
import { useLenis } from "lenis/react";

// LINKS as in §3a

export function OverlayMenu() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement | null>(null);
  const enterTl = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const pendingHref = useRef<string | null>(null);
  const router = useRouter();
  const lenis = useLenis();

  // Enter: Radix mounts the content, the ref callback plays the timeline.
  const setPanel = useCallback((node: HTMLDivElement | null) => {
    panel.current = node;
    if (!node) return;
    const links = node.querySelectorAll("[data-menu-link]");
    enterTl.current = gsap.timeline()
      .fromTo(node, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: "power4.inOut" })
      .fromTo(links, { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "-=0.15")
      .fromTo(node.querySelector("[data-menu-meta]"), { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.1");
  }, []);

  // Radix calls this for Escape, the Close button, and outside interaction.
  // Opening is immediate; closing plays the exit first, then unmounts.
  const onOpenChange = (next: boolean) => {
    if (next) { lenis?.stop(); setOpen(true); return; }
    if (closing.current || !panel.current) return;
    closing.current = true;
    enterTl.current?.kill(); // a fast close must not fight a half-played entrance
    const node = panel.current;
    gsap.timeline({
      onComplete: () => {
        closing.current = false;
        setOpen(false);
        lenis?.start();
        const href = pendingHref.current;
        pendingHref.current = null;
        if (href) router.push(href); // navigate only after the exit has finished
      },
    })
      .to(node.querySelectorAll("[data-menu-link]"),
        { yPercent: -110, duration: 0.35, ease: "power2.in", stagger: { each: 0.03, from: "end" } })
      .to(node, { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, "-=0.1");
  };

  // Keep the real href (crawlers, middle-click, new tab) but take over a plain click.
  const onLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    pendingHref.current = href;
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {/* Mobile-only menu: desktop shows inline links in the header (§4), so the trigger
          hides from md up. Drop md:hidden for an "editorial minimal" header on every width. */}
      <Dialog.Trigger className="font-ui text-ui h-12 md:hidden">Menu</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content ref={setPanel} aria-describedby={undefined}
                        className="fixed inset-0 z-50 bg-ink text-surface-0">
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>

          {/* The trigger is inert while the modal is open, so Close lives inside the panel.
              It must sit EXACTLY over the header's Menu button: same right inset as the header's
              px-6, same height (h-12) and the same vertical centre as the h-16 header bar, so the
              label swaps in place instead of jumping. Change one, change both. */}
          <Dialog.Close className="font-ui text-ui absolute right-6 top-2 h-12">
            Close
          </Dialog.Close>

          <nav className="flex h-full flex-col justify-between px-6 pb-10 pt-32">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href} className="-my-[0.1em] overflow-hidden py-[0.1em]">
                  <a data-menu-link href={l.href} onClick={(e) => onLinkClick(e, l.href)}
                     className="font-display text-display block">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div data-menu-meta className="text-small flex justify-between">
              <span>hello@studio.com</span><span>Oslo, 14:32</span>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

Notes on the Radix version:
- **Controlled `open`** is what lets the exit animation finish before Radix unmounts the content. `onOpenChange(false)` starts the exit; `setOpen(false)` runs only in the timeline's `onComplete`.
- **Scroll lock still coordinates with Lenis.** Radix applies its own modal scroll lock; keep `lenis.stop()` on open and `lenis.start()` after the exit so Lenis' wheel and touch handling halts too. Put `data-lenis-prevent` on any scrollable region inside the menu so it can scroll natively while Lenis is running elsewhere.
- **`Dialog.Title` is required** for screen readers (hide it visually with `sr-only`). `aria-describedby={undefined}` is the documented way to opt out of a description when there isn't one.
- **Focus** moves into the panel on open and returns to the trigger on close without extra code. Do not fight it with manual `focus()` calls.
- **Links navigate client-side after the exit.** A plain `<a href>` navigates immediately and cuts the exit short, and a full reload drops the Lenis and transition providers. `onLinkClick` stores the target in `pendingHref`, prevents the default, starts the exit, and `router.push` runs in the exit timeline's `onComplete`, so the motion stays strictly sequential. The `href` stays real for crawlers and modified clicks. On a site with route curtains, swap `useRouter` for `useTransitionRouter()` from the provider in [route-transitions.md](route-transitions.md) (its `push` is the same `navigate` that `TransitionLink` calls) so the menu exit hands straight into the curtain.
- **The enter timeline is kept in a ref and killed before the exit runs.** Escape pressed mid-entrance otherwise leaves two timelines writing the same `yPercent`.
- **Reduced motion:** branch with `gsap.matchMedia()` ([setup.md](setup.md) §4) and replace the travel with a 0.2s `autoAlpha` fade in both timelines.

**Cheap tell:** hamburger → white dropdown of body-size links sliding 200ms `ease-in-out`, with no focus trap and Escape ignored. **Instead:** A surface wipe, display-type links rising from masks, meta column, choreographed exit, scroll properly locked, and a real dialog primitive underneath.

---

## 4. Mobile

- **The overlay IS the mobile nav.** One menu system for all widths: desktop may *also* show inline links, mobile shows only wordmark + menu button. Never a separate "mobile hamburger dropdown." The usual split: the inline links carry `max-md:hidden`, the trigger carries `md:hidden` (§3b), and both live in the same header so the Close button can sit over Menu.
- Touch targets ≥ 48×48px for the menu button and each link row ([iconography.md](iconography.md) §7); the display-type links clear this by default.
- Hide-on-scroll stays on. It's *more* valuable on small screens where 4rem of chrome is 5% of the viewport. The `backdrop-blur` surface is fine on modern mobile; if the page is effect-heavy, prefer the hard surface swap (blur stacks with everything else on the compositor).
- The wordmark stays ≤ ~40% of viewport width; long names abbreviate to a mark.

---

## Header checklist

- [ ] Transparent over hero → surfaced after ~80px (border or sanctioned blur, never shadow)
- [ ] One scroll behavior (hide *or* shrink), quickTo-driven
- [ ] 3 to 5 links + one CTA max; overlay menu for everything else
- [ ] Menu: built on Radix Dialog (or equivalent), Lenis stop/start, masked link stagger in, reversed exit, ≤ 1s total
- [ ] Dialog semantics from the primitive: title, Esc, focus trap + return; trigger has `aria-expanded`; reduced-motion fade
- [ ] Mobile: same overlay, 48px targets, no dropdown variant

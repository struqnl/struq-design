# Pitfalls: the bugs that recur on every GSAP build

Symptom first. Find what you see in the index, read the cause, apply the fix, run the check. Every entry here has shipped in a real build at least once, usually because the recipe looked right in a static screenshot. Most of them are invisible to a typecheck, a green build and a reduced-motion screenshot; they only show with motion on, at a real scroll speed, at both 390 and 1440.

Read this file before the first tween (workflow step 6) and again at verify (step 8). The rules behind it live in [setup.md](setup.md) §5; this file is how they fail.

| What you see | Go to |
|---|---|
| The tail of g, y, p, j, q or a comma is cut off; an italic last letter loses its right edge | §1 |
| A pinned section jerks, jumps, snaps or lands in the wrong place | §2 |
| A section is an empty band with motion on, but fine under reduced motion | §3.1 |
| A Tailwind offset (`translate-y-16`, `scale-95`) is gone on an animated element | §3.2 |
| A timed entrance (match cut, hold, intro) fires over an empty frame or behind the loader | §3.3 |
| The hero flashes unsplit, then jumps into lines | §3.4 |
| Two animations fight over one element (a menu that half-closes, a jittering object) | §3.5 |
| A footer, CTA, frame or row is blank in a reduced-motion, no-JS or settled capture | §3.6 |
| Bars, lines or display type run past their frame at 390 or 1920 | §3.7 |

---

## 1. Descender clipping

**The 10-second check.** Temporarily set the text of every masked component (split headlines, the hero, the menu links, a clip-line hero, any reveal wrapper) to **`Gyp, jq.`** at its real display size, plus one line that ends in the pairing's italic accent. Screenshot at 390 and 1440, mid-animation and at rest. Every tail and the comma must be whole, and the italic's last stroke must not be sliced vertically. Then put the copy back.

### 1.1 SplitText line masks at leading under 1

- **Symptom:** descenders of a split headline are cut flat during and after the rise; at rest the line looks underlined by nothing.
- **Cause:** `mask: "lines"` wraps each line in an `overflow: clip` box exactly one line-height tall. Display leading is 0.92 to 1.0, so the glyphs are taller than the box.
- **Fix:** pad the mask and pull the margin back, so the clip box grows and the layout does not move:

  ```css
  /* globals.css: class = linesClass + "-mask" */
  .split-line-mask { padding-block: 0.1em; margin-block: -0.1em; }
  ```

- **Verify:** the 10-second check on every `SplitText` with `mask: "lines"` ([scroll-reveals.md](scroll-reveals.md) §3, [typography.md](typography.md) "Fonts and SplitText").

### 1.2 `overflow: hidden` or `clip` on a parent, or a reveal wrapper sized to the line

- **Symptom:** same clipping, but on text that is not split: a menu link, a card title inside an image frame, a text-swap button label.
- **Cause:** a hand-built mask (`overflow-hidden` on an `li`, a `h-[1em]` wrapper, a fixed-height button) clips at the line box, or a section-level `overflow-hidden` sits flush with the last line.
- **Fix:** every hand-built mask carries the same padding pulled back with a negative margin: `className="-my-[0.1em] overflow-hidden py-[0.1em]"` ([nav-header.md](nav-header.md) §3). Never size a mask with a fixed height in `em` or `px`; let padding and leading size it. A section that needs `overflow-hidden` for a bleed keeps at least `0.2em` between its edge and the last line of display type.
- **Verify:** the 10-second check on each hand-built mask, including the menu open state.

### 1.3 Clip-path insets

- **Symptom:** a `clip-path` wipe (`clip-line-hero`, a curtain over a headline) slices descenders while open, or leaves them cut when finished.
- **Cause:** `inset()` clips to the element's border box, and a heading's box at leading 0.92 is shorter than its ink.
- **Fix:** padding pulled back on the clipped element (`-my-[0.1em] py-[0.1em]`) so its box contains the ink, and `clearProps: "clipPath"` when the wipe ends so nothing clips the glyphs at rest ([page-entrances.md](page-entrances.md), `clip-line-hero`).
- **Verify:** the 10-second check, mid-wipe and after.

### 1.4 Italic overhang on the right

- **Symptom:** the last letter of an italic accent word (Fraunces italic, Cormorant italic, Newsreader italic) loses a sliver of its right side, most visible on f, y and d.
- **Cause:** italic glyphs lean past their advance width. Any horizontal clip (a line mask, `overflow-clip` on the heading, a clip-path inset at 0) cuts the overhang.
- **Fix:** inline padding pulled back, on the mask and on any clipped heading that can end in italic:

  ```css
  .split-line-mask { padding-inline: 0.08em; margin-inline: -0.08em; } /* 0.12em for Cormorant */
  ```

- **Verify:** the italic line of the 10-second check, ending the line on the italic word.

### 1.5 Tight display leading inside overflow containers

- **Symptom:** an oversized line (`scrub-headline`, a cropped display, ghost type) loses its descenders at the section's bottom edge or its accents at the top.
- **Cause:** the section is `overflow-clip` for the run-off, and the line's ink extends past its leading box into the clip.
- **Fix:** vertical padding on the section at least `0.25em` of the display size above and below the line (`py-[14rem]` in [typography.md](typography.md) `scrub-headline`), and the crop only on the axis the design crops (`overflow-x-clip`, not `overflow-clip`, when only the horizontal run-off is wanted).
- **Verify:** screenshot the line at the scrub's start, middle and end.

### 1.6 The wordmark viewBox

- **Symptom:** the logo's descender (a g, a y, a p) is cut, or the logo sits too high next to the nav links.
- **Cause:** a hand-written or exported `viewBox` from the baseline to the cap height instead of the real ink bounds.
- **Fix:** generate the outline with the script in [brand.md](brand.md) §3, whose `viewBox` hugs the ink including descenders; never edit the viewBox by hand to "fix" alignment. Align the logo by its box in CSS.
- **Verify:** the logo at nav size and at its largest use, on both surfaces.

### 1.7 Text inside pinned or transformed containers

- **Symptom:** text that was whole before the pin is clipped while pinned, or a scaled card clips its own title.
- **Cause:** the pin-spacer and a scaled or transformed parent with `overflow-hidden` both create a new clip box; a `scale: 0.92` recede ([depth-parallax.md](depth-parallax.md) §3) shrinks the box while the text keeps its leading.
- **Fix:** keep the clip on the media frame, not on the text's container; put text outside the scaled element or give the container the padding from 1.2.
- **Verify:** the 10-second check with the section pinned and mid-recede.

---

## 2. Jarring pins

**The check for every pinned section:** with motion on, scroll into it slowly, then again with one fast flick, then scroll back up through it. The pin must engage without a jump, hold without drifting, release without a jump, and the content after it must start where it should. At 390 and on touch there must be no pin at all, and the content must still read. Then reload mid-page and repeat.

### 2.1 A jerk at the moment the pin engages

- **Cause:** `anticipatePin` with Lenis. It predicts from a smoothed velocity, overshoots, and pins a frame early, then corrects.
- **Fix:** delete `anticipatePin` on every smooth-scrolled page. It exists to hide native-scroll latency that Lenis already removes ([pinning-scrub.md](pinning-scrub.md) §2).
- **Verify:** the fast flick into the pin.

### 2.2 Scrub feels laggy, mushy or jittery

- **Cause:** scrub smoothing stacked on Lenis smoothing (`scrub: 2` or more on lerp 0.1 reads as lag), or `scrub: true` on a jumpy native scroll.
- **Fix:** pair them: Lenis lerp 0.09 to 0.11 with `scrub: 1` for showpieces, `scrub: true` for departure scrubs that must feel attached to the hand ([feel-layer.md](feel-layer.md) §2). Never raise `scrub` to hide a jump; find the jump's cause below.
- **Verify:** stop scrolling mid-pin: the timeline should settle within about a second and then stand still.

### 2.3 The pin starts or ends in the wrong place, or jumps after something loads

- **Cause:** stale measurements. Triggers were measured before webfonts swapped, images got their height, an entrance finished, a route changed or a split re-ran. Horizontal tracks measured once overscroll after any resize.
- **Fix:** refresh after the layout settles, and make every measured distance a function:

  ```ts
  // after fonts, and once more after the first-load entrance or route reveal
  document.fonts.ready.then(() => ScrollTrigger.refresh());

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),           // function: recomputed on refresh
    ease: "none",
    scrollTrigger: {
      trigger: section, start: "top top", pin: true, scrub: 1,
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,                                   // re-run the functions on refresh
    },
  });
  ```

  Give every image an aspect ratio (width and height, or `fill` in a sized frame) so late loads cannot move a trigger. The providers already refresh once after mount ([setup.md](setup.md) §2) and the zone template refreshes after its entrance ([page-entrances.md](page-entrances.md)); a component that changes layout after that (an accordion, a late split) calls `ScrollTrigger.refresh()` itself.
- **Verify:** hard reload, scroll straight to the pin; then navigate to the page from another route and do it again. Both must engage at the same spot.

### 2.4 The pin jumps on mobile when the URL bar shows or hides

- **Cause:** `100vh` changes with the browser chrome, and ScrollTrigger refreshes on that resize mid-scroll.
- **Fix:** size one-screen sections with `svh` (`h-[100svh]`, `min-h-[100svh]`), never `h-screen` or `100vh`, and set `ScrollTrigger.config({ ignoreMobileResize: true })` once in the scroll provider ([setup.md](setup.md) §2). Pins are off on touch anyway (2.12); this protects the sections that remain one screen tall.
- **Verify:** at 390 in a device emulator, scroll down and back up so the URL bar collapses and returns.

### 2.5 The pinned element shifts sideways, scrolls away, or will not stick

- **Cause:** an ancestor with a `transform`, `filter`, `perspective`, `contain: paint` or `will-change: transform` becomes the containing block for `position: fixed`, so the pinned element is fixed to that ancestor instead of the viewport. The usual culprit is a page wrapper left with an inline transform by an entrance, or a smooth-scroll wrapper.
- **Fix:** clear the ancestor's transform after its entrance (`clearProps: "all"`, [page-entrances.md](page-entrances.md)) and never leave `will-change` on a wrapper. If the ancestor must keep its transform, restructure so the pinned section is not inside it, or set `pinReparent: true` on the trigger (it moves the element to `<body>` while pinned; styles scoped by the old parent then stop applying, so check it).
- **Verify:** in devtools, walk up from the pinned element: no ancestor may have a computed `transform` other than `none` while pinned.

### 2.6 A pin inside a flex or grid parent collapses or misaligns

- **Cause:** the pin-spacer replaces a flex or grid item; while pinned the element is `position: fixed` and loses the width the track gave it, or the spacer takes a different track size.
- **Fix:** pin a block-level element that is a direct child of the page flow (the section, or a full-width wrapper inside it), and put the flex or grid layout *inside* the pinned element. In [webgl-scenes.md](webgl-scenes.md) §0 the `outer` section holds the spacer and the inner `wrap` is pinned for the same reason.
- **Verify:** compare a screenshot just before the pin engages with one while pinned: nothing may change width.

### 2.7 The next section slides under or over the pin unexpectedly

- **Cause:** `pinSpacing: false`, which removes the spacer so the following content scrolls up under the pinned element.
- **Fix:** leave `pinSpacing` at its default. Use `false` only when the overlap is the design (a sticky stack, a section that should slide over the pinned one), and then give the following section a surface and a z-index on purpose.
- **Verify:** the release: the next section must start below the pin's end, or overlap it exactly as designed.

### 2.8 Nested pins

- **Cause:** a pinned section inside another pinned section, or a pin inside a horizontal track. Each pin re-parents and measures against a layout the other is changing.
- **Fix:** one pin per section tree. Inside a pinned horizontal track, use `containerAnimation` for per-panel triggers ([pinning-scrub.md](pinning-scrub.md) §2), never another pin.
- **Verify:** search the code for `pin:` and confirm no two pinned elements are ancestors of each other.

### 2.9 A pin directly under the hero

- **Cause:** the pin starts while the hero is still leaving, so the departure scrub and the pin compete for the same scroll distance, and the visitor meets a locked scroll before anything has earned it.
- **Fix:** a breather between the hero and any showpiece ([page-architecture.md](page-architecture.md) §3, [showcase.md](showcase.md) Never).
- **Verify:** the arc in STRUQ.md: no showpiece in the row after the hero, unless it is the hero.

### 2.10 A snap on first engage after a fast scroll

- **Cause:** `snap` fires as soon as scrolling stops; after a fast flick into a stepped pin, the stop lands near a phase boundary and the snap yanks the timeline to the next phase. Stale pin positions (2.3) make it worse.
- **Fix:** snap only stepped content whose phases are at least about 80% of a viewport apart, and give it a beat and no momentum:

  ```ts
  snap: { snapTo: 1 / (phases - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.15, ease: "power2.inOut", inertia: false },
  ```

  If it still yanks, remove `snap`: a continuous scrub never needs it.
- **Verify:** the fast flick into the pin, then stop: the phase that settles is the one in view, with no second move.

### 2.11 The 3D scene freezes halfway through a pinned shot

- **Cause:** the offscreen-pause trigger sits on the pinned element, measured against its unpinned box, so it toggles inactive mid-pin.
- **Fix:** put the pause trigger on the never-pinned outer section with `refreshPriority: -1` ([webgl-scenes.md](webgl-scenes.md) §0).
- **Verify:** scroll through the whole pinned shot: the scene keeps rendering to the end.

### 2.12 Reduced motion, touch and no-JS: the content must still read

- **Cause:** pinned layouts authored as the default markup (phases `absolute` and hidden with inline `opacity: 0`), with motion added on top.
- **Fix:** the server markup is the readable fallback (a stacked list, a native scroll-snap row). The pin, the stage layout and the hidden phases exist only inside one `gsap.matchMedia()` gate, set with `gsap.set` and a data attribute that matchMedia reverts ([pinning-scrub.md](pinning-scrub.md) §1 and §4). One `GATE` string decides the pin, the layout and any canvas.
- **Verify:** emulate `prefers-reduced-motion: reduce`, then 390 with touch, then JavaScript disabled: every phase's text is visible in all three.

---

## 3. Animation owners collide

### 3.1 Content stuck at opacity 0: a CSS transition and GSAP on the same property

- **Symptom:** a revealed list or grid is an empty band with motion on. Devtools shows one tween at progress 1, `y` back at 0, but inline `opacity: 0; visibility: hidden` forever. Reduced-motion screenshots look perfect, because no tween runs.
- **Cause:** the element GSAP animates also carries a CSS `transition-*` on a property GSAP writes. The usual source is a sibling-dim hover (`transition-opacity duration-500`) on the same `li` that `[data-reveal]` targets. The browser transitions every inline value GSAP writes, so the `from` tween reads a half-transitioned style and resolves its end value as 0.
- **Fix:** one owner per property per element. Reveal the wrapper, transition the child:

  ```tsx
  // The li is the GSAP target: no transition, no opacity class.
  <li data-reveal className="group">
    {/* The hover dim lives one level in. */}
    <a href={href} className="block transition-opacity duration-500
                              group-hover/list:opacity-40 group-hover/list:hover:opacity-100">
      {children}
    </a>
  </li>
  ```

  The same applies to `transition-transform` and `transition-all` on anything GSAP moves ([micro-interactions.md](micro-interactions.md) §3b, [scroll-reveals.md](scroll-reveals.md) §1).
- **Verify:** search the code: no element with `data-reveal` (or any GSAP target class) has a `transition-` class. Then scroll the page with motion on and check every revealed group ends visible.

### 3.2 A Tailwind offset vanished: `translate: none`

- **Symptom:** a staggered column offset (`lg:translate-y-16`), a `scale-95` rest state or a `rotate-2` tilt is gone on an element that animates, while the code still claims it.
- **Cause:** Tailwind (v4 or later) writes `translate-*`, `scale-*` and `rotate-*` to the individual CSS `translate`, `scale` and `rotate` properties. GSAP sets those properties to `none` inline on every element it transforms and puts its own values in `transform`, so the utility is erased.
- **Fix:** offset with layout, or on a wrapper, or inside the tween:

  ```tsx
  // padding or margin, never translate, on a GSAP target
  <li data-reveal className="lg:even:mt-16">...</li>

  // or the offset on a static wrapper, the reveal on the child
  <div className="lg:translate-y-16"><article data-reveal>...</article></div>
  ```

  For an element that must rest transformed, express the rest state in GSAP (`gsap.set(el, { yPercent: -50 })`) rather than in a utility.
- **Verify:** compare the motion-on screenshot with the reduced-motion one: the offsets must match.

### 3.3 A timed entrance fires before the image paints, or behind the loader

- **Symptom:** a match-cut hero shows an empty dark frame, then the type; the cut never reads. Or an intro plays behind the loader curtain and is over when it lifts. Static screenshots never show it.
- **Cause:** the hold starts on mount (`gsap.timeline({ delay: 1 })`) while the photo is still downloading, or the entrance starts before the thing it waits for. A delay set later with `tl.delay(1)` is ignored by `tl.play()`.
- **Fix:** start the hold from the event it depends on, with a `delayedCall`, and a fallback:

  ```ts
  const tl = gsap.timeline({ paused: true });   // the cut itself
  let started = false;
  const start = (hold: number) => {
    if (started) return;
    started = true;
    gsap.delayedCall(hold, () => { tl.play(); });
  };
  img.addEventListener("load", () => start(1), { once: true });
  if (img.complete && img.naturalWidth > 0) start(1); // cached
  gsap.delayedCall(2.5, () => start(0));               // never arrived: go straight to the type
  ```

  With a loader, start it from the loader's exit ([loaders.md](loaders.md)). The full recipe, including the LCP cost of holding: [page-entrances.md](page-entrances.md) `match-cut-hero`.
- **Verify:** the frame trace in [performance.md](performance.md) §8: the hold frame must be the photo, at 1440 and at 390, on a throttled network.

### 3.4 The hero flashes unsplit, then jumps

- **Cause:** the split runs after first paint and nothing hides the h1 in between.
- **Fix:** the pre-split guard in [typography.md](typography.md) `line-rise-hero` (a CSS rule that hides the hero only while motion is allowed, lifted by a `data-ready` attribute in the same tick as the split), plus the `<noscript>` override.
- **Verify:** the first frames of the trace: the hero is either hidden or split, never plain then split.

### 3.5 Two animations write the same property

- **Symptom:** a menu that half-closes when Escape is pressed during its entrance; a 3D object that jitters between two rotations; a header that stutters between hidden and shown.
- **Cause:** two timelines, or GSAP and Motion, or scroll and pointer, writing one property on one element.
- **Fix:** kill the running timeline before starting its opposite (keep it in a ref, [nav-header.md](nav-header.md) §3b); nest groups so scroll and pointer each own one ([webgl-scenes.md](webgl-scenes.md) §4, product-rig); use `quickTo` for anything that reverses mid-gesture; never GSAP and Motion on the same property ([../SKILL.md](../SKILL.md), GSAP vs Motion).
- **Verify:** trigger the reverse mid-animation (Escape during the menu entrance, a direction flip mid-scroll): the motion reverses cleanly.

### 3.6 A section renders empty: a blank footer, an empty frame, a CTA with nothing in it

This is the most common way an ambitious build loses craft points to a plain one: the plain build has no reveals, so it never shows an empty state.

- **Symptom:** in a full-page capture, a reduced-motion capture or mid-scroll, a whole region is blank: the footer, a CTA panel, a media frame, a list row. The reveal never ran, or ran and was reverted.
- **Cause:** the element starts hidden in CSS or from a `gsap.set` outside `matchMedia`, so the reduced-motion and no-JS branches never show it; a ScrollTrigger whose start is never reached (a footer-reveal or the last section of the page, where `top 80%` cannot happen); a reveal keyed to an element that a pin or a footer-reveal moved; a drawn SVG or canvas that waits for an event that never fires.
- **Fix:** final state is the default and hidden state is set only inside the motion branch (`gsap.from` inside `mm.add("(prefers-reduced-motion: no-preference)")`, [setup.md](setup.md) §4); triggers near the end of the page use `start: "top bottom"` or fire on load when the section is already in view (`ScrollTrigger.isInViewport`); anything drawn or loaded gets a visible fallback until it is ready.
- **Verify:** three captures, each read region by region for anything blank that should hold content: a full page with `reducedMotion: 'reduce'`, a full page with JavaScript disabled, and the motion-on scroll sequence after each step settles (wait for the longest reveal). An empty region in any of them fails verify.

### 3.7 Something overruns its frame

- **Symptom:** data bars run past their axis, a drawn line leaves its container, a wordmark or display line pushes past the viewport at 1920.
- **Cause:** values scaled to a fixed width while the frame is fluid; an axis that does not cover the data's range; display clamps without a max.
- **Fix:** scale from the measured container (or `%` of it), make the axis cover the data's max, and keep display type inside its clamp ceiling ([typography.md](typography.md)).
- **Verify:** look at the edges of every frame at 390 and 1920.

---

## 4. The pitfall pass at verify

Run it on the production server ([performance.md](performance.md) §8), motion on, at 390 and 1440:

1. The descender test from §1 on every masked component, including the menu and the italic accent.
2. Every pinned section through the check at the top of §2: slow, fast flick, back up, reload mid-page, then reduced motion, touch and no-JS.
3. A search for `transition-` and `translate-`, `scale-`, `rotate-` utilities on GSAP targets (§3.1, §3.2).
4. The frame trace of the first 3 seconds, read frame by frame (§3.3, §3.4).
5. The empty-region check: reduced-motion full page, no-JS full page, and the settled scroll sequence, each with no blank region that should hold content (§3.6); then the frame edges at 390 and 1920 (§3.7).

Write the result on the `Motion:` line under VERIFY in STRUQ.md.

# The Feel Layer: Values You'd Actually Ship

Techniques are copyable; feel is in the numbers. Two builds can run the same code and one feels like Locomotive while the other feels like a tutorial. The delta is lerp values, scrub smoothing, ease pairing, and duration scale. This file is the tuning reference for everything else in the skill.

---

## 1. Lenis: the scroll's personality

Lenis interpolates real scroll position toward the target each frame. `lerp` is the fraction covered per frame: **lower = floatier, heavier; higher = tighter, more direct.** This single number sets the personality of the entire site, because every scrub-tied effect inherits it.

| lerp | Feel | Ship it for |
|---|---|---|
| 0.05-0.07 | syrup-heavy, luxurious, slightly defiant | luxury/fashion one-pagers, short narrative scrolls. Risky: long pages feel slow to operate |
| **0.09-0.11** | **weighted but obedient (the default)** | **portfolios, studios, most marketing** |
| 0.12-0.16 | light glide, barely-smoothed | content-heavy marketing, editorial with lots of reading |
| (no Lenis) | native | dashboards, docs, apps: smoothing a tool insults the user |

Decision rule: the more *reading* per viewport, the higher the lerp; the more *imagery*, the more floor you can afford. Alternative: `duration: 1.2` + `easing` (Lenis's time-based mode) instead of `lerp`. Same idea, easier to reason about as "a scroll impulse takes ~1.2s to settle." Pick one mode, don't set both.

Always:
- `autoRaf: false` + GSAP ticker + `lagSmoothing(0)` ([setup.md](setup.md)): two clocks = micro-jitter on every scrub.
- `anchors: true` so in-page links still work.
- Under `prefers-reduced-motion`, keep Lenis mounted and gate the motion it drives (pins, parallax, scrub showpieces) in `matchMedia` branches, as [setup.md](setup.md) §2 and §4 wire it. Returning early from the provider makes native scroll look like a broken setup.

---

## 2. Scrub: direct drive vs. smoothed

`scrub: true` = value locks to scroll position exactly. `scrub: <n>` = value *chases* scroll position over ~n seconds: scroll stops, animation eases into place.

| Value | Feel | Use for |
|---|---|---|
| `true` | mechanical 1:1, instant stop | things that must feel *attached*: hero departure, progress bars, curtains the user "drags," marquee drift |
| `0.5-1` | weighted, settles after the hand stops | **default for transforms**: parallax layers, pinned sequences, horizontal scroll |
| `1.5-2.5` | cinematic float, noticeable lag | large background media, ambient/atmospheric layers |
| `>3` | detached, reads as broken | nothing |

Two interacting smoothings: Lenis already smooths the scroll *input*; scrub smooths the *output* on top. Lenis at 0.1 + `scrub: 1` is the classic pairing. If you stack Lenis 0.06 + scrub 2.5, the page feels drunk. Rule: **lower Lenis lerp → lower scrub numbers.**

Mixed rates in one section are the pro move: hero title at `scrub: true` (attached), background media at `scrub: 1.5` (floating behind it). The differential *is* the depth.

---

## 3. Ease pairing: the system, not the menu

Full curve table lives in [transitions.md](transitions.md). The shipping system:

**Pick one personality pair and use it everywhere:**
- *Cinematic*: `expo.out` entrances + `power4.inOut` moves (long tails, committed swaps)
- *Kinetic*: `power4.out` (quart) entrances + `back.out(1.4)` accents (crisp, springy)
- *Editorial-calm*: `power3.out` entrances + `power2.inOut` moves (nothing shouts)

Then three rules:
1. Entrances out-ease, exits in-ease (`power2.in`), A→B moves in-out. Never the reverse.
2. Scrubbed tweens: `ease: "none"` for tracking values; segment eases (power2) only *inside* scrubbed timelines for phase swaps.
3. `back`/`elastic` are accent spices: ≤1 element type per page (toast, badge, magnetic return). Two springy things = toy.

---

## 4. Duration & stagger scale

Durations scale with **visual mass** (size × contrast of the change), not importance. A 90vw image takes 1.2s; a 14px tag takes 0.25s; same duration on both makes one feel sluggish and the other twitchy.

| Tier | Duration | Examples |
|---|---|---|
| Micro | 0.15-0.3s | press, toggles, underline, tag slide |
| Standard | 0.4-0.7s | dropdowns, card hovers, accordion, text swap |
| Reveal | 0.7-1.1s | section entrances, split lines, masked images |
| Cinematic | 1.1-1.6s | hero entrance, page curtain + content rise, full-bleed media |
| >1.6s | n/a | only multi-part timelines; a single tween this long = user waiting |

Exits run ~60% of their entrance's duration (leaving is decisive; see [transitions.md](transitions.md) §4).

Stagger:

| each | Feel | Use |
|---|---|---|
| 0.02-0.04 | texture: perceived as one rich motion | chars, long lists (12+) |
| **0.06-0.1** | **readable rhythm (the default)** | cards, lines, nav items |
| 0.12-0.18 | deliberate, editorial | 2-4 big blocks |
| >0.2 | queueing: last item enters embarrassingly late | avoid; for n items keep `each × n ≤ ~0.8s` |

`stagger: { each: 0.08, from: "center" | "edges" | "random" }`: vary the origin by composition (centered logo walls from `"center"`, grids from `"start"`, particle-ish textures `"random"`).

---

## 5. The 60-second feel audit

Scroll the build top to bottom once, then:

1. **Stop scrolling abruptly mid-section.** Do scrubbed layers settle softly (good) or freeze instantly (raise scrub) or keep drifting awkwardly (lower it)?
2. **Watch one entrance.** Can you see it *end*? If you can't perceive the deceleration tail, the ease or duration is too timid. This is the #1 "feels like a template" cause even when the technique is right.
3. **Count clocks in a hover.** One = cheap, two-three = choreography.
4. **Flick-scroll the whole page.** Does the site stay composed (Lenis + scrub doing their job) or strobe with triggered animations firing everywhere? If strobing: too many `once` reveals triggered too late (move starts earlier, e.g. `top 85%`).
5. **Is anything moving that the user didn't cause?** Autonomous looping motion (except one deliberate marquee/ambient element) drains the premium feel. Agency motion is overwhelmingly *response*, not *activity*.

# Iconography: Iconify source + craft doctrine

Two separate decisions, never collapse them:

1. **Whether an icon earns its place**: the Struq taste gate. Most marketing
   sections need *fewer* icons than the reflex wants; icon-as-filler is an AI tell.
2. **How the icon behaves once it's in**: the craft doctrine below (family, register,
   color, state, animation timing, accessibility).

The gate (§1) governs *where*; the doctrine (§2 to §8) governs *how*. A perfectly-crafted
icon in the wrong place is still wrong.

---

## 1. The gate: does it earn its place?

Keep the existing bans hard:

- **Never** as 3-up feature-card filler (centered icon + h3 + two gray lines), the single
  most recognizable generated section ([anti-patterns.md](anti-patterns.md) §2, §13).
- **Never** Sparkles / Rocket / Zap / lightning, or emoji (🚀✨💡). They are the visual signature
  of generated UI.
- **Never** in a colored circle/chip background.
- **Never** five sizes / five strokes scattered across a page.

Icons **earn their place** when they do real work:

- **Functional affordances**: nav, search, close, chevrons, form-field states, toggles.
- **Scannability** in menus and dashboards: a per-row icon lets the eye decode the list
  faster than text alone (humans parse a glyph in ~1/10s).
- **Button visual-anchors**: an icon on a CTA gives a fast hint of the action.
- **Paragraph / feature separators**: between blocks of a "wall of text," an icon marks a
  visual point of separation. It must *reinforce* the message, never *replace* it.

When in doubt, **no icon**. Hairline rules, ghost type, a single oversized numeral as an
accent, or real imagery often carry decoration better in a marketing context.

---

## 2. Source: one coherent family per project, chosen in this order

The family is a SYSTEM decision, recorded in STRUQ.md ([direction.md](direction.md) §4), not
something picked per component. Resolve it top to bottom and stop at the first that fits:

| # | Family | When | Install | Weight to match light display type |
|---|---|---|---|---|
| 1 | **The brand's own icons** | The client already has a drawn set | their files, inlined as components | as drawn |
| 2 | **Struq Icons** | The default for every Struq build: a two-tone set (a base tone plus an accent on the part that carries the meaning), each icon with its own hover motion and a draw-in variant, colors set by CSS custom properties | `npm i @struq/icons` (until it is published, skip to 3) | stroke 2 on a 24 grid; set `strokeWidth={1.5}` next to 300-weight display |
| 3 | **Phosphor** | Struq Icons lacks icons the site needs, or the concept wants a softer, rounder line | `npm i @phosphor-icons/react`, or Iconify `ph:` | `weight="light"` (or `"thin"` for luxury) |
| 4 | **Iconoir** or **Tabler** | A sharper, more technical or architectural line | `npm i iconoir-react` / `@tabler/icons-react`, or Iconify `iconoir:` / `tabler:` | Tabler `stroke={1.25}`; Iconoir `strokeWidth={1.25}` |

**Never Lucide as the reflex.** It is the default of every generated UI, so it reads as
generated. **Never two families on one site.** If Struq Icons is missing an icon, either draw
the missing icon to its rules (24 grid, 2 to 22 live area, round caps and joins, one accent
part of 15 to 40% of the ink) or move the whole site to the next family. Patching gaps with a
second set is the icon version of three display fonts on one page.

Struq Icons' two tones follow one rule: **at rest an icon is one tone** (the accent takes the
line color); the accent shows on hover, focus, and current or selected state. Set it once in
CSS on interactive elements, not per component.

**Iconify** is the transport for families 3 and 4 when you want any family through one
component: one API over about 200k icons across every major set.

```bash
# Next / any React              # Vite (compile-time, zero runtime, tree-shaken)
npm i @iconify/react            npm i -D unplugin-icons @iconify/json
```

```tsx
// @iconify/react: works in both Next and Vite
import { Icon } from "@iconify/react";
<Icon icon="ph:arrow-up-right" className="size-5 text-ink" />   // Phosphor
<Icon icon="iconoir:search" className="size-5 text-ink" />       // Iconoir
```

```ts
// Vite alternative: unplugin-icons, imported as components (no runtime fetch)
import ArrowUpRight from "~icons/ph/arrow-up-right";
<ArrowUpRight className="size-5 text-ink" />
```

**Pick one family and stay in it.** Consistency in *style, weight, corner treatment, and
fill-vs-stroke* is what makes an icon set read as designed. Lock the chosen family in the
project's icon component so nothing else can be imported by accident.

---

## 3. Two registers: system vs decorative

| Register | Use | Traits |
|---|---|---|
| **System** | menus, buttons, inputs, table rows, anything **≤24px** | minimal, reduced to essentials, legible at small size, single stroke |
| **Decorative / expressive** | bigger explanatory moments, feature anchors, animated (Lordicon/Lottie) | richer, more detail, only at **larger** sizes |

**Complex/decorative icons die at small sizes**: their detail turns to mud below ~24px.
If it's small, it's a system icon. If it's expressive, it's big. Don't mix the registers
within one role.

One stroke (typically `strokeWidth={1.5}` for line families), one size token per context
(e.g. `size-5` inline, `size-6` nav), ink-colored by default.

---

## 4. Color

- **One color across the set** by default: ink. An icon set in four hues reads as no
  decision made (same rule as the one-accent color system).
- Color earns its place only for **state** (hover/pressed/active) and **semantics**:
  red/warning for errors, a success check, etc.
- Never rely on color *alone* to carry meaning (accessibility, see §7).

---

## 5. States & feedback

An icon the user can act on must *look* actionable and must confirm the action:

- Distinct **default / hover / pressed**, via motion, color, or both. A clickable icon
  that never changes reads as decoration.
- **Feedback through the icon itself:** a checkmark confirms success, a warning sign flags
  an error, a state-swap (empty→full trash) signals what happened. Digital UI lacks the
  physical click of a real switch, so this feedback matters *more*, not less.

---

## 6. Animated icons (Lordicon / Lottie): timing is locked

Animated icons convey more meaning than static ones and drive engagement, but only with
discipline. The same budget as micro-interactions applies: **2 to 3 per view**, never a field
of looping motion.

**Timing (hard limits):**

| Trigger | Duration | Notes |
|---|---|---|
| **Click / tap** | **≤ 500ms** | must keep up with repeat clicks; longer feels out of sync and becomes a distraction by the 3rd press |
| **Hover (decorative)** | **1500-3000ms** | the delight sweet spot; more complex symbol → longer end of the range |
| GIF fallback loop | **2000-5000ms delay between loops** | only if tech forces a looping GIF |

**Rules:**

- **No constant loops in dashboards / standard UI.** They become an unwelcome
  distraction (especially for attention-sensitive users). Trigger on hover instead.
  A looping animation is fine *as a page loader*, not as ambient dashboard decoration.
  (This rhymes with the skill-wide "nothing moves that the user didn't cause" principle,
  [feel-layer.md](feel-layer.md) §5.)
- **No extreme flashing or flickering**: a seizure/motion-sensitivity hazard. Smooth the
  frequency; never strobe.
- **Natural physics only.** Motion that breaks real-world dynamics (unnatural bounce,
  impossible 3D, irregular movement) leaves users unsettled and confused. Smooth, weighted,
  accurate. Every movement must serve a purpose and match the icon's meaning (a security
  icon shouldn't "wave and wiggle").
- **Don't overload.** Too many animated icons, especially on loop, drown the message.

Animated icons are a micro-interaction: they obey the same library split and gating as
everything in [micro-interactions.md](micro-interactions.md). Lottie/Lordicon players are
state/lifecycle-driven (Motion territory for triggering), hover effects are
`@media (hover: hover)`-gated, and **reduced-motion → static icon** (render the still
frame, never the animation).

---

## 7. Accessibility

- **Meaningful icon:** give it an accessible name via `aria-label` (or visible label, §8).
  An icon that carries content needs alt text so screen readers convey it.
- **Decorative icon:** `aria-hidden`, which keeps it out of the a11y tree entirely.
- **Never color-alone** for meaning (color-vision-deficient and low-vision users). Pair
  with shape, label, or motion.
- **Touch target ≥ 48×48px**: the tappable area can exceed the visual glyph. Keep spacing
  between grouped tappable icons so they don't misfire.
- **Reduced motion** → static icon (see §6).

---

## 8. Labels, universal icons, conflicts

- **Labels:** before users click, they need to know what to expect. Universal icons (home,
  play, stop, pin, search) are self-evident; anything ambiguous needs a **1 to 3 word label**
  using an action word (Buy, Continue, Subscribe). Icons reinforce; labels disambiguate.
- **Universal icons reduce cognitive load.** Lean on the globally-recognized set where it
  fits, beyond cultural differences.
- **Conflicting icons** (heart vs star both mean "favorite/save/rate"): don't avoid them,
  **consciously pick one** and label its function clearly. Don't use one icon for two
  purposes or two icons for one purpose.
- **Cultural context** matters for unique/symbolic icons, so consider the audience.
- **Test** new icons with outsiders for *recognizability* (do they understand it?) and
  *memorability* (do they recall it a week later?). Re-design or add a label if not.

---

❌ **Cheap tell:** Lucide `Sparkles`/`Rocket`/`Zap` in colored circle chips, 3-up, as
feature decoration; an animated icon looping forever in a dashboard; a 500ms+ click
animation that lags the cursor; a tiny decorative icon turned to mud at 16px.
✅ One deliberately-chosen Iconify family, system vs decorative registers kept separate,
ink-colored with color only for state/semantics, animated only where it informs and
within the timing limits, labeled where not universal, `aria` correct, ≥48px targets.

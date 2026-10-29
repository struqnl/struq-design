# Struq

**Award-tier web design for your coding agent.**

Struq is a design skill for Claude Code, Codex, Cursor and OpenCode. Give it a brief and it builds a cinematic, agency-grade site: the kind with large light type, a restrained palette, smooth scroll, masked reveals, a pinned showpiece, full-screen page transitions and, where it earns its place, a 3D moment. It ships the decisions an award-winning studio makes, in the order they make them, on the stack they use.

The icon set the skill uses by default, Struq Icons, is browsable at [struq.nl/iconen](https://struq.nl/iconen).

```bash
npx skills add deckdot/struq-design -g
```

Then, in your agent:

```text
/struq a portfolio for an architecture studio in Rotterdam, dark, calm, lots of photography
```

| Agent | How to invoke |
|---|---|
| Claude Code (installed with `npx skills`) | `/struq <brief>` |
| Claude Code (installed as a plugin) | `/struq:struq <brief>` |
| Codex | `$struq <brief>` |
| Cursor | invoke the struq skill by name: "use the struq skill to build ..." |
| OpenCode | invoke the struq skill by name: "use the struq skill to build ..." |

## What you get

**One recipe, fixed on purpose.** The expensive feel comes from these pieces sharing one animation clock, not from any single effect.

| Layer | Tooling |
|---|---|
| Typography | Two faces from the Signature pairing set, set through role tokens. Display runs large and light (300 to 400). A fluid scale, one typographic signature move per site, SplitText choreography. |
| Palette | Temperature-shifted neutrals, one accent, light and dark surface ladders |
| Scroll | Lenis on the GSAP ticker, ScrollTrigger scrub, masked reveals, never opacity-only fades |
| Showpieces | 23 named recipes, each tagged showpiece or system: pinned scrub timelines, horizontal galleries, sticky stacks, path journeys, manifesto fills |
| SVG | DrawSVG and MorphSVG: self-drawing marks, logo morphs, scroll-drawn paths |
| Pointer | Magnetic buttons, cursor followers, hover scenes, image distortion |
| Page flow | Full-screen cover, swap and reveal route transitions, session-gated loaders, Radix overlay menus |
| 3D | Three.js, React Three Fiber, Drei and postprocessing as lazy islands with poster fallbacks |
| Direction | A directed mode for full WebGL experiences: chapters, camera shots, handoffs, ownership |

Stack: Next.js App Router and Tailwind by default, Vite supported. It reads the versions your project has installed and adapts to them; nothing is pinned. Every GSAP plugin used is free on npm. Icons: [Struq Icons](https://struq.nl/iconen) (`@deckdot/struq-icons`, MIT) by default.

## Commands

| Command | What it does |
|---|---|
| `/struq <brief>` | Plans the site into one `STRUQ.md`, stops once for your veto, builds it, then screenshots it at 390, 768, 1440 and 1920 and fixes what it sees |
| `/struq redesign <path>` | Keeps your brand, copy and components; rebuilds the execution |
| `/struq audit <path-or-url>` | Changes nothing. Returns a score out of 100, every tell with its fix, and the three highest-payoff changes |
| `/struq direct <brief>` | Directed mode for one continuous 3D experience across chapters |

In Codex, use `$struq` instead of `/struq`; as a Claude Code plugin the command is `/struq:struq`.

## How a build runs

1. **Plan.** It reads your brief and writes one `STRUQ.md`: brand, concept, the two typefaces, palette tokens, icon family, page arc, which showcase recipes go where, the transition system, and whether 3D is warranted. It never invents testimonials or stats.
2. **One stop.** It shows the summary and asks once: veto anything, and send a logo, photos or real numbers if you have them. Only an empty or vague brief gets a short wizard first.
3. **Build.** Static layout to the baseline first, at desktop and mobile at once. Motion goes on in layers: reveals, composition, showpieces, text and SVG, pointer, then 3D.
4. **Look.** Screenshots at four widths, a tell scan, a feel audit and one full scroll. Then it fixes and re-shoots.

## Install options

```bash
# every supported agent on this machine
npx skills add deckdot/struq-design -g

# one agent only
npx skills add deckdot/struq-design -g --agent claude-code
```

As a Claude Code plugin (the command is then `/struq:struq`):

```text
/plugin marketplace add deckdot/struq-design
/plugin install struq@struq
```

Node 18+ is required. The screenshot step uses whatever browser tool your agent has (Playwright or similar).

## Struq Icons

Struq builds use [Struq Icons](https://struq.nl/iconen) by default: 182 two-tone icons, most with their own hover motion, MIT.

```bash
npm install @deckdot/struq-icons
```

## License

MIT

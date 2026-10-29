// Every fact on the page lives here, so nothing is retyped (and nothing is invented) per section.
export const SITE = {
  name: "Struq",
  url: "https://struq.design",
  repo: "https://github.com/Deckdot/struq-design",
  icons: "https://struq.nl/iconen",
  studio: "https://struq.nl",
  author: "Roy Heilbron",
  install: "npx skills add deckdot/struq-design -g",
  iconsInstall: "npm install @deckdot/struq-icons",
  title: "Struq: design taste for your coding agent",
  description:
    "Struq is an open-source design skill for Claude Code, Codex, Cursor and OpenCode. One command installs it; /struq plans and builds an award-tier marketing site.",
} as const;

export const NAV = [
  { href: "#proof", label: "Proof" },
  { href: "#how", label: "How it runs" },
  { href: "#commands", label: "Commands" },
  { href: "#inside", label: "Inside" },
] as const;

export const AGENTS = ["Claude Code", "Codex", "Cursor", "OpenCode"] as const;

// The blind review (README "Same brief, with and without Struq").
export const REVIEW = {
  average: { plain: 57, struq: 77 },
  invented: { plain: 36, struq: 10 },
  tells: { plain: 22, struq: 8 },
  rows: [
    {
      id: "saas",
      brief: "Open-source dev-tool landing page",
      plain: 50, struq: 76,
      invented: [11, 2], tells: [10, 2],
      without: "the dark developer-tool template, item for item.",
      with: "a light page built around a trace waterfall that assembles as you scroll.",
    },
    {
      id: "ceramics",
      brief: "Ceramicist portfolio, no logo, no photos",
      plain: 56, struq: 79,
      invented: [14, 5], tells: [6, 3],
      without: "a tidy template with a stat strip, a chef quote and a bio the brief never supplied.",
      with: "a single-line profile drawing of each piece stands in for the missing photos.",
    },
    {
      id: "ebike",
      brief: "E-bike launch, existing brand, wants 3D",
      plain: 66, struq: 76,
      invented: [11, 3], tells: [6, 3],
      without: "a pinned 3D bike and a spec sheet the brand never published.",
      with: "a pinned 3D bike, the lime belt as the one motif, and unknown specs openly held back.",
    },
  ],
} as const;

export const COMMANDS = [
  {
    cmd: "/struq <brief>",
    body: "Plans the site into one STRUQ.md, stops once for your veto, builds it, then screenshots it at 390, 768, 1440 and 1920 and fixes what it sees.",
  },
  {
    cmd: "/struq redesign <path>",
    body: "Keeps your brand, copy and components. Rebuilds the execution.",
  },
  {
    cmd: "/struq audit <path-or-url>",
    body: "Changes nothing. Returns a score out of 100, every tell with its fix, and the three changes with the most payoff.",
  },
  {
    cmd: "/struq direct <brief>",
    body: "Directed mode: one continuous WebGL experience across chapters, with camera shots and handoffs.",
  },
] as const;

export const INSIDE = [
  {
    title: "Plan first, veto once",
    body: "Brand, concept, two typefaces, palette, icons, the page arc and its showpieces go into one STRUQ.md before the first component. One stop for your veto, then it builds.",
  },
  {
    title: "Two faces, set light",
    body: "The Struq Signature pairings: one display face, one text face, display run large and light at 300 to 400. Hierarchy from scale, never from bold.",
  },
  {
    title: "Curated palettes",
    body: "Temperature-shifted neutrals do the work. One accent, used where you act.",
  },
  {
    title: "One clock",
    body: "Lenis smooth scroll on the GSAP ticker, so every scrub, pin and reveal samples the same frame.",
  },
  {
    title: "Text and SVG that move",
    body: "SplitText line masks, DrawSVG strokes and MorphSVG marks, each with a reduced-motion state that reads.",
  },
  {
    title: "23 named showcase recipes",
    body: "Pinned scrub timelines, horizontal galleries, sticky stacks, path journeys, manifesto fills. Each has an id, a cost and a mobile fallback.",
  },
  {
    title: "Page flow",
    body: "Full-screen route transitions, session-gated loaders and Radix overlay menus. No hard cuts.",
  },
  {
    title: "3D with a poster",
    body: "React Three Fiber moments as lazy islands, with a poster before and instead of the canvas.",
  },
  {
    title: "Found and fast",
    body: "Metadata, an OG image per route, sitemap and JSON-LD. Budgets for every image, video, model and font, and for the first-load JS.",
  },
  {
    title: "A pitfalls clinic",
    body: "Symptom first: clipped descenders, jerking pins, reveals stuck invisible, empty regions. Each with the cause, the fix and the check.",
  },
] as const;

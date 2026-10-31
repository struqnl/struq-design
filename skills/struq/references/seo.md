# SEO, social images and site structure

A cinematic site that nobody finds, or that shows a blank grey card when it is shared, has failed at the first impression. These are the basics every Struq build ships, wired the Next.js App Router way (Vite notes at the end). They are cheap, and most of them have to be decided in the plan, not patched after launch.

## 1. Site structure (decided in the PLAN phase)

- **Flat and named.** Every page is at most two levels deep: `/work`, `/work/<slug>`, `/studio`, `/contact`. Slugs are lowercase words in the site's language, never ids.
- **One page, one job, one h1.** By default the hero display line **is** the h1: write it so it says what the page is about in words someone would search. Only when the display line is deliberately not descriptive (a poetic claim, a single word) does the h1 become a smaller line above it, with the display line as a `p` in display styling.
- **Headings in order.** h1, then h2 per section, h3 inside. A caption or meta line is a `p`, not a heading. Visual size and heading level are separate decisions.
- **Every important page linked from the nav or the footer** with a real `<a href>` (the `TransitionLink` from [route-transitions.md](route-transitions.md) renders one). A route reachable only through a JavaScript click handler does not exist to a crawler.
- **A real 404** (`app/not-found.tsx`) designed as hard as the hero, with a way back.

Record the page list and slugs under PLAN in STRUQ.md ([direction.md](direction.md)).

## 2. Metadata

Set the base once in the root layout, then per page:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: { default: "Name: what it is in five words", template: "%s | Name" },
  description: "One or two plain sentences, 140 to 160 characters, written for a person, not a keyword list.",
  // No alternates.canonical here: metadata merges down, so a root canonical of "/"
  // would mark every page as a duplicate of the home page. Set it per page.
  openGraph: { type: "website", siteName: "Name", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};
```

```tsx
// app/page.tsx: the home page sets its own canonical too
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
```

```tsx
// app/work/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}
```

- `metadataBase` makes every relative OG and canonical URL absolute. Without it, shared links break.
- Titles: the page's own name first, the brand after (`%s | Name`). Under about 60 characters.
- One canonical per page, set in that page's own `metadata` or `generateMetadata`, never in the root layout. Multi-language sites add `alternates.languages`.
- Add the theme color to `viewport` so mobile browser chrome matches the surface: `export const viewport = { themeColor: "#0A0A0B" }`.

## 3. Open Graph images: one per route, designed as posters

The OG image is the site's first impression in every chat app and social feed. Design it like a poster from the same system as the site: the surface color, the display face at a light weight, the wordmark, one line, generous margins. Never a screenshot of the hero, never a default grey card.

Every route that gets shared gets its own image via the file convention: an `opengraph-image.tsx` next to the route's `page.tsx`.

```tsx
// app/opengraph-image.tsx (and app/work/[slug]/opengraph-image.tsx for per-project cards)
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Name: what it is";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // next/og needs the font as data: a TTF, OTF or WOFF of the display face in the repo (Fontsource WOFF works, brand.md §3).
  const display = await readFile(join(process.cwd(), "assets/fonts/Display-Light.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0A0B",
          color: "#EDEAE4",
          fontFamily: "Display",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6 }}>
          Name
        </div>
        <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 300, maxWidth: 900 }}>
          The one line the page is about.
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Display", data: display, weight: 300, style: "normal" }] }
  );
}
```

- `ImageResponse` renders a flexbox subset of CSS: every element with more than one child needs `display: "flex"`. No grid, no `clamp()`.
- It needs TTF, OTF or WOFF font data, not WOFF2. Keep a TTF of the display face in the repo for this.
- Per-project images pull the project's title and, if it reads at card size, its cover image as an `<img>` with an absolute URL. In a dynamic segment the image receives the params as a promise, like the page does:

```tsx
// app/work/[slug]/opengraph-image.tsx
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  // ...same ImageResponse as above, with project.title as the line
}
```
- Twitter and X use the same image when `twitter.card` is `summary_large_image`; add `twitter-image.tsx` only when it should differ.
- Check every card at real size before shipping: text over 60 characters wraps badly at 96px.

## 4. Sitemap and robots

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://example.com";
  // A constant, not new Date(): with cacheComponents on, a request-time date breaks the prerender
  // (setup.md §0, Known API shifts). Bump it when the content changes.
  const LAST_UPDATED = "2026-01-15";
  const projects = await getProjects();
  return [
    { url: base, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${base}/contact`, lastModified: LAST_UPDATED, changeFrequency: "yearly", priority: 0.5 },
  ];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

Every page in the PLAN's page list appears in the sitemap; nothing that 404s does. A staging deploy must disallow everything (`disallow: "/"`) so it never gets indexed.

## 5. Structured data

One JSON-LD block per page type, server-rendered:

```tsx
// in a server component
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization", // LocalBusiness for a place, Person for a portfolio, Product for a product page
  name: "Name",
  url: "https://example.com",
  logo: "https://example.com/brand/mark.png",
  sameAs: ["https://www.instagram.com/name"],
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

Add `BreadcrumbList` on nested pages and `FAQPage` only when the page really has a visible FAQ. Never mark up content that is not on the page.

## 6. Where cinematic sites lose SEO, and the fix

| Risk | Fix |
|---|---|
| A loader that covers the page delays the Largest Contentful Paint | The hero renders and paints underneath; the loader is an overlay, session-gated, and never blocks HTML ([loaders.md](loaders.md)). Never render the hero only after the loader finishes. |
| SplitText turns the h1 into dozens of spans for screen readers | Use SplitText's `aria` option (the default `"auto"` keeps an accessible label on the parent); never split before fonts are ready ([typography.md](typography.md)) |
| Content that only exists after a scroll animation, or starts at `opacity: 0` in server HTML with no fallback | Animate `from` so final state is the default; content stays readable with JavaScript off and under reduced motion ([setup.md](setup.md) §4) |
| Text inside a WebGL canvas | Real copy lives in the DOM; 3D text is decoration with the same words in the DOM next to it ([webgl-scenes.md](webgl-scenes.md)) |
| Heavy 3D or video on first load | Lazy islands with posters ([webgl-r3f.md](webgl-r3f.md)); the poster image is the LCP candidate, sized and preloaded |
| Route transitions built on client-only navigation | `TransitionLink` keeps a real `href`; every route is server-rendered and works on direct load |
| Images without dimensions | `next/image` with width and height or `fill` in a sized frame; descriptive `alt` for content images, empty `alt` for decoration |
| Fonts swapping and shifting the layout | `next/font` with `adjustFontFallback` ([typography.md](typography.md)) |

**Performance floor to check in verify:** LCP under 2.5s, CLS under 0.1, INP under 200ms on a mid-range phone profile. Run Lighthouse or PageSpeed once on the production build for LCP and CLS; lab Lighthouse reports TBT, not INP, so INP comes from field data or a manual interaction trace ([performance.md](performance.md) §8). Record the numbers under VERIFY in STRUQ.md.

## 7. Vite

No metadata API: set title, description, canonical and OG tags per route in the HTML or with a head manager, ship static OG PNGs per shared page, and generate `sitemap.xml` at build time (a small script over the route list, or a sitemap plugin). A client-only SPA is weak for SEO; if search matters, prerender the routes or use Next.js.

## Checklist

- [ ] `metadataBase`, title template and description in the root layout; a canonical on every page (home included), none in the layout
- [ ] An `opengraph-image` per shared route, designed from the system, checked at real size
- [ ] `sitemap.ts` covers every page; `robots.ts` points at it; staging disallows all
- [ ] One h1 per page (the hero display line, unless it is not descriptive), headings in order, captions are not headings
- [ ] JSON-LD for the page type
- [ ] Every route reachable by a real link and server-rendered on direct load
- [ ] Loader and animations never hide content from the server HTML
- [ ] LCP, CLS and INP recorded under VERIFY

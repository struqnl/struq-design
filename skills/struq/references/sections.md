# Sections: patterns for the arc

Copy a pattern, then make it the brief's own: the copy, the photos, the proportions. Each one uses the recipes (`components/struq/`) and the role tokens, never a raw size, never a label above a heading. Vary them: two neighbours never share a layout.

Imports for every pattern on this page:

```tsx
import { HorizontalGallery } from "@/components/struq/HorizontalGallery";
import { MagneticButton } from "@/components/struq/MagneticButton";
import { MediaFrame } from "@/components/struq/MediaFrame";
import { PinnedZoom } from "@/components/struq/PinnedZoom";
import { Reveal } from "@/components/struq/Reveal";
import { SplitHeadline } from "@/components/struq/SplitHeadline";
import { imageCredit, images } from "@/lib/struq-images";
```

## Header

Sits over the hero, not a bar. The name in the display face, two or three links, the CTA. No pill, no blur.

```tsx
<header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-[8vw]">
  <a href="/" className="font-display text-h3">Zout</a>
  <nav className="flex items-center gap-8 text-small">
    <a href="#kaart" className="hidden md:inline">Kaart</a>
    <a href="#zaal" className="hidden md:inline">De zaal</a>
    <MagneticButton href="#reserveren" variant="line">Reserveer</MagneticButton>
  </nav>
</header>
```

On a ripple hero, give the header `text-on-photo`. A multi-page site with a menu: [nav-header.md](nav-header.md).

## Orient: a statement beside an image that bleeds off the edge (grid break)

```tsx
<section className="grid gap-12 px-6 py-32 md:grid-cols-12 md:gap-8 md:px-[8vw] md:py-48">
  <Reveal className="flex flex-col gap-6 md:col-span-5 md:pt-[14vh]">
    <h2 className="font-display text-h2">Eén kaart, die meebeweegt met de markt.</h2>
    <p className="max-w-[44ch] text-body text-ink-muted">Wat de vissers en telers die week brengen, staat zaterdag op tafel. De kaart is kort, en elke week een beetje anders.</p>
  </Reveal>
  <MediaFrame image={images.column[0]} ratio="4/5" sizes="(min-width: 768px) 50vw, 100vw" className="md:col-span-6 md:col-start-7 md:-mr-[8vw]" />
</section>
```

## Prove: hairline rows instead of cards

For a menu, services, a process, projects. Title left, text offset right, the figure (a price, a year) in tabular figures at the end. Only facts the brief gave: no invented prices.

```tsx
<section className="px-6 py-28 md:px-[8vw] md:py-40">
  <SplitHeadline as="h2" on="scroll" className="font-display text-h2 max-w-[16ch]">Deze week op de kaart</SplitHeadline>
  <Reveal as="ul" className="mt-16 divide-y divide-line border-y border-line">
    {rows.map((row) => (
      <li key={row.title} className="grid gap-3 py-8 md:grid-cols-12 md:gap-8">
        <span className="font-display text-h3 md:col-span-5">{row.title}</span>
        <span className="max-w-[48ch] text-body text-ink-muted md:col-span-5 md:col-start-7">{row.text}</span>
      </li>
    ))}
  </Reveal>
</section>
```

## Band: a full-bleed photo with one line overlapping its edge

```tsx
<section className="relative">
  <MediaFrame image={images.band[0]} ratio="21/9" sizes="100vw" className="w-full" />
  <Reveal className="relative z-10 -mt-[10vh] px-6 md:px-[8vw]">
    <p className="font-display text-h2 max-w-[18ch] bg-surface-0 pt-8 pr-10 md:max-w-[22ch]">Brood uit de eigen oven, elke ochtend vroeg.</p>
  </Reveal>
</section>
```

## Deepen: a tall photo and two details, offset

```tsx
<section className="grid gap-8 px-6 py-32 md:grid-cols-12 md:px-[8vw] md:py-48">
  <MediaFrame image={images.column[1]} ratio="4/5" sizes="(min-width: 768px) 40vw, 100vw" className="md:col-span-5" />
  <div className="flex flex-col gap-8 md:col-span-6 md:col-start-7 md:pt-[20vh]">
    <Reveal className="flex flex-col gap-5">
      <h2 className="font-display text-h2">Van de oven naar tafel.</h2>
      <p className="max-w-[44ch] text-body text-ink-muted">Wat er uit het vuur komt, gaat direct de zaal in.</p>
    </Reveal>
    <div className="grid grid-cols-2 gap-6">
      <MediaFrame image={images.detail[0]} ratio="1/1" sizes="25vw" />
      <MediaFrame image={images.detail[1]} ratio="1/1" sizes="25vw" className="mt-[12vh]" />
    </div>
  </div>
</section>
```

## Invite: the too-empty section

One line, one button, a lot of air. This is the section that should feel empty by SaaS standards.

```tsx
<section id="reserveren" className="flex flex-col items-start gap-12 px-6 py-[24vh] md:px-[8vw]">
  <SplitHeadline as="h2" on="scroll" className="font-display text-display max-w-[12ch]">Een tafel voor vanavond?</SplitHeadline>
  <MagneticButton href="mailto:...">Reserveer een tafel</MagneticButton>
</section>
```

Use only the contact route the brief gave. No booking system named in the brief: a mail link or "bel ons", never a fake form that sends nothing.

## Footer: designed as hard as the hero

```tsx
<footer className="overflow-hidden bg-surface-1 px-6 pt-24 pb-10 md:px-[8vw]">
  <div className="grid gap-10 md:grid-cols-12">
    <p className="text-lead md:col-span-5">Veertig plekken in Amsterdam-Noord.</p>
    <nav className="flex flex-col gap-2 text-small md:col-span-3 md:col-start-8">
      <a href="#kaart">Kaart</a>
      <a href="#reserveren">Reserveren</a>
    </nav>
  </div>
  <p aria-hidden className="font-display mt-24 text-[22vw] leading-[0.8] tracking-[-0.04em]">Zout</p>
  <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-small text-ink-muted">
    <span>Zout, Amsterdam-Noord</span>
    <a href={imageCredit.href}>{imageCredit.label}</a>
  </div>
</footer>
```

The giant wordmark is the one place a vw size is right: it is a shape, not a reading size.

## Showpieces

```tsx
<HorizontalGallery
  title="Uit de keuken"
  intro="Wat de oven en de markt deze week brengen."
  items={images.card.slice(0, 6).map((image) => ({ image, title: image.alt }))}
/>

<PinnedZoom image={images.band[1]} statement="Eén zaal, veertig plekken." closing="Reserveer voor vanavond." />
```

Write `title` and `text` from the brief; the pack alt is a description of the photo, fine as a caption only when it says nothing false about the client.

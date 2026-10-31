# Niche packets: client type to design language

[vibe-presets.md](vibe-presets.md) is the aesthetic genome (how a look is built); this file is the client-type layer (which look, for whom, and why). Each packet pre-answers the decisions a niche actually constrains: the positioning tension, type, tokens, spacing, motion, imagery, arc, and, most valuable, the tells that make *this specific niche* look cheap. Palettes use the token contract from [vibe-presets.md](vibe-presets.md); write them into the STRUQ TOKENS block of globals.css. Every packet already passes the baseline non-negotiables. Where a niche's real-world convention conflicts with a rule (dev-tool mono-everything, crypto neon, luxury gold-on-black), the rule won and the packet says so.

The 24-niche list is kept as given: all earn their spread. Two scoping notes: **university/edu** means program/admissions landing pages, not the institutional CMS estate; **local trades** is deliberately the taste floor: the one packet where conversion outranks art direction, included because a skill that can't do humble work isn't a system.

Fonts: all named faces are on Google Fonts except those marked **(Fontshare)**, which are free and self-hosted via `@font-face` ([stack-targets.md](stack-targets.md) covers font wiring).

> **Struq overrides on every packet.** These packets come from the deck-design skill, the canonical craft reference, and Struq's eight overrides apply on top of them (SKILL.md, "The canonical references"):
> - **Palette:** pick from Struq's canon first (`canon.mjs list`, by the packet's mood); the packet palette is the fallback when no canon palette fits.
> - **Type:** a canon pairing when one fits the packet's temperament; otherwise the packet's faces through `canon.mjs type --display ... --body ...`. Inter, Space Grotesk and mono as a design face are already replaced below.
> - **Motion:** where a packet says "no pin" or "native scroll", the Struq floor still holds on a marketing site: Lenis on one clock and one showpiece. Keep the packet's restraint in how quiet that showpiece is.
> - **Images:** every packet names its beeldbank pack; a frame is never empty.
> - **No eyebrows, gradients, tinted fills, pills or uppercase labels,** whatever a niche's convention.

## Selection

- **Pick by business model + what the visitor is afraid of, not surface topic.** A legal-tech SaaS uses the B2B SaaS packet, not Legal (the buyer is a software champion, not a client with a lawsuit). A hotel's restaurant page uses Restaurant. An institutional crypto custodian takes Fintech's tension with Crypto's imagery bans.
- **The packet feeds the Build checklist in order:** POSITIONING TENSION and PAGE ARC feed the plan (step 2); TYPE, PALETTE and RADIUS the canon picks (steps 2 and 4); MOTION CHARACTER steps 6 to 8; ANTI-PATTERNS join the look and the check (11 and 12).
- **Blending (max two):** the primary packet is whoever signs the check: take its TENSION, ARC, and MOTION whole. Borrow at most **one** of TYPE or PALETTE from the secondary, never both, and never average two palettes, swap whole token blocks or don't. Anti-pattern lists union: both apply.
- **Derive fresh instead when:** (a) a real brand exists: then [triage.md](triage.md) rules apply and identity beats any packet; (b) the niche is not here: derive via the seven axes in [vibe-presets.md](vibe-presets.md), but write the POSITIONING TENSION *first*; the tension is the seed, the axes are the growth; (c) the client's strategy deliberately contradicts the niche default (a loud law firm can be a strategy), then deviate on purpose and keep the packet's anti-patterns anyway.

Index: [1 B2B SaaS](#1-b2b-saas) · [2 Dev tools](#2-dev-tools) · [3 Fintech](#3-fintech) · [4 Legal](#4-legal) · [5 Medical](#5-medical--clinic) · [6 DTC skincare](#6-dtc-skincare) · [7 DTC food/bev](#7-dtc-foodbev) · [8 Luxury fashion](#8-luxury-fashion) · [9 Architecture](#9-architecture-studio) · [10 Design agency](#10-design-agency) · [11 Indie game](#11-indie-game) · [12 Music artist](#12-music-artist) · [13 Restaurant](#13-restaurant) · [14 Hotel](#14-hotel--hospitality) · [15 Real estate](#15-real-estate) · [16 Fitness](#16-fitness--gym) · [17 Nonprofit](#17-nonprofit) · [18 University](#18-university--edu) · [19 Crypto](#19-crypto--web3) · [20 AI startup](#20-ai-startup) · [21 Portfolio](#21-personal-portfolio) · [22 Photography](#22-photography) · [23 Consulting](#23-consulting) · [24 Local trades](#24-local-trades)

---

## 1. B2B SaaS

- **POSITIONING TENSION**: Convince a mid-level champion "this removes real work and is safe to bring to my boss." Never signal "interchangeable seed-stage template that will pivot next quarter."
- **TYPE PAIRING**: General Sans (Fontshare) display, hero **400**; Urbanist body at 1.0625rem (Inter is off the Struq list).
- **PALETTE**: Light (buyers evaluate at work in bright offices; product shots need a calm frame). `surface #FBFAF8 / #F4F2EE / #ECE9E3 / #E0DCD3 · ink #17181A · muted #5A5D63 · faint #9A9DA3 · accent #0E6B5C (deep viridian, deliberately not SaaS blue) · line rgb(23 24 26 / 0.10)`.
- **RADIUS + LINE**: 8px on interactive, 2px on media mats; hairlines carry all card separation.
- **SPACING TEMPERAMENT**: Mid-generous: hero 12rem, workflow rows dense at 6rem; the breather is the one manifesto line before pricing.
- **MOTION CHARACTER**: Lenis lerp **0.12** (reading-heavy); 0.5 to 0.9s; `power3.out` / `power2.inOut`; **one** showpiece max, a scrubbed product walkthrough at the Deepen beat. No theatrics near pricing.
- **IMAGERY DIRECTION**: The product IS the imagery: real screenshots on `surface-2` mats, graded to the page, no OS chrome; one warm-film human photo max. Ratios 16/10, 4/3, one 21/9. Never: tilted browser mockups in a glow, handshake stock, abstract 3D blobs.
- **BEELDBANK PACK**: `halide` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (claim + real product frame) → Orient (who-it's-for line) → Prove (3 workflow rows, editorial; logos as one quiet strip) → Deepen (scrubbed walkthrough) → pricing (dense, honest) → Invite + footer.
- **ANTI-PATTERNS**: 1) The hero screenshot floating in a purple glow at a perspective tilt. 2) Three-tier pricing cards with a "Most Popular" badge as the page's visual centerpiece, pricing is a table you consult, not the show. 3) Stat wall + logo wall + testimonial carousel stacked in sequence, pick one proof form and art-direct it.

## 2. Dev tools

- **POSITIONING TENSION**: Convince "built by people who live in the same terminal you do." Never smell like a marketing department, sales gloss is the trust-killer.
- **TYPE PAIRING**: Sora display, hero **300**; Instrument Sans body (Space Grotesk and Inter are off the Struq list); JetBrains Mono **strictly for code samples**. The niche convention of mono-everywhere is rejected (baseline rule wins): precision comes from tracked-caps eyebrows and `tabular-nums`, not a typewriter voice.
- **PALETTE**: Dark (matches the editor/terminal context the audience lives in). `surface #0B0C0E / #121316 / #1A1C20 / #24262C · ink #E8EAED · muted #9BA1A8 · faint #5D636B · accent #E2A33C (warm amber, not matrix green) · line rgb(255 255 255 / 0.08)`.
- **RADIUS + LINE**: 4px; code blocks are the only mats; everything else hairline-separated.
- **SPACING TEMPERAMENT**: Dense, developers want information rate. Hero 10rem, everything else 5 to 6rem; the breather is one line of tool philosophy.
- **MOTION CHARACTER**: **Native scroll** (smoothing a tool insults the user, [feel-layer.md](feel-layer.md)); 0.2 to 0.5s, quart-out; no pinned showpiece, the showpiece is a real, runnable demo embedded inline.
- **IMAGERY DIRECTION**: No photography. Real terminal/editor output typeset (not screenshotted) where possible; diagrams as ink-line SVG. Ratios 16/10, 1/1. Never: "developer at MacBook" stock, glowing cubes, code that doesn't parse.
- **BEELDBANK PACK**: `halide` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (one-line what-it-does + an install command that actually copies) → Orient (30-second why-different) → Prove (live demo) → Deepen (architecture/philosophy, docs links) → Invite (install/star CTA; footer with changelog).
- **ANTI-PATTERNS**: 1) A terminal-typewriter hero animation typing a fake prompt on loop. 2) `font-mono` as the site's voice, nav, labels, body, mono is for the code, the sans is for the site. 3) A hero code snippet that is fake, wrong, or doesn't copy on click, this audience *runs* your hero.

## 3. Fintech

- **POSITIONING TENSION**: Convince "this institution will not lose your money," while feeling faster than a bank. Never signal casino adrenaline or startup fragility.
- **TYPE PAIRING**: Newsreader display (financial-journal serif = editorial trust), hero **400**; Public Sans body (the civic workhorse); `tabular-nums` wherever a number appears.
- **PALETTE**: Light paper (money reads on paper; dark UIs read as trading terminals, the wrong adrenaline). `surface #F8F7F4 / #F1EFEA / #E8E5DE / #DBD7CC · ink #121A16 · muted #4E5A52 · faint #8B958D · accent #0B5C3E (deep green) · line rgb(18 26 22 / 0.12)`.
- **RADIUS + LINE**: 2px, banking has edges; table rules are a feature, not chrome.
- **SPACING TEMPERAMENT**: Measured: hero 12rem, proof dense at 6rem; the breather is the security/compliance statement alone in 18rem of air, calm *is* the trust signal.
- **MOTION CHARACTER**: Lerp **0.11**; 0.6 to 0.9s; editorial-calm pair; scrub reserved for one number moment (a fee comparison drawing itself). No pins, no horizontal scroll, nothing that takes control on a money page.
- **IMAGERY DIRECTION**: Real customers and places, warm-neutral grade desaturated ~15%; product UI on flat mats. Ratios 4/3, 21/9. Never: floating 3D cards, vault/shield/lock props, skyline stock, glowing charts.
- **BEELDBANK PACK**: `ledger` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (the promise + real product) → Orient (how it works, 3 rows) → Prove (ONE proof: real numbers with methodology) → Deepen (security/compliance breather) → rates/pricing (honest table) → Invite.
- **ANTI-PATTERNS**: 1) The floating 3D bank-card render. 2) Padlock/shield/vault icons standing in for security claims, name the custodian, the license, the insurance in text instead. 3) A growth curve with no axes or source, fake precision reads as fraud in exactly this niche.

## 4. Legal

- **POSITIONING TENSION**: Convince "serious judgment; your matter is safe here." Never signal that the firm advertises harder than it practices, visible effort to sell reads as desperation at this price point.
- **TYPE PAIRING**: Spectral display, hero **300** (sharp scholarly serif, big and quiet, never bold caps); Source Sans 3 body.
- **PALETTE**: Light archival cream (paper and contracts; dark law sites read as either nightclub or horror). `surface #FBF8F2 / #F4F0E6 / #EAE4D6 / #DCD4C0 · ink #1C1A15 · muted #57534A · faint #96907F · accent #7A2E1D (oxblood) · line rgb(28 26 21 / 0.14)`.
- **RADIUS + LINE**: 0px; `divide-y` hairline lists are the signature texture.
- **SPACING TEMPERAMENT**: The most generous of the professional niches, silence is authority. Hero 14rem; practice rows 6rem; the breather is one line of firm philosophy in 20rem.
- **MOTION CHARACTER**: **Native scroll**; reveals only, 0.4 to 0.7s `power3.out`; **zero showpieces, zero parallax**. A firm that scroll-jacks looks like it bills for theatrics.
- **IMAGERY DIRECTION**: Near-mono or high-contrast BW portraiture of the actual attorneys, direct gaze, real offices, one session. Ratios 3/4 portraits, one 21/9 architecture statement. Never: gavels, scales, columns, handshakes, skylines, courtrooms.
- **BEELDBANK PACK**: `ledger` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (name + one-line position) → Orient (who we act for) → Prove (matters/results, typeset, no cards) → Deepen (the partners, the people are the product) → Invite (one contact ask; direct emails, not a form wall).
- **ANTI-PATTERNS**: 1) Gavel/scales/skyline imagery anywhere, the shorthand of ambulance-chaser billboards. 2) A practice-area icon-card grid (12 cards, 12 line icons), practice areas are a typeset list. 3) Trajan-style engraved caps with gold accents, the "prestige kit" that reads as a late-night TV ad, not counsel.

## 5. Medical / clinic

- **POSITIONING TENSION**: Convince "competent humans will take care of you, and you can get an appointment." Never signal corporate healthcare machine, and never drift into spa fluff.
- **TYPE PAIRING**: Source Serif 4 display, hero **400** (humane, not luxury); Instrument Sans body at **1.0625 to 1.125rem**, patients skew older; the raised floor is the brand.
- **PALETTE**: Light warmed-white (hygiene without hospital chill; dark mode reads as emergency). `surface #FCFBF9 / #F5F3EF / #ECE9E3 / #DFDACF · ink #21201D · muted #5A5952 · faint #97948B · accent #2E6E64 (calm blue-green) · line rgb(33 32 29 / 0.10)`.
- **RADIUS + LINE**: 10px on interactive (soft = bedside), 2px on media.
- **SPACING TEMPERAMENT**: Calm hero at 10rem, but *dense where it matters*: hours, insurance, booking. The breather is the care-philosophy line.
- **MOTION CHARACTER**: Native or lerp **0.14** max; 0.5 to 0.8s `power3.out`; no showpiece, spend the motion budget on booking-flow micro-feedback. Reduced-motion is first-class here (vestibular patients are your audience).
- **IMAGERY DIRECTION**: Real clinicians and the real space, warm film grade, soft light. Ratios 4/3, 3/4 portraits. Never: beaming stock doctor with crossed arms, heart/plus/molecule icon chips, blue-glove macro shots.
- **BEELDBANK PACK**: `linen` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (what + where + book now) → Orient (care philosophy line) → Prove (services as typeset rows; insurance/logistics dense and *early*) → Deepen (the clinicians, real bios) → Invite (booking + hours + location; the footer is the practical hero).
- **ANTI-PATTERNS**: 1) The beaming stock-doctor hero. 2) Teal-and-white template with heart/plus icons in circles for services. 3) Burying hours/insurance/address below testimonials, a patient with a problem needs the phone number in viewport one; in this niche logistics outrank storytelling.

## 6. DTC skincare

- **POSITIONING TENSION**: Convince "there is real formulation behind this aesthetic." Never signal Canva-brand drop-shipping, the prettier the site, the more the chemistry must show.
- **TYPE PAIRING**: Fraunces display (soft optical sizing, skin-warm serif), hero **300**; Karla body.
- **PALETTE**: Light warm bone. `surface #F9F5EF / #F2EBE1 / #E9DFD1 / #DCCFBB · ink #2A241D · muted #6B6156 · faint #A2968A · accent #9C5533 (clay) · line rgb(42 36 29 / 0.12)`.
- **RADIUS + LINE**: 2px, apothecary, not bubble; hairline rules typeset like ingredient labels.
- **SPACING TEMPERAMENT**: Generous; product macros get full-bleed breathers; one ingredient statement per viewport is the "too empty" move.
- **MOTION CHARACTER**: Lerp **0.09**; 0.9 to 1.3s `expo.out`; one showpiece: a pinned texture-macro scrub (the product smearing across the viewport), the tactile moment is the conversion. Everything else calm.
- **IMAGERY DIRECTION**: The deciding layer. One lighting world (warm daylight studio); skin shown real, with texture, unretouched pores *are* the credibility; product on stone/linen. Ratios 4/5 lead, 1/1 product, one 21/9. Never: pastel 3D blob renders, molecule diagrams, lab stock.
- **BEELDBANK PACK**: `vitrine` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (product + skin in one frame) → Orient (formulation philosophy line) → Prove (ingredients as a typeset ledger with percentages, the INCI honesty flex) → Deepen (texture showpiece + routine) → Invite (hero-SKU CTA; footer links the full ingredient list).
- **ANTI-PATTERNS**: 1) The "clean · vegan · cruelty-free" chip row as the proof layer, badge salad; name the two certifications you actually hold, with the certifier, in text. 2) Airbrushed poreless skin, it kills the formulation claim on contact. 3) Before/after slider widgets, a typeset clinical claim with the study *n* beats the interactive gimmick.

## 7. DTC food/bev

- **POSITIONING TENSION**: Convince "this tastes like something and has a personality you want on your counter." Never signal private-label commodity with a label slapped on.
- **TYPE PAIRING**: Bricolage Grotesque display, hero **600**, heavy is the genre here (declared poster/consumer exception); Work Sans body.
- **PALETTE**: Light + loud; this is a legitimate declared-second-accent genre. `surface #FAF6ED / #F3ECDC / #EADFC8 / #DCCFAF · ink #1E1B14 · muted #5C5645 · faint #999076 · accent #D8401F (tomato) · accent-2 #1D3FBF (cobalt, declared, ≤1/viewport each) · line rgb(30 27 20 / 0.12)`.
- **RADIUS + LINE**: 14px on buttons (bouncy), **0 on photography**, food is never rounded-cropped.
- **SPACING TEMPERAMENT**: Compressed and punchy; short page; the breather is one full-bleed appetite shot per ~3 viewports.
- **MOTION CHARACTER**: Lerp **0.11** (native if it's primarily a store); 0.3 to 0.6s quart-out with exactly one `back.out(1.4)` element (add-to-cart); a flavour-name marquee is on-genre (the one allowed autonomous mover). Showpiece: a horizontal flavour gallery earns its place.
- **IMAGERY DIRECTION**: Appetite-first: real product and real food styled messy-honest, hard daylight, saturated warm grade (the one niche where saturation goes *up*). Ratios 1/1 product, 4/5, 21/9 table spread. Never: CGI liquid-splash renders, wood-and-burlap "artisan" staging, torn-kraft-paper textures.
- **BEELDBANK PACK**: `vitrine` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (product + flavour claim) → Prove (the lineup, horizontal gallery, deliberate inversion: evidence before story) → Orient (why-it-exists, one paragraph) → Deepen (ingredients/process in the brand voice) → Invite (shop + stockists; the footer keeps the voice).
- **ANTI-PATTERNS**: 1) The frozen-liquid-arc CGI splash render, shoot the real thing. 2) "Craft / small-batch / artisan" in a script font, personality comes from voice and colour, not a handwriting face. 3) Recipe-blog padding between product and buy button, this is a store; keep the arc short.

## 8. Luxury fashion

- **POSITIONING TENSION**: Convince "we don't need to persuade you", desire through withholding. Never signal effortful salesmanship; one discount-energy pattern destroys the price point.
- **TYPE PAIRING**: Bodoni Moda display (didone contrast is fashion's native script), hero **400**; Archivo body 300 to 400, tracked caps for nav.
- **PALETTE**: Light gallery, near-white lets the garments own all colour. The gold-on-black convention is rejected: it's the counterfeit signal. `surface #FCFBFA / #F5F4F2 / #ECEBE8 / #E0DEDA · ink #131211 · muted #595752 · faint #9B9892 · accent #5E1F26 (deep bordeaux, ~2 words per page; CTAs are ink) · line rgb(19 18 17 / 0.10)`.
- **RADIUS + LINE**: 0px, couture has edges; hairlines only at header and footer.
- **SPACING TEMPERAMENT**: Maximal of all 24: one look per viewport; nearly every section is a breather; measures ≤36ch.
- **MOTION CHARACTER**: Lerp **0.06** syrup (the one register where it's on-brand); 1.2 to 1.6s `expo.out` + quint-in-out; the showpiece is the hero campaign itself with a departure scrub; slow crossfade lookbook. Nothing bounces, ever.
- **IMAGERY DIRECTION**: Campaign photography *is* the site: one photographer, one grade (soft neutral or high-contrast BW), full-bleed; type sits on imagery via lockups. Ratios 2/3, 21/9. Never: e-com grid density on the brand page, gold foil, autoplaying runway video with sound.
- **BEELDBANK PACK**: `bolt` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (campaign image + wordmark, nothing else) → Prove (the collection, one look per viewport) → Orient (one manifesto line) → Deepen (atelier/craft macro detail) → Invite (collection/store locator; footer = oversized cropped wordmark).
- **ANTI-PATTERNS**: 1) The gold-serif-on-black "prestige kit", it reads counterfeit-luxe, not maison. 2) Any sale/urgency UI on the brand page, strikethrough prices, badges, countdowns. 3) Cramming looks into a four-column product grid, the brand page is a gallery; the shop lives elsewhere.

## 9. Architecture studio

- **POSITIONING TENSION**: Convince "we think in decades and in millimetres." Never signal render-farm gloss, an all-render portfolio reads as unbuilt.
- **TYPE PAIRING**: Switzer (Fontshare), one family: display **300** at huge sizes, body 400. The type behaves like the buildings: system, restraint, scale.
- **PALETTE**: Light concrete-warm gallery (buildings photograph against sky; dark swallows elevations). `surface #F7F6F3 / #EFEEE9 / #E5E3DC / #D6D3C9 · ink #1A1A18 · muted #565550 · faint #96958D · accent #C33B26 (drafting red, index numerals and links) · line rgb(26 26 24 / 0.12)`.
- **RADIUS + LINE**: 0px; the 1px rule *is* the identity, hairlines as drafting lines.
- **SPACING TEMPERAMENT**: Generous and visibly gridded; the breather is one site photograph with a single caption line.
- **MOTION CHARACTER**: Lerp **0.09**; 0.8 to 1.2s `expo.out`; window-parallax on photography by default; showpiece: a horizontal project index (genuinely sequential content), the one pin.
- **IMAGERY DIRECTION**: Built work photographed straight, verticals corrected, soft-neutral grade; drawings and plans as first-class images (ink line on paper). Ratios 4/3, 21/9, 3/4 details. Never: uncorrected phone verticals; leading with CGI, renders appear only labelled, greyed, secondary.
- **BEELDBANK PACK**: `datum` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (one built project, full-bleed) → Orient (practice statement line) → Prove (selected works, 60% of the page, horizontal index) → Deepen (process with drawings) → Invite (studio contact; footer with local time).
- **ANTI-PATTERNS**: 1) Renders where built work should be, or renders and photographs mixed with no visible line between them. 2) The uniform 40-project thumbnail wall, curate 6 to 10, one per movement. 3) "We create spaces that inspire", architects are judged in nouns; give place, program, material, year as a data line under every project.

## 10. Design agency

- **POSITIONING TENSION**: This page *is* the pitch: convince "hire this taste" with the artifact itself. Never signal that the agency designs for award juries instead of clients, gimmick density reads as self-indulgence.
- **TYPE PAIRING**: Instrument Serif display, hero **400**, italic as the accent register; Outfit body.
- **PALETTE**: Warm paper with ink; panels lift to white, one inverted ink panel as `surface-3` (the brutalist move, domesticated). `surface #F6F3EC / #FFFFFF / #ECE7DB / #141310 (inverted) · ink #141310 · muted #55524A · faint #949083 · accent #E8481C (international orange) · line #141310 at 1px solid`.
- **RADIUS + LINE**: 0 to 2px; solid ink rules, not alpha hairlines, structure worn openly.
- **SPACING TEMPERAMENT**: High-contrast rhythm: vast breathers *against* dense case rows, the alternation is the show.
- **MOTION CHARACTER**: Lerp **0.10**; 0.6 to 1.1s `expo.out`; the full toolkit but each move once: one pin, sibling-dimming work index, one magnetic CTA, page wipes. The only niche where **two** showpieces are defensible.
- **IMAGERY DIRECTION**: The work as artifacts: device-free crops, printed matter photographed, motion captured as video stills; one grade. Ratios 4/3, 16/10, 1/1 varied per project rhythm. Never: identical laptop-mockup rows, an awards-badge strip, team-at-whiteboard stock.
- **BEELDBANK PACK**: `quire` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (name + a claim someone could disagree with) → Orient (positioning line, minimal) → Prove (selected work, immediately, earn the rest) → Deepen (process or principles; the pinned sequence lives here) → Invite (start-a-project; footer designed as hard as the hero).
- **ANTI-PATTERNS**: 1) "We craft digital experiences" and its siblings, the hero must stake a position, not describe the industry. 2) Award badges above the fold, the work is the credential; badges are for the footer meta row. 3) Case studies that all resolve to the same laptop-on-gradient mockup, vary the artifact; show the actual thing shipped.

## 11. Indie game

- **POSITIONING TENSION**: Convince "this world is deep and finished enough to wishlist." Never signal asset-flip, generic site UI reads as generic game.
- **TYPE PAIRING**: Unbounded display, hero **600** (declared heavy, poster/game genre); Chivo body. **No pixel fonts in site UI**, the 12px floor and readability rules beat genre nostalgia; pixel type may live inside the game's own artwork.
- **PALETTE**: Dark, tuned to the game's key art (template shown; re-derive from the actual art). `surface #0C0A12 / #14111D / #1D1929 / #2A2440 · ink #EFEDF4 · muted #A79FBF · faint #6A6284 · accent #FF6B3D (the game's signature ember) · line rgb(255 255 255 / 0.09)`. Dark because key art glows and screenshots stay vivid.
- **RADIUS + LINE**: 6px; hairlines, plus one thick rule under the persistent wishlist bar.
- **SPACING TEMPERAMENT**: Punchy-dense; trailer within one scroll; the breather is a single full-bleed key-art moment.
- **MOTION CHARACTER**: Lerp **0.10**; 0.3 to 0.6s quart-out with one `back.out` accent; showpiece = the hero trailer with a departure scrub; the wishlist CTA is persistent.
- **IMAGERY DIRECTION**: Key art + **real** screenshots at native ratio, and short webm loops of actual gameplay. Ratios 16/9 gameplay (fixed, it's the medium), 21/9 key art, 1/1 details. Never: mocked screenshots, "bullshots" that outclass the build, a star-rating press wall.
- **BEELDBANK PACK**: `halide` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (key art + title + wishlist, the hook already proves) → Orient (premise in 2 lines) → Prove (gameplay, real, 15 seconds in) → Deepen (3 mechanic/world rows with loops) → Invite (wishlist again + newsletter/community; footer in the game's voice).
- **ANTI-PATTERNS**: 1) The trailer buried below lore text, if gameplay isn't visible within one scroll, the page failed. 2) Concept art or target renders passed off as gameplay, the community will screenshot the difference. 3) The widget dump (Steam embed + Discord embed + presskit links as the layout), embed one, typeset the rest in the site's own art direction.

## 12. Music artist

- **POSITIONING TENSION**: Convince "this is an artist with a world, not a Linktree with a header." Never signal label-template interchangeability, the site must belong to *this* record.
- **TYPE PAIRING**: Anton display (single cut, inherently heavy; declared poster-genre choice), set in sentence case (Struq: no uppercase); Urbanist body.
- **PALETTE**: Dark cinematic, accent pulled from the current cover art (example shown). `surface #0A0A0B / #121214 / #1A1A1E / #26262C · ink #F1F0EE · muted #A09E9A · faint #605E5A · accent #D6FF3F (acid, large display/CTA only; body links are ink, underlined) · line rgb(255 255 255 / 0.08)`. Dark: stage light needs a dark room.
- **RADIUS + LINE**: 0px.
- **SPACING TEMPERAMENT**: Poster-compressed hero, dense tour/release data; the breather is one full-bleed portrait.
- **MOTION CHARACTER**: Lerp **0.08**; 1.0 to 1.4s cinematic; showpiece = the hero (cover/video with departure scrub); an album-title marquee is on-genre. The tour table gets **zero** animation, fans want the date, instantly.
- **IMAGERY DIRECTION**: One photographer, one grade per *era*, the era is the grade. Ratios 4/5 portraits, 21/9 stage, 1/1 cover art untouched. Never: mixed-era press photos, a Spotify embed as the hero, particle-visualizer backgrounds.
- **BEELDBANK PACK**: `assembly` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (era image + name) → Prove (latest release + listen CTA, inversion: the music is the argument) → Orient (one line, if any) → Deepen (tour table, dense; video) → Invite (mailing list, the artist-owned channel; platforms quiet in the footer).
- **ANTI-PATTERNS**: 1) The embed collage (Spotify iframe + YouTube iframe + IG grid), embeds import foreign chrome and kill the era's art direction; typeset, then link out. 2) Tour dates in a default-styled table or a third-party widget, the tour table deserves the display type. 3) Generic neon-on-black "music template" with no era logic, the palette must be derived from this record's artwork or it's nobody's site.

## 13. Restaurant

- **POSITIONING TENSION**: Convince "book tonight, the room and the plate are worth it." Never signal delivery-app listing energy.
- **TYPE PAIRING**: Prata display, hero **400**; Figtree body; the menu set in the body face with `tabular-nums` prices, the menu is typography's job here.
- **PALETTE**: Candle-warm light (a paper menu, not a nightclub; a dark variant only for genuinely late-night concepts). `surface #FAF5EC / #F3EBDD / #E9DEC9 / #D9CBAE · ink #221D14 · muted #635C4C · faint #9E9480 · accent #6E2B1E (burgundy) · line rgb(34 29 20 / 0.14)`.
- **RADIUS + LINE**: 0 to 2px; hairline rules like a set table.
- **SPACING TEMPERAMENT**: Generous around imagery, dense inside the menu; the breather is one dish, full-bleed.
- **MOTION CHARACTER**: Lerp **0.10**; 0.7 to 1.0s editorial-calm; masked image reveals; one showpiece anyway (the Struq floor): a HorizontalGallery of the dishes at the act break, the menu sections reachable by anchor; the reserve CTA persistent in the header.
- **IMAGERY DIRECTION**: Real dishes and the real room, one warm film grade, one light world (daylight *or* candle, pick one), shot in one session. Ratios 3/2, 4/5, one 21/9 of the room. Never: HDR-saturated food, overhead flat-lays from someone else's kitchen, Ken Burns slideshows.
- **BEELDBANK PACK**: `proof` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (the room or the signature dish + book CTA) → Orient (chef/concept line) → Prove (the menu, typeset, live on the page) → Deepen (room + people) → Invite (reserve + hours/address; the footer is the logistics hero).
- **ANTI-PATTERNS**: 1) The menu as a PDF link, or worse, a photograph of the printed menu; typeset it in HTML where it can breathe and be updated. 2) A full-screen autoplay slideshow hero with Ken Burns zoom. 3) The reservation action buried under story, "Book" lives in the header from viewport one.

## 14. Hotel / hospitality

- **POSITIONING TENSION**: Convince "you can already feel yourself there", the site must beat the OTAs at atmosphere, since it can't beat them at inventory. Never signal booking.com listing energy.
- **TYPE PAIRING**: Marcellus display (inscriptional roman calm), hero **400**; Jost body.
- **PALETTE**: Warm mineral light. `surface #F8F5F0 / #F0EBE2 / #E5DDCF / #D5C9B4 · ink #26221B · muted #61594B · faint #9C9280 · accent #2F5B52 (deep sea) · line rgb(38 34 27 / 0.12)`.
- **RADIUS + LINE**: 2px; hairlines at content boundaries only.
- **SPACING TEMPERAMENT**: Luxurious: heroes 14 to 20rem; the breather is a single sensory line ("morning light on the terrace") in vast air.
- **MOTION CHARACTER**: Lerp **0.07 to 0.08**; 1.0 to 1.5s expo/quint; window-parallax on every image; showpiece: the rooms as one sticky-stack deck. The booking bar stays quiet until intent (appears on scroll-up).
- **IMAGERY DIRECTION**: Place-first: light, texture, food, staff hands; warm film grade, golden-hour bias, one honest wide-normal lens with corrected verticals. Ratios 21/9 vistas, 4/3, 3/4 details. Never: fisheye room panoramas, towel-swan bed stock, empty-buffet shots.
- **BEELDBANK PACK**: `portico` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (the place, full-bleed + dates CTA) → Orient (one sensory line) → Prove (rooms stack) → Deepen (food/spa/place rhythm) → Invite (book + practicalities; footer with a designed map/contact block).
- **ANTI-PATTERNS**: 1) The booking-widget bar bolted across the hero, a dates form before desire is OTA energy. 2) Fisheye/HDR room photography, distortion reads as deception in this niche. 3) The amenity icon grid (wifi/parking/pool in circles), amenities are a typeset list; icon chips make a hotel read as a motel.

## 15. Real estate

- **POSITIONING TENSION**: Convince "we sell homes like this beautifully, yours is next" (the site sells the *outcome of listing with them*). Never signal MLS-portal aggregator.
- **TYPE PAIRING**: Libre Caslon Display, hero **400**; Albert Sans body.
- **PALETTE**: Light editorial (property photography is daylight; dark frames fight it). `surface #FAF8F5 / #F2EFEA / #E9E4DB / #DAD2C4 · ink #1D1B18 · muted #5B564E · faint #999183 · accent #8C3A2B (brick) · line rgb(29 27 24 / 0.12)`.
- **RADIUS + LINE**: 2px; hairline-divided data rows for listings.
- **SPACING TEMPERAMENT**: Generous around property imagery, dense in listing data; the breather is one neighbourhood image with a line.
- **MOTION CHARACTER**: Lerp **0.11**; 0.6 to 0.9s calm; showpiece: one featured-property horizontal gallery; listing grids native and instant, browsing speed is respect.
- **IMAGERY DIRECTION**: Golden-hour exteriors, corrected-vertical interiors, one soft-neutral grade across all listings (the mixed-grade portfolio is the amateur tell). Ratios 3/2, 21/9 hero, 4/5 details. Never: skyline stock, drone-only glamour with no interiors, agent-headshot-with-crossed-arms as hero.
- **BEELDBANK PACK**: `datum` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (one extraordinary listing, full-bleed) → Orient (who we are, one line) → Prove (recent sales with real numbers) → Deepen (process + market point of view) → Invite (valuation CTA, the actual conversion; footer with areas served).
- **ANTI-PATTERNS**: 1) A portal-style search-filter grid as the landing experience, search belongs to portals; a brokerage sells judgment. 2) The agent glamour headshot as the hero, lead with property; people arrive at Deepen. 3) A "SOLD" badge collage or raw sales-count wall, three real case rows (asked / sold / days on market) beat fifty badges.

## 16. Fitness / gym

- **POSITIONING TENSION**: Convince "you'll belong here *and* it works", energy with competence. Never signal intimidation cosplay, and never franchise plastic.
- **TYPE PAIRING**: Familjen Grotesk, one family: display **700** (declared heavy, effort is the brand), body 400.
- **PALETTE**: Dark iron, but the red/black aggression kit is rejected; high-vis against iron instead. `surface #101012 / #17171A / #1F1F24 / #2B2B32 · ink #F2F1EF · muted #A3A19C · faint #63615C · accent #D7F23A (chartreuse, large display/CTA only; body links are ink, underlined) · line rgb(255 255 255 / 0.08)`.
- **RADIUS + LINE**: 0px; thick 2px rules on the schedule table are on-genre.
- **SPACING TEMPERAMENT**: Compressed and loud, type walls allowed, with **one** quiet section (coaching philosophy); the restraint is what makes the loudness read designed.
- **MOTION CHARACTER**: Native or lerp **0.12**; kinetic-abrupt 0.2 to 0.45s quart-out; instant hover inversions; a marquee is on-genre; **no showpiece**, schedule and pricing must be two taps away.
- **IMAGERY DIRECTION**: Real members mid-effort, not posing; hard flash or honest gym light; high-contrast BW or desaturated grade. Ratios 1/1, 4/5, one 21/9. Never: stock six-pack close-ups, transformation before/afters, skull/grunge textures.
- **BEELDBANK PACK**: `cadence` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (claim + real training image) → Orient (the belonging line) → Prove (the program in 3 rows) → Deepen (coaches, real bios) → Invite (trial CTA + dense schedule + honest pricing).
- **ANTI-PATTERNS**: 1) Red/black + distressed grunge + "NO EXCUSES", intimidation theater filters out the paying majority. 2) Transformation before/after grids, they read scam and shame the exact person deciding to join. 3) Pricing hidden behind "contact us", a visible trial price above the fold is this niche's single best conversion move.

## 17. Nonprofit

- **POSITIONING TENSION**: Convince "your money becomes outcomes here", competence with warmth. Never signal the guilt machine, and never a gloss so corporate it whispers "overhead."
- **TYPE PAIRING**: Lora display, hero **500**; Mulish body.
- **PALETTE**: Warm daylight (hope, not corporate navy). `surface #FBF8F3 / #F4EFE5 / #EAE2D3 / #DBCFB9 · ink #201D17 · muted #5D574B · faint #9A917F · accent #B25A12 (deep amber) · line rgb(32 29 23 / 0.12)`.
- **RADIUS + LINE**: 4px; hairlines; no cards for stories, editorial rows.
- **SPACING TEMPERAMENT**: Mid-generous; one beneficiary story gets a whole viewport (the breather); data sections denser.
- **MOTION CHARACTER**: Lerp **0.12**; 0.6 to 0.9s `power3.out`; no scroll-jacking (respect for the reader); one scrubbed impact-number moment allowed **only if** the numbers are audited and sourced.
- **IMAGERY DIRECTION**: Dignity-first documentary: subjects as agents, eye-level, named with consent; warm film grade. Ratios 3/2, 4/5 portraits, one 21/9. Never: telephoto sad-child poverty porn, staged handout moments, watermarked NGO stock.
- **BEELDBANK PACK**: `loam` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (one person + one outcome line) → Orient (mission in one sentence) → Prove (impact numbers with methodology + one story told deep) → Deepen (the model, how money becomes outcomes) → Invite (donate with a concrete unit, "€30 = one school kit"; footer links the financials).
- **ANTI-PATTERNS**: 1) Poverty-porn imagery, guilt converts once; dignity retains donors. 2) The Mission/Vision/Values three-icon-card row, say the one sentence instead. 3) Donation thermometers and red urgency banners, scarcity theater reads as manipulation; concrete unit economics do the persuading.

## 18. University / edu

- **POSITIONING TENSION**: Convince an 18-year-old "your next four years happen here" while their parents read "credible institution", same page, two audiences. Never signal brochure-committee sameness.
- **TYPE PAIRING**: Crimson Pro display, hero **300** at poster scale (the academic book face made huge is the move); Libre Franklin body.
- **PALETTE**: Light paper with one civic accent stolen from the crest and modernized. `surface #FAF9F6 / #F2F1EC / #E8E6DF / #D9D6CB · ink #191A1C · muted #55575C · faint #94969C · accent #14563E (deep green, example; re-derive from the actual crest) · line rgb(25 26 28 / 0.11)`.
- **RADIUS + LINE**: 0 to 2px; editorial hairlines.
- **SPACING TEMPERAMENT**: Editorial; program facts dense; the breather is one campus/place image with a single line.
- **MOTION CHARACTER**: **Native scroll**, this audience arrives mid-task from search; the estate must feel instant. 0.4 to 0.7s reveals only; no showpieces; spend the interaction budget on the program-finder.
- **IMAGERY DIRECTION**: Real students mid-work, labs, studios, field sites, documentary grade, one pass. Ratios 3/2, one 21/9 campus, 4/5. Never: the drone quad shot, diverse-group-laughing-at-a-laptop stock, graduation-cap-toss hero.
- **BEELDBANK PACK**: `quire` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (program claim + one real student image) → Orient (what you'll actually do in year one) → Prove (outcomes: employment, projects, named alumni, honest numbers) → Deepen (faculty + facilities) → Invite (apply/visit with real dates; footer as a practical index).
- **ANTI-PATTERNS**: 1) Drone-shot-of-the-quad + "Top 2% worldwide" stat overlay, every university's identical opener. 2) Stock diversity tableaux, real students, named programs, real work or nothing. 3) Deadlines, requirements, and cost buried under brand storytelling, the applicant's three questions belong above the fold; answering them *is* the brand.

## 19. Crypto / web3

- **POSITIONING TENSION**: Convince "real engineering, real custody, adults run this." Never signal casino. The niche's own convention (neon, 3D coins, glass) is bad design and is rejected wholesale: in a category defined by hype, institutional restraint is the differentiation.
- **TYPE PAIRING**: Schibsted Grotesk display, hero **400**; Manrope body; `tabular-nums` everywhere.
- **PALETTE**: Dark graphite, native to the audience's tooling, but sober: no purple, no glow. `surface #0D0E10 / #141518 / #1C1D21 / #26282E · ink #EDEEF0 · muted #9DA1A8 · faint #5F6369 · accent #3ECF8E (restrained mint) · line rgb(255 255 255 / 0.08)`.
- **RADIUS + LINE**: 4px; hairlines; data tables ruled like documentation.
- **SPACING TEMPERAMENT**: Measured-dense, docs-adjacent; the breather is the security/audit statement alone in air, the same trust beat as fintech, and it works for the same reason.
- **MOTION CHARACTER**: Lerp **0.10**; 0.6 to 1.0s editorial-calm; **one** WebGL moment permitted with a full poster fallback ([webgl-r3f.md](webgl-r3f.md)), and it must visualize the actual protocol, not decorative particles. Nothing else moves autonomously.
- **IMAGERY DIRECTION**: Almost none: ink-line typeset diagrams of the real architecture; the *named* team's real faces at Deepen, anonymity is a rug signal. Ratios 16/10 diagrams, 1/1 portraits. Never: 3D coins/rockets/planets, mesh-gradient blobs, stock "blockchain" cubes.
- **BEELDBANK PACK**: `halide` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (what it does, one falsifiable line + one live real number) → Orient (how, in 3 rows) → Prove (audits with firm names, TVL with source, incidents handled honestly) → Deepen (architecture + the named team) → Invite (docs/app CTA; footer with a security contact).
- **ANTI-PATTERNS**: 1) The casino kit: 3D coin/rocket/space renders, purple mesh glow. 2) A Q1 to Q4 roadmap timeline and tokenomics pie chart on the landing page, promises styled as product. 3) APY/yield figures with no source or methodology, in this niche an unexplained number *is* the scam tell.

## 20. AI startup

- **POSITIONING TENSION**: Convince "a working product exists behind this page", show real output. Never signal sci-fi vapor wrapped around someone else's API.
- **TYPE PAIRING**: Geist, one family: display **300**, body 400, precision through restraint.
- **PALETTE**: **Light** warm-gray, deliberately against the niche's dark-purple default: the product's outputs (text, images, answers) need a document surface, and dark-plus-glow is the vapor signal. `surface #FAFAF8 / #F2F2EF / #E9E9E4 / #DBDBD3 · ink #161719 · muted #55565A · faint #97989C · accent #2743D6 (single ultramarine) · line rgb(22 23 25 / 0.10)`.
- **RADIUS + LINE**: 6px; hairline mats around real outputs.
- **SPACING TEMPERAMENT**: Calm-generous; the breather is the capability claim stated in one falsifiable line.
- **MOTION CHARACTER**: Lerp **0.11**; 0.5 to 0.9s quart-out; showpiece: one scrubbed walkthrough of the *real* product on real inputs. No particle fields, no typing-simulation loops.
- **IMAGERY DIRECTION**: The product's actual output is the imagery, typeset, attributed, reproducible; usage screenshots on mats. Ratios 16/10, 4/3, 1/1. Never: neural-mesh brains, robot faces or hands, galaxy gradients, invented chat transcripts.
- **BEELDBANK PACK**: `halide` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (claim + real output visible) → Prove (live or recorded real demo, inversion: evidence immediately) → Orient (who it's for) → Deepen (how it works honestly, model, data, and *stated limits*; the limits are the trust move) → Invite (try/API CTA; honest pricing; footer with changelog).
- **ANTI-PATTERNS**: 1) The particle-brain / neural-network hero canvas. 2) A fake chat mockup with a typing loop and invented answers, one real, reproducible transcript beats any theater. 3) The model-name badge wall ("Powered by GPT-4o") as the value proposition, it announces you're a wrapper; show what only your product does with it.

## 21. Personal portfolio

- **POSITIONING TENSION**: Convince in ten seconds "this person makes decisions", the site is the first work sample. Never signal template-with-my-name-in-it; here, genericity itself is the failure.
- **TYPE PAIRING**: Sentient (Fontshare) display, hero **300** with italic moments; Satoshi (Fontshare) body.
- **PALETTE**: Dark, but *warm* dark, candlelight, not neon, distinct from both white-minimal and cyber-dark defaults. `surface #0E0D0B / #161411 / #1F1C17 / #2B2720 · ink #F0EDE6 · muted #A39E92 · faint #665F52 · accent #E07A3F (warm ember) · line rgb(240 237 230 / 0.09)`.
- **RADIUS + LINE**: 2px; hairlines.
- **SPACING TEMPERAMENT**: Confident-generous; dense work index; the breather is the "currently" line (status, location, availability).
- **MOTION CHARACTER**: Lerp **0.09**; 0.8 to 1.2s `expo.out`; the agency toolkit in miniature, one magnetic element, sibling-dimming index, page wipes. Showpiece (horizontal selected-work) **only if ≥5 strong pieces exist**; thin content under heavy theater is the worst outcome in this niche.
- **IMAGERY DIRECTION**: The work, in consistently art-directed crops, pick ONE index ratio (4/3 or 16/10) and hold it; one real portrait (not an avatar) at Deepen. Never: skill-bar graphics, tool-logo grids, workspace-with-latte stock.
- **BEELDBANK PACK**: `quire` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (name + what-you-do-for-whom claim) → Orient (currently/availability line) → Prove (selected work, 4 to 8 pieces, no more) → Deepen (about + portrait + how you work) → Invite (direct email, no contact form; footer with personality).
- **ANTI-PATTERNS**: 1) "Hi, I'm X, a passionate developer", state the position, not the passion. 2) Skill bars and tool-logo walls ("Figma 90%"), judgment is not a percentage; the work carries competence. 3) Twenty mediocre projects instead of five strong ones, curation is the taste demonstration, and heavy motion over a thin portfolio reads as compensation.

## 22. Photography

- **POSITIONING TENSION**: Convince "this eye is worth the day rate", and the site must disappear behind the pictures. The one niche where the design's job is invisibility.
- **TYPE PAIRING**: Supreme (Fontshare), one family, small and quiet: the name at display **300**, everything else body 400. Type never competes with an image.
- **PALETTE**: Near-black gallery so the photographs supply all colour. Deliberate reading of the temperature rule: zero hue cast (a warm or cool shift would tint the work), but still off-black/off-white, never pure `#000`/`#FFF`. `surface #101010 / #171717 / #202020 / #2C2C2C · ink #F2F2F2 · muted #A6A6A6 · faint #666666 · accent = ink (no chromatic accent; links underline) · line rgb(255 255 255 / 0.08)`.
- **RADIUS + LINE**: 0px; no frames, no borders on images, ever.
- **SPACING TEMPERAMENT**: Images take ~90% of every viewport; text nearly absent; by text standards the whole site is a breather.
- **MOTION CHARACTER**: Lerp **0.08**; **images move, type doesn't**: window-parallax and masked reveals at 1.0 to 1.3s `expo.out`; showpiece = the gallery itself (horizontal index on desktop, snap on touch); cursor grows to "View" over work and nothing more.
- **IMAGERY DIRECTION**: The portfolio at **native ratios**, the declared-ratio rule applies to index thumbnails only, never to the work itself (resolved in the work's favour). One series per section; one grade *within* each series; AVIF discipline at full quality.
- **BEELDBANK PACK**: `quire` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- Never: watermarks, mixed series in one grid, decorative backgrounds behind photographs.
- **PAGE ARC**: Hook (one image, full-bleed, no words) → Orient (name + one line) → Prove (series index) → Deepen (one series told deep, sequenced) → Invite (email + representation; footer minimal).
- **ANTI-PATTERNS**: 1) Watermarks and copyright stamps across images, clients read insecurity, not protection. 2) The masonry-grid-plus-lightbox default, sequence the series with authored pacing instead of a wall of thumbnails. 3) Site chrome competing with the work: chromatic accents, animated display type, textured backgrounds, if the UI is ever the most interesting thing on screen, the page has failed its one job.

## 23. Consulting

- **POSITIONING TENSION**: Convince "we've solved exactly your problem, recently, for someone like you." Never signal airport-business-book slickness, generic thought-leadership aesthetics say "body shop."
- **TYPE PAIRING**: Petrona display, hero **300**; Manrope body.
- **PALETTE**: Light slate-warm. `surface #F9F8F5 / #F1F0EB / #E7E5DE / #D8D5CA · ink #1B1C1A · muted #565750 · faint #95968C · accent #175A66 (deep petrol) · line rgb(27 28 26 / 0.11)`.
- **RADIUS + LINE**: 2px; hairline-ruled case rows.
- **SPACING TEMPERAMENT**: Editorial-measured; case rows dense; the breather is the firm's contrarian thesis alone in 18rem of air, a consultancy without a thesis is a body shop, and the layout should force one to exist.
- **MOTION CHARACTER**: Lerp **0.13** or native; 0.5 to 0.8s `power3.out`; **no showpieces**, the wow is the quality of the writing and the case numbers.
- **IMAGERY DIRECTION**: Almost none: typeset case data; partner portraits, direct and warm; client-context photos only if real. Ratios 3/4 portraits, 3/2. Never: boardroom-handshake stock, lightbulb/gear/chess iconography, skyline-at-dusk.
- **BEELDBANK PACK**: `ledger` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (the thesis as the headline) → Orient (who we serve) → Prove (2 to 3 case rows with real numbers, clients named where allowed) → Deepen (point-of-view writing index, the content flywheel) → Invite (a specific first step, "book a diagnostic," not "let's chat").
- **ANTI-PATTERNS**: 1) Word-salad positioning ("unlock value," "digital transformation," "synergies"), the headline must be a claim someone could dispute. 2) Framework clip-art (the 2×2 matrix graphic), if the IP is real, typeset it as a designed ink-line diagram with real labels. 3) A stack of anonymized case cards ("a leading global retailer"), one named, numbered story outsells six anonymous ones.

## 24. Local trades

- **POSITIONING TENSION**: Convince "they'll show up, do it right, and charge fairly", trust plus reachability. Never signal national-franchise anonymity or scammy urgency. The niche convention (badge clutter, pulsing CALL NOW) is bad design; the better version is radical clarity.
- **TYPE PAIRING**: Barlow, one family: display **500** (a legitimate mid-weight, light reads delicate, wrong for the work; this is not the banned heavy reflex), body 400.
- **PALETTE**: Light high-contrast paper, readable on a phone in a hallway with a burst pipe. `surface #FAFAF7 / #F1F1EC / #E7E7E0 / #D8D8CE · ink #191A17 · muted #52534D · faint #90918A · accent #C7581B (work orange) · line rgb(25 26 23 / 0.12)`.
- **RADIUS + LINE**: 6px on tap targets (thumb-first), 0 on images.
- **SPACING TEMPERAMENT**: The densest packet, this visitor needs answers, not atmosphere. Hero 6 to 8rem; still one breather: the guarantee statement alone in air.
- **MOTION CHARACTER**: **Native, near-zero**: 0.3 to 0.5s reveals at most, no parallax, no showpiece, nothing between the user and the phone number; the motion budget is instant tap feedback.
- **IMAGERY DIRECTION**: Real jobs, before/during/after (the one niche where before/after is honest evidence: shot, captioned, never a slider widget), the real van, the real crew's faces; phone-camera-honest through one grade pass. Ratios 4/3, 1/1. Never: hardhat stock models, flag-and-eagle kitsch, watermarked supplier photos.
- **BEELDBANK PACK**: `mortar` until the client's own photos arrive ([struq-imagery.md](struq-imagery.md)).
- **PAGE ARC**: Hook (service + area + phone number, all in viewport one) → Orient (the guarantee) → Prove (real jobs + review quotes typeset) → Deepen (services with honest pricing, the crew) → Invite (call + form fallback; footer with hours, service area, and license number in full).
- **ANTI-PATTERNS**: 1) Badge clutter, licensed/bonded/insured clip-art plus stacked Yelp/Google/BBB widgets; state the license number in text, pick ONE review source, and typeset it. 2) A pulsing red CALL NOW with countdown urgency, panic styling reads scam; calm competence converts emergencies. 3) A stock model in a spotless hardhat, the real crew and the real van are the entire trust engine; if the photos could be any company's, they're working against you.

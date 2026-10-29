import { External } from "@deckdot/struq-icons";
import { INSIDE, SITE } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

/** Deepen: the recipe as hairline editorial rows beside a sticky heading (grid-break 3). */
export function Inside() {
  return (
    <section id="inside" aria-labelledby="inside-title" className="bg-surface-1 py-[6rem] md:py-[8rem]">
      <div className="content-grid">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <p className="eyebrow text-eyebrow text-ink-muted">What is inside</p>
            <div className="mt-6" id="inside-title">
              <SplitReveal className="font-display text-h2 max-w-[13ch]">The decisions, in the order a studio makes them.</SplitReveal>
            </div>
            <p className="text-body mt-8 max-w-[38ch] text-ink-muted">
              One baseline for every build, and a reference file per technique that loads only when the page uses it.
            </p>
          </div>

          <Reveal as="ul" className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6" stagger={0.06}>
            {INSIDE.map((row) => (
              <li key={row.title} data-reveal className="grid gap-x-8 gap-y-3 py-9 md:grid-cols-7">
                <h3 className="type-h3 text-h3 md:col-span-3">{row.title}</h3>
                <p className="text-body max-w-[44ch] text-ink-muted md:col-span-4">{row.body}</p>
              </li>
            ))}
            <li data-reveal className="grid gap-x-8 gap-y-3 py-9 md:grid-cols-7">
              <h3 className="type-h3 text-h3 md:col-span-3">Struq Icons</h3>
              <div className="md:col-span-4">
                <p className="text-body max-w-[44ch] text-ink-muted">
                  The icon set it reaches for by default: 182 two-tone icons, 118 with their own hover motion, MIT.
                </p>
                <p className="mt-4">
                  <code className="text-small text-ink">{SITE.iconsInstall}</code>
                </p>
                <a href={SITE.icons} className="font-ui text-ui mt-5 inline-flex h-11 items-center gap-2 text-ink">
                  <span className="link-draw pb-1">Browse the set</span>
                  <External size={20} strokeWidth={1.5} />
                </a>
              </div>
            </li>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

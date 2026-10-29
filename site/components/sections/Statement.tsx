import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

/** Orient: the page's one manifesto line, alone in breather air (page-architecture.md §1). */
export function Statement() {
  return (
    <section aria-label="Why it works" className="content-grid py-[11rem] md:py-[18rem] lg:py-[20rem]">
      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <p className="eyebrow text-eyebrow text-ink-muted lg:col-span-3 lg:pt-4">Why it works</p>
        <div className="lg:col-span-9">
          <SplitReveal as="p" className="font-display text-statement max-w-[26ch]" start="top 78%">
            The gap between a template and an award-tier build is not talent. It is a finite set of decisions, made in
            the right order.
          </SplitReveal>
          <Reveal>
            <p data-reveal className="text-body mt-10 max-w-[46ch] text-ink-muted">
              Struq is those decisions, written down for your agent: what to plan before the first component, which two
              faces to pair, how the scroll should feel, and what to check before it calls a page done.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

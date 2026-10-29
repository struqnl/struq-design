import { ArrowRight } from "@deckdot/struq-icons";
import { REVIEW } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ProofCompare } from "./ProofCompare";

/** Prove: the one proof form, the blind review. Real numbers only (README). */
export function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-title" className="relative overflow-x-clip bg-surface-1 py-[6rem] md:py-[8rem]">
      <div className="content-grid">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-eyebrow text-ink-muted">Blind review</p>
            <div className="mt-6" id="proof-title">
              <SplitReveal className="font-display text-h2 max-w-[16ch]">Same brief. Same model. Scored blind.</SplitReveal>
            </div>
            <Reveal>
              <p data-reveal className="text-lead mt-8 max-w-[46ch] text-ink-muted">
                Three briefs, each built twice by the same model with the same materials: once as a plain coding agent,
                once with <code className="text-ink">/struq</code>. A reviewer scored all six from screenshots only,
                without knowing which was which.
              </p>
            </Reveal>
          </div>

          <Reveal as="dl" className="self-end lg:col-span-5 lg:pl-6" stagger={0.1}>
            <div data-reveal>
              <dt className="eyebrow text-eyebrow text-ink-muted">Average score out of 100</dt>
              <dd className="mt-3 flex items-center gap-4">
                <span className="stat text-stat text-ink-muted">{REVIEW.average.plain}</span>
                <ArrowRight size={32} strokeWidth={1.5} className="text-ink-muted" />
                <span className="stat text-stat text-accent">{REVIEW.average.struq}</span>
              </dd>
            </div>
            <div data-reveal className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-small text-ink-muted">Invented facts, in total</dt>
                <dd className="type-h3 text-h3 mt-1 tabular-nums">
                  {REVIEW.invented.plain} <span className="text-ink-muted">to</span> {REVIEW.invented.struq}
                </dd>
              </div>
              <div>
                <dt className="text-small text-ink-muted">Template tells, in total</dt>
                <dd className="type-h3 text-h3 mt-1 tabular-nums">
                  {REVIEW.tells.plain} <span className="text-ink-muted">to</span> {REVIEW.tells.struq}
                </dd>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <ol className="mt-24 space-y-24 md:mt-32 md:space-y-32">
        {REVIEW.rows.map((r) => (
          <li key={r.id} className="content-grid">
            {/* The frame runs from the content edge to the viewport edge (grid-break 2). */}
            <div className="grid gap-x-10 gap-y-8 lg:col-[content-start/full-end]! lg:grid-cols-12">
              <Reveal className="lg:col-span-4 lg:pt-2">
                <p data-reveal className="eyebrow text-eyebrow text-ink-muted">Brief</p>
                <h3 data-reveal className="type-h3 text-h3 mt-3 max-w-[18ch]">{r.brief}</h3>
                <dl data-reveal className="text-small mt-6 max-w-[30ch] divide-y divide-line border-y border-line">
                  {([
                    ["Score, without to with", r.plain, r.struq],
                    ["Invented facts", r.invented[0], r.invented[1]],
                    ["Template tells", r.tells[0], r.tells[1]],
                  ] as const).map(([k, a, b]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="text-ink-muted">{k}</dt>
                      <dd className="tabular-nums">
                        <span className="text-ink-muted">{a}</span> <span className="text-ink-muted">to</span> {b}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p data-reveal className="text-body mt-6 max-w-[40ch] text-ink-muted">
                  <span className="text-ink">Without:</span> {r.without} <span className="text-ink">With:</span> {r.with}
                </p>
              </Reveal>
              <div className="lg:col-span-8">
                <ProofCompare id={r.id} brief={r.brief} plain={r.plain} struq={r.struq} />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="content-grid mt-24 md:mt-32">
        <Reveal className="grid gap-x-10 border-t border-line pt-8 lg:grid-cols-12">
          <p data-reveal className="eyebrow text-eyebrow text-ink-muted lg:col-span-4">Where Struq lost points</p>
          <p data-reveal className="text-body mt-4 max-w-[58ch] lg:col-span-8 lg:mt-0">
            Craft. The plain builds were less ambitious and broke less; the Struq builds had reveal states that rendered
            empty in some captures. That is fixed: every build now runs an empty-region check on a reduced-motion
            capture, a no-JavaScript capture and the settled scroll before it calls itself done.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

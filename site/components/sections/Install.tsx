import { AGENTS, SITE } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CopyCommand } from "@/components/site/CopyCommand";

/** Breather before the showpiece: one command, in a lot of air. */
export function Install() {
  return (
    <section id="install" aria-labelledby="install-title" className="content-grid py-[10rem] md:py-[16rem]">
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-eyebrow text-ink-muted">Install</p>
          <div className="mt-6" id="install-title">
            <SplitReveal className="font-display text-h2 max-w-[12ch]">One command. Every agent.</SplitReveal>
          </div>
        </div>
        <Reveal className="lg:col-span-7 lg:pt-3">
          <div data-reveal>
            <CopyCommand command={SITE.install} size="large" className="w-full justify-between" />
          </div>
          <ul data-reveal aria-label="Supported agents" className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
            {AGENTS.map((a) => (
              <li key={a} className="type-h3 text-h3">
                {a}
              </li>
            ))}
          </ul>
          <p data-reveal className="text-body mt-10 max-w-[48ch] text-ink-muted">
            It installs into every supported agent on the machine. Add{" "}
            <code className="whitespace-nowrap text-ink">--agent claude-code</code> for one agent only. Node 18 or later.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

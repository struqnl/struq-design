import { COMMANDS } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

/**
 * Breather after the showpiece: four commands as oversized literal lines (mono is for
 * literal code only, and these are), stepping in on alternating indents.
 */
export function Commands() {
  return (
    <section id="commands" aria-labelledby="commands-title" className="content-grid py-[10rem] md:py-[16rem]">
      <div>
        <p className="eyebrow text-eyebrow text-ink-muted">Commands</p>
        <div className="mt-6" id="commands-title">
          <SplitReveal className="font-display text-h2 max-w-[16ch]">Four ways to call it.</SplitReveal>
        </div>
      </div>
      <Reveal as="ul" className="mt-20 space-y-16 md:mt-28 md:space-y-20" stagger={0.1}>
        {COMMANDS.map((c, i) => (
          <li key={c.cmd} data-reveal className={i % 2 ? "lg:pl-[33%]" : "lg:pl-[8%]"}>
            <code className="type-h3 text-h3 block break-words font-mono tracking-normal text-ink">{c.cmd}</code>
            <p className="text-body mt-4 max-w-[52ch] text-ink-muted">{c.body}</p>
          </li>
        ))}
      </Reveal>
      <Reveal>
        <p data-reveal className="text-body mt-20 max-w-[60ch] border-t border-line pt-8 text-ink-muted lg:ml-[8%]">
          The names change per agent: <code className="text-ink">$struq</code> in Codex,{" "}
          <code className="text-ink">/struq:struq</code> as a Claude Code plugin, and in Cursor and OpenCode you ask for
          the struq skill by name.
        </p>
      </Reveal>
    </section>
  );
}

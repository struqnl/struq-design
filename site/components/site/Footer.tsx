"use client";

import { useEffect, useRef } from "react";
import { External } from "@deckdot/struq-icons";
import { NAV, SITE } from "@/lib/site";
import { Wordmark } from "@/components/brand/Logo";
import { CopyCommand } from "./CopyCommand";

/**
 * Invite. The footer is the second display line (Urbanist, light), the install again,
 * a nav echo, a meta row and the signature move: the wordmark set edge to edge at the
 * exact width of its lane (an outlined SVG at 100% is measured by construction), cut
 * by the bottom edge. On wide screens with motion allowed the page lifts off it: the
 * footer is sticky at the bottom under the page (footer-reveal, no measuring, no shift).
 * It stays out of the paint until the reader nears it, so it can never be the LCP.
 */
export function Footer() {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = el.current!;
    const last = document.getElementById("inside");
    if (!last) {
      footer.dataset.near = "";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          footer.dataset.near = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 50% 0px" }
    );
    io.observe(last);
    return () => io.disconnect();
  }, []);

  const year = 2026;

  return (
    <footer ref={el} data-surface="inverse" aria-labelledby="close-title" className="overflow-hidden bg-inverse text-inverse-ink">
      <div className="content-grid pt-[6rem] md:pt-[5.5rem]">
        <div>
          <p className="eyebrow text-eyebrow text-inverse-muted">Install</p>
          <h2 id="close-title" className="font-display text-display mt-5 font-light">
            Give your agent taste.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CopyCommand command={SITE.install} tone="inverse" className="max-sm:w-full max-sm:justify-between" />
            <a href={SITE.repo} className="font-ui text-ui inline-flex h-11 items-center gap-2 text-inverse-ink">
              <span className="link-draw pb-1">Star on GitHub</span>
              <External size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-8 border-t border-inverse-line pt-6 md:grid-cols-12">
          <nav aria-label="Footer" className="md:col-span-7">
            <ul className="flex flex-wrap gap-x-7">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-ui text-ui inline-flex h-10 items-center">
                    <span className="link-draw pb-1">{l.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={SITE.repo} className="font-ui text-ui inline-flex h-10 items-center gap-2">
                  <span className="link-draw pb-1">GitHub</span>
                  <External size={20} strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href={SITE.icons} className="font-ui text-ui inline-flex h-10 items-center gap-2">
                  <span className="link-draw pb-1">Struq Icons</span>
                  <External size={20} strokeWidth={1.5} />
                </a>
              </li>
            </ul>
          </nav>
          <div className="text-small space-y-1.5 text-inverse-muted md:col-span-5 md:pt-2.5 md:text-right">
            <p>Made by {SITE.author}. Open source, MIT license. <span className="tabular-nums">© {year}</span></p>
            <p>This page was built from one /struq prompt.</p>
            <p>
              Dutch studio site:{" "}
              <a href={SITE.studio} hrefLang="nl" className="link-draw pb-0.5 text-inverse-ink">
                struq.nl
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Signature: fit-width wordmark, the lane's exact width, cut by the bottom edge. */}
      <div aria-hidden className="content-grid mt-10">
        <div className="aspect-[297/70] overflow-hidden">
          <Wordmark title={null} className="block h-auto w-full" dotColor="var(--color-inverse-accent)" />
        </div>
      </div>
    </footer>
  );
}

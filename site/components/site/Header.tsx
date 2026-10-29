"use client";

import { useRef } from "react";
import { External } from "@deckdot/struq-icons";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { NAV, SITE } from "@/lib/site";
import { Wordmark } from "@/components/brand/Logo";
import { MenuLauncher } from "./MenuLauncher";

/**
 * Transparent over the hero, a hard surface swap after 80px (Soft Modern: no blur),
 * hide on scroll down, back on scroll up, driven by one quickTo (nav-header.md §2).
 */
export function Header() {
  const el = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const show = gsap.quickTo(el.current, "yPercent", { duration: 0.4, ease: "power4.out" });
      ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          const node = el.current!;
          if (self.scroll() < 80) {
            show(0);
            node.dataset.surfaced = "false";
            return;
          }
          node.dataset.surfaced = "true";
          if (node.dataset.menu === "open") return;
          show(self.direction === 1 ? -100 : 0);
        },
      });
    },
    { scope: el }
  );

  return (
    <header
      ref={el}
      data-surfaced="false"
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent
                 transition-[background-color,border-color] duration-300
                 data-[surfaced=true]:border-line data-[surfaced=true]:bg-surface-0"
    >
      <div className="content-grid">
        <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
          <a href="#top" aria-label="Struq, back to top" className="-ml-1 rounded-sm p-1">
            <Wordmark title={null} className="h-[1.55rem] w-auto" />
          </a>

          <nav aria-label="Sections" className="max-md:hidden">
            <ul className="flex items-center gap-8">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-draw font-ui text-ui pb-1 text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.repo}
              className="font-ui text-ui inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-ink
                         transition-[background-color,border-color] duration-200 hover:border-ink/30 hover:bg-surface-1 max-md:hidden"
            >
              Star on GitHub <External size={20} strokeWidth={1.5} />
            </a>
            <MenuLauncher />
          </div>
        </div>
      </div>
    </header>
  );
}

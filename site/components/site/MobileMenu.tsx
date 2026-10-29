"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Dialog } from "radix-ui";
import { useLenis } from "lenis/react";
import { External } from "@deckdot/struq-icons";
import { gsap } from "@/lib/gsap";
import { NAV, SITE } from "@/lib/site";
import { CopyCommand } from "./CopyCommand";

/**
 * The full-screen menu on Radix Dialog (nav-header.md §3b): an inverse panel wipes down,
 * the links rise from masks, the exit runs at about 60% and reverses the stagger.
 * One-pager variant: links close the menu, then Lenis scrolls to the anchor.
 */
export function MobileMenu({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement | null>(null);
  const enterTl = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const pending = useRef<string | null>(null);
  const lenis = useLenis();

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setPanel = useCallback((node: HTMLDivElement | null) => {
    panel.current = node;
    if (!node) return;
    const links = node.querySelectorAll("[data-menu-link]");
    const meta = node.querySelector("[data-menu-meta]");
    if (reduced()) {
      enterTl.current = gsap.timeline().fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "none" });
      return;
    }
    enterTl.current = gsap
      .timeline()
      .fromTo(node, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.inOut" })
      .fromTo(links, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "-=0.2")
      .fromTo(meta, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.15");
  }, []);

  const finish = () => {
    closing.current = false;
    setOpen(false);
    document.querySelector("header")?.removeAttribute("data-menu");
    lenis?.start();
    const href = pending.current;
    pending.current = null;
    if (href) {
      const target = document.querySelector<HTMLElement>(href);
      if (target && lenis) lenis.scrollTo(target, { offset: -64 });
      else target?.scrollIntoView();
    }
  };

  const onOpenChange = (next: boolean) => {
    if (next) {
      lenis?.stop();
      document.querySelector("header")?.setAttribute("data-menu", "open");
      setOpen(true);
      return;
    }
    if (closing.current || !panel.current) return;
    closing.current = true;
    enterTl.current?.kill();
    const node = panel.current;
    if (reduced()) {
      gsap.to(node, { autoAlpha: 0, duration: 0.15, ease: "none", onComplete: finish });
      return;
    }
    gsap
      .timeline({ onComplete: finish })
      .to(node.querySelectorAll("[data-menu-link]"), {
        yPercent: -115, duration: 0.35, ease: "power2.in", stagger: { each: 0.03, from: "end" },
      })
      .to(node, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power4.inOut" }, "-=0.1");
  };

  const onLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    pending.current = href;
    onOpenChange(false);
  };

  // Mounted by the first tap on the launcher: open straight away.
  const opened = useRef(false);
  useEffect(() => {
    if (!startOpen || opened.current) return;
    opened.current = true;
    lenis?.stop();
    document.querySelector("header")?.setAttribute("data-menu", "open");
    setOpen(true);
  }, [startOpen, lenis]);

  // A stuck lock can never outlive the component (setup.md §2b).
  useEffect(() => () => { lenis?.start(); }, [lenis]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger className="font-ui text-ui h-12 px-1 text-ink md:hidden">Menu</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          ref={setPanel}
          aria-describedby={undefined}
          data-surface="inverse"
          className="fixed inset-0 z-[60] bg-inverse text-inverse-ink"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <div className="content-grid h-full">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-end">
                <Dialog.Close className="font-ui text-ui h-12 px-1">Close</Dialog.Close>
              </div>
              <nav aria-label="Sections" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {NAV.map((l) => (
                    <li key={l.href} className="-my-[0.12em] overflow-hidden py-[0.12em]">
                      <a
                        data-menu-link
                        href={l.href}
                        onClick={(e) => onLink(e, l.href)}
                        className="font-display text-h2 block py-1"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div data-menu-meta className="space-y-6 pb-10">
                <CopyCommand command={SITE.install} tone="inverse" className="w-full justify-between" />
                <a href={SITE.repo} className="font-ui text-ui inline-flex h-12 items-center gap-2 text-inverse-ink">
                  Star on GitHub <External size={20} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

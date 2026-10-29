"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@deckdot/struq-icons";

/**
 * The install line as the page's primary CTA: literal code (the one place mono is allowed)
 * with one flame control. The label swaps to "Copied" with the set's own check, then back.
 */
export function CopyCommand({
  command,
  tone = "light",
  size = "base",
  className = "",
}: {
  command: string;
  tone?: "light" | "inverse";
  size?: "base" | "large";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const r = document.createRange();
      const node = document.getElementById(`cmd-${command.length}`);
      if (node) {
        r.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  const shell =
    tone === "light"
      ? "bg-ink text-surface-0"
      : "bg-inverse-1 text-inverse-ink border border-inverse-line";
  const prompt = tone === "light" ? "text-surface-3" : "text-inverse-muted";

  return (
    <div
      className={`inline-flex max-w-full items-center gap-3 rounded-[1.75rem] py-2 pl-5 pr-2 sm:rounded-full sm:gap-5 ${shell} ${className}`}
    >
      <code
        id={`cmd-${command.length}`}
        className={`min-w-0 py-1 [overflow-wrap:anywhere] sm:overflow-x-auto sm:whitespace-nowrap ${size === "large" ? "text-lead" : "text-small"} [scrollbar-width:none]`}
        data-lenis-prevent
      >
        <span aria-hidden className={`select-none ${prompt}`}>$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Install command copied" : "Copy install command"}
        className="font-ui text-ui inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-4 text-ink
                   transition-[background-color,transform] duration-200 ease-[var(--ease-out-quart)]
                   hover:bg-inverse-accent active:scale-[0.97]"
      >
        {copied ? <Check size={20} strokeWidth={1.5} /> : <Copy size={20} strokeWidth={1.5} />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

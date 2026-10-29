import { WORDMARK_DOT, WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./logo-paths";

/**
 * The Struq wordmark: Comfortaa 600 outlined, the flame full stop as its own path
 * so it always takes the accent. `currentColor` carries the ink on any surface.
 */
export function Wordmark({
  className = "",
  title = "Struq",
  dotColor = "var(--color-accent)",
}: {
  className?: string;
  title?: string | null;
  dotColor?: string;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={WORDMARK_LETTERS} />
      <path d={WORDMARK_DOT} fill={dotColor} />
    </svg>
  );
}

/**
 * The mark: three stacked pills, narrow to wide. The brief, the plan, the site.
 * Each bar carries data-bar so the hero can stack them in and pull them apart.
 */
export function Mark({
  className = "",
  title = "Struq",
  accent = "var(--color-accent)",
}: {
  className?: string;
  title?: string | null;
  accent?: string;
}) {
  return (
    <svg
      viewBox="18 22 64 56"
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
      overflow="visible"
    >
      {title ? <title>{title}</title> : null}
      <rect data-bar="top" x="34" y="22" width="32" height="18" rx="9" fill="currentColor" opacity="0.7" />
      <rect data-bar="core" x="26" y="41" width="48" height="18" rx="9" fill="currentColor" />
      <rect data-bar="base" x="18" y="60" width="64" height="18" rx="9" fill={accent} opacity="0.9" />
    </svg>
  );
}

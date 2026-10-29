"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// The Radix menu only matters on phones and only once someone opens it, so it stays out of
// the first-load bundle (performance.md §1: Radix imported where it opens, not at the root).
const LazyMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), {
  ssr: false,
  loading: () => (
    <span className="font-ui text-ui inline-flex h-12 items-center px-1 text-ink md:hidden">Menu</span>
  ),
});

export function MenuLauncher() {
  const [wanted, setWanted] = useState(false);
  if (wanted) return <LazyMenu startOpen />;
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => setWanted(true)}
      onPointerEnter={() => void import("./MobileMenu")}
      onTouchStart={() => void import("./MobileMenu")}
      className="font-ui text-ui h-12 px-1 text-ink md:hidden"
    >
      Menu
    </button>
  );
}

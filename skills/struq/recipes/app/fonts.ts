// app/fonts.ts (Struq recipe)
// Exactly two faces: a display face and a text face. Swap these two imports for the pairing you
// picked in SKILL.md ("Pick the two faces"); keep the variable names --face-display and --face-body,
// globals.css maps them to font-display and font-body.
// Default: S2, Fraunces (soft serif display) over Urbanist (round geometric text).
import { Fraunces, Urbanist } from "next/font/google";

export const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--face-display",
  display: "swap",
});

export const body = Urbanist({
  subsets: ["latin"],
  variable: "--face-body",
  display: "swap",
});

/** Every face's CSS variable, for the <html> className in app/layout.tsx. */
export const fontVariables = [display, body].map((f) => f.variable).join(" ");

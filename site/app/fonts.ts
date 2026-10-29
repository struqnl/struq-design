// The House pairing (typography.md §3.1 note): Comfortaa for the h1 and the wordmark only,
// Urbanist for every other role. Two variable files, both preloaded, nothing else.
import { Comfortaa, Urbanist } from "next/font/google";

export const brand = Comfortaa({
  subsets: ["latin"],
  weight: "variable", // 300 to 700: the hero's weight-in runs 300 to 400
  variable: "--font-brand-face",
  display: "swap",
});

export const body = Urbanist({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

// app/layout.tsx (Struq recipe)
// Replace SITE_TITLE and SITE_DESCRIPTION, and set lang to the site's language.
// The inline script adds the `js` class before first paint: the motion gate in globals.css keys
// off it, so animated elements never flash before their entrance and stay visible without JS.
import type { Metadata } from "next";
import { Cursor } from "@/components/struq/Cursor";
import { SmoothScroll } from "@/components/struq/SmoothScroll";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SITE_TITLE",
  description: "SITE_DESCRIPTION",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}

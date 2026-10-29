import type { Metadata, Viewport } from "next";
import "@deckdot/struq-icons/tokens.css";
import "@deckdot/struq-icons/icons.css";
import "@deckdot/struq-icons/states.css";
import "./globals.css";
import { brand, body } from "./fonts";
import { SITE } from "@/lib/site";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | Struq" },
  description: SITE.description,
  applicationName: "Struq",
  authors: [{ name: SITE.author }],
  openGraph: { type: "website", siteName: "Struq", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${brand.variable} ${body.variable} antialiased`} data-footer-reveal suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
        <noscript>
          <style>{"[data-split-hero],[data-hero-mark] [data-bar]{visibility:visible!important}"}</style>
        </noscript>
      </head>
      <body className="bg-surface-0 font-body text-ink">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

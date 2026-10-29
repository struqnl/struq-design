import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Proof } from "@/components/sections/Proof";
import { Install } from "@/components/sections/Install";
import { BuildSequence } from "@/components/sections/BuildSequence";
import { Commands } from "@/components/sections/Commands";
import { Inside } from "@/components/sections/Inside";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Struq",
  description: SITE.description,
  url: SITE.url,
  codeRepository: SITE.repo,
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: "Markdown",
  author: { "@type": "Person", name: SITE.author },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main>
        <Hero />
        <Statement />
        <Proof />
        <Install />
        <BuildSequence />
        <Commands />
        <Inside />
      </main>
      <Footer />
    </>
  );
}

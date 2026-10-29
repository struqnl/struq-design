import type { Metadata } from "next";
import { ArrowLeft } from "@deckdot/struq-icons";
import Link from "next/link";
import { Mark } from "@/components/brand/Logo";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <div className="content-grid pb-[8rem] pt-[12rem]">
        <div>
          <p className="eyebrow text-eyebrow text-ink-muted">404</p>
          <h1 className="font-brand text-display mt-6 max-w-[11ch]">This page is not in the plan.</h1>
          <p className="text-lead mt-10 max-w-[40ch] text-ink-muted">
            There is one page here, and it is a long one. It starts at the top.
          </p>
          <Link href="/" className="font-ui text-ui mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-surface-0">
            <ArrowLeft size={20} strokeWidth={1.5} />
            Back to the start
          </Link>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute -bottom-[10vw] -right-[8vw] w-[44vw] text-ink md:w-[30vw]">
        <Mark title={null} className="h-auto w-full" />
      </div>
    </main>
  );
}

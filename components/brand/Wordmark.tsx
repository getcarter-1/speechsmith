import Link from "next/link"
import { cn } from "@/lib/utils"

// Spec §1 — ink square glyph + uppercase wordmark, links home.
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 no-underline", className)}
    >
      <span aria-hidden className="size-5 shrink-0 rounded-sharp bg-ink" />
      <span className="font-ui text-section-title font-bold uppercase tracking-[0.02em] text-content-primary">
        SpeechSmith
      </span>
    </Link>
  )
}

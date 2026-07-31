import Link from "next/link"
import { cn } from "@/lib/utils"

// Wordmark, links home. (Placeholder glyph removed; casing kept as SpeechSmith.)
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-ui text-section-title font-bold tracking-tight text-content-primary no-underline",
        className
      )}
    >
      SpeechSmith
    </Link>
  )
}

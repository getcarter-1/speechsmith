import Link from "next/link"
import type { ReactNode } from "react"
import { Wordmark } from "./Wordmark"

// Spec §1 — persistent identity + escape hatch. Never carries the character.
interface SiteHeaderProps {
  variant?: "marketing" | "app"
  primaryHref?: string
  primaryLabel?: string
  /** app variant: project name / account controls on the right. */
  right?: ReactNode
}

export function SiteHeader({
  variant = "marketing",
  primaryHref = "/signup",
  primaryLabel = "Start a speech",
  right,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-[var(--container-app)] items-center justify-between px-4 lg:h-16">
        <Wordmark />
        {variant === "marketing" ? (
          <nav aria-label="Main" className="flex items-center gap-5">
            <Link
              href="/login"
              className="font-mono text-label uppercase text-content-muted no-underline hover:text-content-primary"
            >
              Sign in
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex min-h-11 items-center rounded-control bg-ink px-4 font-ui text-button font-semibold text-content-inverse no-underline"
            >
              {primaryLabel}
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-4">{right}</div>
        )}
      </div>
    </header>
  )
}

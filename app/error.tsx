"use client"

import { useEffect } from "react"
import Link from "next/link"
import { primaryLinkClass, outlineLinkClass } from "@/lib/ui"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div
        role="alert"
        className="flex w-full max-w-[var(--container-form)] flex-col items-center gap-4 rounded-card border border-danger-border bg-surface p-6 text-center"
      >
        <h1 className="font-ui text-section-title font-bold">
          Something went wrong
        </h1>
        <p className="text-body text-content-secondary">
          Sorry — that didn&apos;t work. Any progress you&apos;d saved is still
          there. Try again, or head back to your dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className={primaryLinkClass} onClick={() => reset()}>
            Try again
          </button>
          <Link className={outlineLinkClass} href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

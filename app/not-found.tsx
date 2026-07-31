import Link from "next/link"
import { primaryLinkClass } from "@/lib/ui"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="flex w-full max-w-[var(--container-form)] flex-col items-center gap-4 text-center">
        <h1 className="font-ui text-page-title font-bold">Page not found</h1>
        <p className="text-body text-content-muted">
          We couldn&apos;t find that page.
        </p>
        <Link className={primaryLinkClass} href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

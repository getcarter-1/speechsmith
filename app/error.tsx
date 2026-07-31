"use client"

import { useEffect } from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

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
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          Sorry — that didn&apos;t work. Any progress you&apos;d saved is still
          there. Try again, or head back to your dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className={buttonVariants()} onClick={() => reset()}>
            Try again
          </button>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

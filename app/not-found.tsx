import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t find that page.
        </p>
        <Link className={buttonVariants()} href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

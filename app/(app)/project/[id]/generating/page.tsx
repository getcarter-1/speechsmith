"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    // Placeholder — full AI pipeline comes in Phase D
    const timer = setTimeout(() => {
      router.push(`/project/${id}/review`)
    }, 3000)
    return () => clearTimeout(timer)
  }, [id, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Writing your speech...</h1>
          <p className="text-muted-foreground">
            We're pulling everything together. This usually takes 
            about 30–60 seconds.
          </p>
        </div>

        <div className="rounded-lg border p-4 text-left space-y-2 text-sm text-muted-foreground">
          <p>✓ Analysing your stories</p>
          <p>✓ Calibrating tone and humour</p>
          <p>✓ Checking audience safety</p>
          <p className="text-foreground font-medium animate-pulse">
            ⟳ Drafting your speech...
          </p>
        </div>
      </div>
    </div>
  )
}
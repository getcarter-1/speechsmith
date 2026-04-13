"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("Starting...")
  const [error, setError] = useState("")
  const [jobId, setJobId] = useState<string | null>(null)

  useEffect(() => {
    let pollInterval: NodeJS.Timeout

    const startGeneration = async () => {
      try {
        const res = await fetch("/api/generate/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id }),
        })

        if (!res.ok) throw new Error("Failed to start generation")
        const { jobId } = await res.json()
        setJobId(jobId)

        pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/generate/status/${jobId}`)
            const status = await statusRes.json()

            setProgress(status.progress ?? 0)
            setStatusText(status.latestLog ?? "Working...")

            if (status.state === "completed") {
              clearInterval(pollInterval)
              router.push(`/project/${id}/review`)
            } else if (status.state === "failed") {
              clearInterval(pollInterval)
              setError("Generation failed. Please try again.")
            }
          } catch {
            console.error("Poll error")
          }
        }, 3000)
      } catch {
        setError("Failed to start generation. Please try again.")
      }
    }

    startGeneration()
    return () => clearInterval(pollInterval)
  }, [id, router])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => router.push(`/project/${id}/sample`)}
            className="text-sm text-muted-foreground underline"
          >
            Go back and try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Writing your speech...</h1>
          <p className="text-muted-foreground">
            We're pulling everything together. Hang tight — this takes 
            about 30–60 seconds.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{statusText}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
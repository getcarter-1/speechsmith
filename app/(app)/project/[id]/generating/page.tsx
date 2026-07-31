"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("Starting…")
  const [error, setError] = useState("")

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

        pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/generate/status/${jobId}`)
            const status = await statusRes.json()
            setProgress(status.progress ?? 0)
            setStatusText(status.latestLog ?? "Working…")

            if (status.state === "completed") {
              clearInterval(pollInterval)
              if (status.projectStatus === "REVIEW") {
                router.push(`/project/${id}/review`)
              } else {
                setError(
                  status.latestLog ||
                    "We couldn't finish the speech. Please try again."
                )
              }
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
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <div
          role="alert"
          className="flex w-full max-w-[var(--container-form)] flex-col items-center gap-4 rounded-card border border-danger-border bg-surface p-6 text-center"
        >
          <h1 className="font-ui text-section-title font-bold">
            We couldn&apos;t finish the speech
          </h1>
          <p className="text-body text-content-secondary">{error}</p>
          <p className="text-body-sm text-content-muted">
            Your answers are saved.
          </p>
          <PrimaryCTA onClick={() => router.push(`/project/${id}/interview`)}>
            Back to the interview
          </PrimaryCTA>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="flex w-full max-w-[var(--container-form)] flex-col items-center gap-6 text-center">
        <SpeechsmithCharacter
          state="generating"
          size="panel"
          scale={0.6}
          decorative
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-ui text-section-title font-bold">
            Writing your speech…
          </h1>
          <p className="text-body text-content-muted">
            We&apos;re pulling everything together — about 30–60 seconds.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-body-sm text-content-muted">{statusText}</span>
            <span className="font-mono text-annotation text-content-faint">
              {progress}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-pill bg-surface-sunken">
            <div
              className="h-full rounded-pill bg-accent transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-easing-standard)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

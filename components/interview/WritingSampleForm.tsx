"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StepHeader } from "@/components/flow/StepHeader"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"
import { FreeTextAnswerField } from "./FreeTextAnswerField"

interface WritingSampleFormProps {
  projectId: string
  groomName: string
  existingSample?: string
}

export default function WritingSampleForm({
  projectId,
  groomName,
  existingSample = "",
}: WritingSampleFormProps) {
  const router = useRouter()
  const [sample, setSample] = useState(existingSample)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const words = sample.trim() ? sample.trim().split(/\s+/).length : 0

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/projects/${projectId}/sample`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writingSample: sample }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleContinue = async () => {
    if (sample && !saved) await handleSave()
    router.push(`/project/${projectId}/generating`)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[var(--container-form)] px-4 py-8">
        <StepHeader groomName={groomName} />

        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-occasion">
            Almost there — one optional step
          </span>
          <h1 className="font-ui text-page-title font-bold">
            Sound like yourself
          </h1>
          <p className="text-body text-content-muted">
            Paste a short piece of writing that sounds like you — a WhatsApp
            message, an email, anything. We&apos;ll match your natural voice in
            the speech.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <FreeTextAnswerField
            long
            rows={8}
            placeholder="e.g. Mate, you absolute legend. Can't believe you actually pulled it off — she said yes! Right, we need to celebrate properly…"
            value={sample}
            onChange={(e) => {
              setSample(e.target.value)
              setSaved(false)
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-annotation text-content-faint">
              {words > 0
                ? `${words} words — ${words < 30 ? "a bit short, try for 50+" : "good length"}`
                : "Aim for at least 50 words"}
            </span>
            {sample.length > 0 && (
              <SecondaryCTA
                variant="quiet"
                onClick={handleSave}
                disabled={isSaving || saved}
              >
                {saved ? "Saved ✓" : isSaving ? "Saving…" : "Save"}
              </SecondaryCTA>
            )}
          </div>
          {error && <p className="text-body-sm text-danger">{error}</p>}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <SecondaryCTA
            variant="quiet"
            onClick={() => router.push(`/project/${projectId}/media`)}
          >
            ← Back
          </SecondaryCTA>
          <div className="flex items-center gap-3">
            <SecondaryCTA
              variant="quiet"
              onClick={() => router.push(`/project/${projectId}/generating`)}
            >
              Skip this step
            </SecondaryCTA>
            <PrimaryCTA onClick={handleContinue} disabled={isSaving}>
              Generate my speech →
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  )
}

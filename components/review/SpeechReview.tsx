"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StepHeader } from "@/components/flow/StepHeader"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"
import { FreeTextAnswerField } from "@/components/interview/FreeTextAnswerField"

type SectionStatus = "PENDING" | "GOOD" | "DROP" | "REWRITE"

interface ReviewSection {
  id: string
  sectionType: string
  title: string | null
  content: string
  orderIndex: number
  status: SectionStatus
  rewriteNote: string | null
}

interface SpeechReviewProps {
  projectId: string
  groomName: string
  rewriteRound: number
  sections: ReviewSection[]
}

const MAX_REWRITE_ROUNDS = 2

const statusBadge: Record<SectionStatus, { label: string; cls: string }> = {
  PENDING: { label: "Not reviewed", cls: "border-line text-content-muted" },
  GOOD: {
    label: "Keeping",
    cls: "border-success-border bg-success-surface text-success",
  },
  REWRITE: {
    label: "Rewrite",
    cls: "border-info-border bg-info-surface text-info",
  },
  DROP: {
    label: "Dropping",
    cls: "border-danger-border bg-danger-surface text-danger",
  },
}

function prettifyType(type: string) {
  return type.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function DecisionButton({
  label,
  active,
  activeCls,
  onClick,
}: {
  label: string
  active: boolean
  activeCls: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-control border px-4 font-ui text-button font-semibold transition-colors duration-[var(--motion-duration-fast)]",
        active
          ? activeCls
          : "border-line text-content-secondary hover:border-line-strong"
      )}
    >
      {label}
    </button>
  )
}

export default function SpeechReview({
  projectId,
  groomName,
  rewriteRound,
  sections: initialSections,
}: SpeechReviewProps) {
  const [sections, setSections] = useState<ReviewSection[]>(initialSections)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [working, setWorking] = useState<string | null>(null)
  const [error, setError] = useState("")

  const reviewedCount = sections.filter((s) => s.status !== "PENDING").length
  const allReviewed = reviewedCount === sections.length
  const rewriteCount = sections.filter((s) => s.status === "REWRITE").length
  const canRewrite = rewriteRound < MAX_REWRITE_ROUNDS
  const willRewrite = rewriteCount > 0 && canRewrite
  const keptCount = sections.filter((s) => s.status !== "DROP").length
  const allDropped = sections.length > 0 && keptCount === 0
  const counts = {
    good: sections.filter((s) => s.status === "GOOD").length,
    rewrite: rewriteCount,
    drop: sections.filter((s) => s.status === "DROP").length,
  }

  const persist = async (
    sectionId: string,
    status: SectionStatus,
    rewriteNote: string | null
  ) => {
    setSavingId(sectionId)
    try {
      await fetch(`/api/projects/${projectId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, status, rewriteNote }),
      })
    } catch {
      console.error("Failed to save review")
    } finally {
      setSavingId(null)
    }
  }

  const setStatus = (sectionId: string, status: SectionStatus) => {
    const existing = sections.find((s) => s.id === sectionId)
    const note = status === "REWRITE" ? existing?.rewriteNote ?? null : null
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, status, rewriteNote: note } : s))
    )
    persist(sectionId, status, note)
  }

  const setNote = (sectionId: string, note: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, rewriteNote: note } : s))
    )
  }

  const saveNote = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (section && section.status === "REWRITE") {
      persist(sectionId, "REWRITE", section.rewriteNote ?? null)
    }
  }

  const handleContinue = async () => {
    if (!allReviewed || working) return
    setError("")

    if (willRewrite) {
      setWorking("Rewriting the sections you flagged — this takes a moment…")
      try {
        const res = await fetch(`/api/projects/${projectId}/rewrite`, {
          method: "POST",
        })
        if (!res.ok) throw new Error("rewrite failed")
        window.location.href = `/project/${projectId}/review`
      } catch {
        setWorking(null)
        setError("Something went wrong rewriting. Please try again.")
      }
      return
    }

    setWorking("Putting your final speech together…")
    try {
      const res = await fetch(`/api/projects/${projectId}/finalize`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("finalize failed")
      window.location.href = `/project/${projectId}/final`
    } catch {
      setWorking(null)
      setError("Something went wrong finishing up. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      {working && (
        <div className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-canvas/80 backdrop-blur-sm">
          <div className="flex max-w-sm flex-col items-center gap-4 px-4 text-center">
            <div className="size-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="text-body-sm text-content-muted">{working}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[40rem] px-4 py-8">
        <StepHeader groomName={groomName} />

        <div className="mb-6 flex flex-col gap-2">
          <h1 className="font-ui text-page-title font-bold">
            Review your speech
          </h1>
          <p className="text-body text-content-muted">
            Go through each part and decide what to keep, rewrite, or drop. Add a
            note on anything you&apos;d like changed.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-4">
          <span className="text-body-sm text-content-muted">
            {reviewedCount} of {sections.length} reviewed
          </span>
          <div className="flex items-center gap-2 font-mono text-annotation">
            <span className="text-success">{counts.good} keeping</span>
            <span className="text-info">{counts.rewrite} to rewrite</span>
            <span className="text-danger">{counts.drop} dropping</span>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {sections.map((section) => {
            const badge = statusBadge[section.status]
            return (
              <div
                key={section.id}
                className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-ui text-card-title font-semibold text-content-primary">
                    {section.title || prettifyType(section.sectionType)}
                  </h2>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-control border px-2 py-0.5 font-mono text-annotation",
                      badge.cls
                    )}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="whitespace-pre-wrap font-reading text-speech-editor text-content-primary">
                  {section.content}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <DecisionButton
                    label="Keep"
                    active={section.status === "GOOD"}
                    activeCls="border-success-border bg-success-surface text-success"
                    onClick={() => setStatus(section.id, "GOOD")}
                  />
                  <DecisionButton
                    label="Rewrite"
                    active={section.status === "REWRITE"}
                    activeCls="border-info-border bg-info-surface text-info"
                    onClick={() => setStatus(section.id, "REWRITE")}
                  />
                  <DecisionButton
                    label="Drop"
                    active={section.status === "DROP"}
                    activeCls="border-danger-border bg-danger-surface text-danger"
                    onClick={() => setStatus(section.id, "DROP")}
                  />
                  {savingId === section.id && (
                    <span className="font-mono text-annotation text-content-faint">
                      Saving…
                    </span>
                  )}
                </div>

                {section.status === "REWRITE" && (
                  <FreeTextAnswerField
                    value={section.rewriteNote ?? ""}
                    onChange={(e) => setNote(section.id, e.target.value)}
                    onBlur={() => saveNote(section.id)}
                    placeholder="What would you like changed? e.g. keep the story but make it shorter and less cheesy."
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-3">
          {rewriteCount > 0 && !canRewrite && (
            <p className="text-body-sm text-content-muted">
              You&apos;ve used both rewrite rounds — continuing will build your
              final speech from the current wording.
            </p>
          )}
          {allDropped && !willRewrite && (
            <p className="text-body-sm text-danger">
              You&apos;ve dropped every section — keep at least one to build a
              speech.
            </p>
          )}
          {error && <p className="text-body-sm text-danger">{error}</p>}
          <div className="flex items-center justify-between gap-3">
            <p className="text-body-sm text-content-muted">
              {allReviewed
                ? "All parts reviewed."
                : `${sections.length - reviewedCount} still to review.`}
            </p>
            <PrimaryCTA
              onClick={handleContinue}
              disabled={!allReviewed || !!working || (!willRewrite && allDropped)}
            >
              {willRewrite
                ? `Rewrite ${rewriteCount} section${rewriteCount > 1 ? "s" : ""} →`
                : "Finish & see my speech →"}
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  )
}

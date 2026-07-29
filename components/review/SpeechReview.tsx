"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

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
  sections: ReviewSection[]
}

const statusBadge: Record<
  SectionStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  PENDING: { label: "Not reviewed", variant: "outline" },
  GOOD: { label: "Keeping", variant: "default" },
  REWRITE: { label: "Rewrite", variant: "secondary" },
  DROP: { label: "Dropping", variant: "destructive" },
}

function prettifyType(type: string) {
  return type.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function SpeechReview({
  projectId,
  groomName,
  sections: initialSections,
}: SpeechReviewProps) {
  const router = useRouter()
  const [sections, setSections] = useState<ReviewSection[]>(initialSections)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [isFinishing, setIsFinishing] = useState(false)

  const reviewedCount = sections.filter((s) => s.status !== "PENDING").length
  const allReviewed = reviewedCount === sections.length
  const counts = {
    good: sections.filter((s) => s.status === "GOOD").length,
    rewrite: sections.filter((s) => s.status === "REWRITE").length,
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
      prev.map((s) =>
        s.id === sectionId ? { ...s, status, rewriteNote: note } : s
      )
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

  const handleFinish = () => {
    // E2 will turn this into "start the rewrite round"; for now the review
    // decisions are already saved, so return to the dashboard.
    setIsFinishing(true)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-muted-foreground">
              {groomName}&apos;s speech
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              Save &amp; exit
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-2">Review your speech</h1>
          <p className="text-muted-foreground">
            Go through each part and decide what to keep, rewrite, or drop. Add a
            note on anything you&apos;d like changed.
          </p>
        </div>

        {/* Summary */}
        <Card size="sm" className="mb-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {reviewedCount} of {sections.length} reviewed
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="default">{counts.good} keeping</Badge>
              <Badge variant="secondary">{counts.rewrite} to rewrite</Badge>
              <Badge variant="destructive">{counts.drop} dropping</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const badge = statusBadge[section.status]
            return (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">
                      {section.title || prettifyType(section.sectionType)}
                    </CardTitle>
                    <Badge variant={badge.variant} className="shrink-0">
                      {badge.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {section.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={section.status === "GOOD" ? "default" : "outline"}
                      onClick={() => setStatus(section.id, "GOOD")}
                    >
                      Keep
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        section.status === "REWRITE" ? "secondary" : "outline"
                      }
                      onClick={() => setStatus(section.id, "REWRITE")}
                    >
                      Rewrite
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        section.status === "DROP" ? "destructive" : "outline"
                      }
                      onClick={() => setStatus(section.id, "DROP")}
                    >
                      Drop
                    </Button>
                    {savingId === section.id && (
                      <span className="text-xs text-muted-foreground">
                        Saving...
                      </span>
                    )}
                  </div>

                  {section.status === "REWRITE" && (
                    <Textarea
                      value={section.rewriteNote ?? ""}
                      onChange={(e) => setNote(section.id, e.target.value)}
                      onBlur={() => saveNote(section.id)}
                      placeholder="What would you like changed? e.g. keep the story but make it shorter and less cheesy."
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {allReviewed
              ? "All parts reviewed."
              : `${sections.length - reviewedCount} still to review.`}
          </p>
          <Button onClick={handleFinish} disabled={!allReviewed || isFinishing}>
            Save review &amp; continue
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StepHeader } from "@/components/flow/StepHeader"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"
import { FreeTextAnswerField } from "@/components/interview/FreeTextAnswerField"

interface Story {
  id: string
  title: string
  setup: string
  event: string
  payoff: string
  whatItReveals: string
}

interface StoriesManagerProps {
  projectId: string
  groomName: string
  initialStories: Story[]
}

const inputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-surface-sunken px-3 font-ui text-body text-content-primary outline-none placeholder:text-content-faint focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]"

const TEXTAREAS: { key: keyof Omit<Story, "id" | "title">; label: string; placeholder: string }[] = [
  { key: "setup", label: "Set the scene", placeholder: "Where and when was this, and what was going on?" },
  { key: "event", label: "What happened?", placeholder: "Tell it like you'd tell a mate down the pub." },
  { key: "payoff", label: "The payoff", placeholder: "The punchline, or how it all turned out." },
  { key: "whatItReveals", label: "What it says about him (optional)", placeholder: "The warm point underneath the funny bit." },
]

export default function StoriesManager({
  projectId,
  groomName,
  initialStories,
}: StoriesManagerProps) {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const addStory = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/stories`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("failed")
      const s = await res.json()
      setStories((prev) => [
        ...prev,
        {
          id: s.id,
          title: s.title ?? "",
          setup: s.setup ?? "",
          event: s.event ?? "",
          payoff: s.payoff ?? "",
          whatItReveals: s.whatItReveals ?? "",
        },
      ])
    } catch {
      console.error("Failed to add story")
    } finally {
      setBusy(false)
    }
  }

  const updateField = (id: string, key: keyof Omit<Story, "id">, value: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    )
  }

  const saveStory = async (id: string) => {
    const story = stories.find((s) => s.id === id)
    if (!story) return
    setSavingId(id)
    try {
      await fetch(`/api/projects/${projectId}/stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: story.title,
          setup: story.setup,
          event: story.event,
          payoff: story.payoff,
          whatItReveals: story.whatItReveals,
        }),
      })
    } catch {
      console.error("Failed to save story")
    } finally {
      setSavingId(null)
    }
  }

  const deleteStory = async (id: string) => {
    if (!confirm("Delete this story?")) return
    setStories((prev) => prev.filter((s) => s.id !== id))
    try {
      await fetch(`/api/projects/${projectId}/stories/${id}`, { method: "DELETE" })
    } catch {
      console.error("Failed to delete story")
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[var(--container-form)] px-4 py-8">
        <StepHeader groomName={groomName} />

        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-occasion">
            The good stuff
          </span>
          <h1 className="font-ui text-page-title font-bold">The stories</h1>
          <p className="text-body text-content-muted">
            These are the heart of the speech. Add the anecdotes about{" "}
            {groomName} worth telling — the more specific, the funnier and warmer
            the result.
          </p>
        </div>

        {stories.length === 0 && (
          <div className="mb-4 flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-4 py-10 text-center">
            <p className="text-body text-content-muted">
              No stories yet. Add the first one to get started.
            </p>
            <PrimaryCTA onClick={addStory} disabled={busy} loading={busy}>
              Add a story
            </PrimaryCTA>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-ui text-card-title font-semibold">
                  {story.title.trim() || `Story ${index + 1}`}
                </h2>
                <div className="flex items-center gap-2">
                  {savingId === story.id && (
                    <span className="font-mono text-annotation text-content-faint">
                      Saving…
                    </span>
                  )}
                  <SecondaryCTA
                    variant="quiet"
                    onClick={() => deleteStory(story.id)}
                  >
                    Delete
                  </SecondaryCTA>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="font-ui text-body-sm font-semibold">
                  Name this story
                </p>
                <input
                  className={inputClass}
                  placeholder="e.g. The Amsterdam stag do"
                  value={story.title}
                  onChange={(e) => updateField(story.id, "title", e.target.value)}
                  onBlur={() => saveStory(story.id)}
                />
              </div>

              {TEXTAREAS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <p className="font-ui text-body-sm font-semibold">
                    {field.label}
                  </p>
                  <FreeTextAnswerField
                    placeholder={field.placeholder}
                    value={story[field.key]}
                    onChange={(e) =>
                      updateField(story.id, field.key, e.target.value)
                    }
                    onBlur={() => saveStory(story.id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {stories.length > 0 && (
          <SecondaryCTA
            variant="outline"
            className="mt-4 w-full"
            onClick={addStory}
            disabled={busy}
          >
            {busy ? "Adding…" : "+ Add another story"}
          </SecondaryCTA>
        )}

        <div className="mt-8 flex items-center justify-between">
          <SecondaryCTA
            variant="quiet"
            onClick={() => router.push(`/project/${projectId}/interview`)}
          >
            ← Back
          </SecondaryCTA>
          <PrimaryCTA onClick={() => router.push(`/project/${projectId}/media`)}>
            Continue →
          </PrimaryCTA>
        </div>

        <p className="mt-4 text-center text-annotation text-content-faint">
          Stories are optional, but a speech with none will be pretty thin.
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

const FIELDS: { key: keyof Omit<Story, "id">; label: string; placeholder: string; input?: boolean }[] = [
  {
    key: "title",
    label: "Name this story",
    placeholder: "e.g. The Amsterdam stag do",
    input: true,
  },
  {
    key: "setup",
    label: "Set the scene",
    placeholder: "Where and when was this, and what was going on?",
  },
  {
    key: "event",
    label: "What happened?",
    placeholder: "Tell it like you'd tell a mate down the pub.",
  },
  {
    key: "payoff",
    label: "The payoff",
    placeholder: "The punchline, or how it all turned out.",
  },
  {
    key: "whatItReveals",
    label: "What it says about him (optional)",
    placeholder: "The warm point underneath the funny bit.",
  },
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
      await fetch(`/api/projects/${projectId}/stories/${id}`, {
        method: "DELETE",
      })
    } catch {
      console.error("Failed to delete story")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">The stories</h1>
          <p className="text-muted-foreground">
            These are the heart of the speech. Add the anecdotes about{" "}
            {groomName} worth telling — the more specific, the funnier and
            warmer the result.
          </p>
        </div>

        {stories.length === 0 && (
          <Card className="mb-4">
            <CardContent className="py-10 text-center space-y-3">
              <p className="text-muted-foreground">
                No stories yet. Add the first one to get started.
              </p>
              <Button onClick={addStory} disabled={busy}>
                {busy ? "Adding..." : "Add a story"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {stories.map((story, index) => (
            <Card key={story.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {story.title.trim() || `Story ${index + 1}`}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {savingId === story.id && (
                      <span className="text-xs text-muted-foreground">
                        Saving...
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteStory(story.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <p className="text-sm font-medium mb-1.5">{field.label}</p>
                    {field.input ? (
                      <Input
                        placeholder={field.placeholder}
                        value={story[field.key]}
                        onChange={(e) =>
                          updateField(story.id, field.key, e.target.value)
                        }
                        onBlur={() => saveStory(story.id)}
                      />
                    ) : (
                      <Textarea
                        placeholder={field.placeholder}
                        value={story[field.key]}
                        onChange={(e) =>
                          updateField(story.id, field.key, e.target.value)
                        }
                        onBlur={() => saveStory(story.id)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {stories.length > 0 && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={addStory}
            disabled={busy}
          >
            {busy ? "Adding..." : "+ Add another story"}
          </Button>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/project/${projectId}/interview`)}
          >
            ← Back
          </Button>
          <Button onClick={() => router.push(`/project/${projectId}/media`)}>
            Continue →
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Stories are optional, but a speech with none will be pretty thin.
        </p>
      </div>
    </div>
  )
}

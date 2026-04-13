"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    if (sample && !saved) {
      await handleSave()
    }
    router.push(`/project/${projectId}/generating`)
  }

  const handleSkip = () => {
    router.push(`/project/${projectId}/generating`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-muted-foreground">
            {groomName}'s speech
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            Save &amp; exit
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 flex-1 rounded-full bg-primary" />
            <div className="h-1.5 w-8 rounded-full bg-primary/60" />
          </div>
          <p className="text-sm text-muted-foreground">Almost there — one optional step left</p>
        </div>

        {/* Main card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sound like yourself</CardTitle>
            <CardDescription>
              Paste a short piece of writing that sounds like you — a WhatsApp message, 
              an email, anything you've written. We'll use it to match your natural voice 
              in the speech.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g. Mate, you absolute legend. Can't believe you actually pulled it off — she said yes! Right, we need to celebrate properly. I'm thinking something low-key but knowing you it'll end up being anything but..."
              value={sample}
              onChange={(e) => {
                setSample(e.target.value)
                setSaved(false)
              }}
              rows={8}
              className="resize-none"
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {sample.length > 0
                  ? `${sample.split(/\s+/).filter(Boolean).length} words — ${
                      sample.split(/\s+/).filter(Boolean).length < 30
                        ? "a bit short, try for 50+"
                        : "good length"
                    }`
                  : "Aim for at least 50 words"}
              </p>
              {sample.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || saved}
                >
                  {saved ? "Saved ✓" : isSaving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Why this helps</p>
              <p>
                Generic AI speeches sound like generic AI speeches. Your writing 
                sample helps us match your rhythm, vocabulary and personality — 
                so the speech actually sounds like it came from you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/project/${projectId}/interview`)}
          >
            ← Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip}>
              Skip this step
            </Button>
            <Button onClick={handleContinue} disabled={isSaving}>
              Generate my speech →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
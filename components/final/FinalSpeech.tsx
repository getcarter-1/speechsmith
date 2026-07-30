"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FinalSpeechProps {
  projectId: string
  groomName: string
  speech: string
}

export default function FinalSpeech({
  projectId,
  groomName,
  speech,
}: FinalSpeechProps) {
  const [copied, setCopied] = useState(false)

  const words = speech.trim() ? speech.trim().split(/\s+/).length : 0
  const minutes = Math.max(1, Math.round(words / 130)) // ~130 words/min spoken

  const slug = groomName.trim().replace(/\s+/g, "-").toLowerCase() || "speech"

  const download = () => {
    const blob = new Blob([speech], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}-best-man-speech.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(speech)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Copy failed")
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
          <a
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </a>
        </div>

        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold">Your speech is ready 🎉</h1>
          <p className="text-muted-foreground">
            About {words} words — roughly {minutes} minute
            {minutes > 1 ? "s" : ""} spoken aloud.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={download}>Download (.txt)</Button>
          <Button variant="outline" onClick={copy}>
            {copied ? "Copied ✓" : "Copy text"}
          </Button>
          <a
            href={`/project/${projectId}/review`}
            className="text-sm text-muted-foreground hover:text-foreground self-center ml-1"
          >
            Back to review
          </a>
        </div>

        {/* Speech */}
        <Card>
          <CardContent className="py-6">
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {speech}
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          PDF and Word downloads are coming soon.
        </p>
      </div>
    </div>
  )
}

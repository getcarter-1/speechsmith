"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { primaryLinkClass, outlineLinkClass } from "@/lib/ui"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"

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
  const minutes = Math.max(1, Math.round(words / 130))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(speech)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Copy failed")
    }
  }

  const exportHref = (format: string) =>
    `/api/projects/${projectId}/export?format=${format}`

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[40rem] px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-ui text-body-sm font-semibold text-content-muted">
            {groomName}&apos;s speech
          </span>
          <a
            href="/dashboard"
            className="font-ui text-body-sm font-semibold text-content-muted no-underline hover:text-content-primary"
          >
            Dashboard
          </a>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <SpeechsmithCharacter
            state="complete"
            size="inline"
            scale={0.5}
            decorative
            className="hidden sm:block"
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-ui text-page-title font-bold">
              Your speech is ready 🎉
            </h1>
            <p className="text-body text-content-muted">
              About {words} words — roughly {minutes} minute
              {minutes > 1 ? "s" : ""} spoken aloud.
            </p>
          </div>
        </div>

        {/* Export bar */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <a href={exportHref("pdf")} className={primaryLinkClass}>
            Download PDF
          </a>
          <a href={exportHref("docx")} className={outlineLinkClass}>
            Word (.docx)
          </a>
          <a href={exportHref("txt")} className={outlineLinkClass}>
            Text (.txt)
          </a>
          <SecondaryCTA variant="quiet" onClick={copy}>
            {copied ? "Copied ✓" : "Copy"}
          </SecondaryCTA>
          <a
            href={`/project/${projectId}/review`}
            className="ml-1 self-center font-ui text-body-sm font-semibold text-content-muted no-underline hover:text-content-primary"
          >
            Back to review
          </a>
        </div>

        {/* Speech — the reading serif, so it looks like a speech, not an app */}
        <div className="rounded-card border border-line bg-surface p-6">
          <p className="whitespace-pre-wrap font-reading text-speech-reader text-content-primary">
            {speech}
          </p>
        </div>
      </div>
    </div>
  )
}

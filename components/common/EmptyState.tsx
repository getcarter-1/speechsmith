import type { ReactNode } from "react"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"

// Spec §21 — explain what goes here and give exactly one way to start.
interface EmptyStateProps {
  heading: string
  explanation: string
  action?: ReactNode
  characterState?: string
  showCharacter?: boolean
}

export function EmptyState({
  heading,
  explanation,
  action,
  characterState = "empty-project",
  showCharacter = true,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-[var(--container-form)] flex-col items-center gap-4 rounded-card border border-line bg-canvas px-4 py-12 text-center">
      {showCharacter && (
        <SpeechsmithCharacter
          state={characterState}
          size="panel"
          scale={0.6}
          decorative
        />
      )}
      <h2 className="font-ui text-section-title font-bold">{heading}</h2>
      <p className="max-w-[48ch] text-body text-content-muted">{explanation}</p>
      {action}
    </div>
  )
}

import { cn } from "@/lib/utils"
import { CharacterPlaceholder } from "./CharacterPlaceholder"

// Nib — the assistant. Artwork isn't generated yet, so this always renders the
// placeholder with the resolved asset id (per the implementation guide's
// placeholder-first contract). Swaps to next/image once asset-manifest is wired.
export type CharacterSize = "avatar" | "avatar-lg" | "inline" | "panel" | "hero"

const SIZE_VAR: Record<CharacterSize, string> = {
  avatar: "--illustration-avatar",
  "avatar-lg": "--illustration-avatar-large",
  inline: "--illustration-inline",
  panel: "--illustration-panel",
  hero: "--illustration-hero",
}

interface SpeechsmithCharacterProps {
  state: string
  size?: CharacterSize
  speechType?: string
  decorative?: boolean
  alt?: string
  className?: string
}

export function SpeechsmithCharacter({
  state,
  size = "panel",
  speechType = "best-man",
  decorative = true,
  alt,
  className,
}: SpeechsmithCharacterProps) {
  const assetId = `character-${speechType}-${state}-v01`
  // Scale by the sensitivity-tier multiplier from tokens.css.
  const width = `calc(var(${SIZE_VAR[size]}) * var(--character-scale))`

  return (
    <div
      className={cn("shrink-0", className)}
      style={{ width }}
      {...(decorative
        ? { "aria-hidden": true, "data-decorative-illustration": "" }
        : { role: "img", "aria-label": alt ?? state })}
    >
      <CharacterPlaceholder assetId={assetId} />
    </div>
  )
}

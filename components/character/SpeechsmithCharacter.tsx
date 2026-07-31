"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CharacterPlaceholder } from "./CharacterPlaceholder"
import {
  resolveCharacterAsset,
  CHARACTER_ASSETS_READY,
} from "@/lib/config/character-assets"

// Nib — the assistant. Manifest-driven: renders the resolved artwork via
// next/image, falling back to the placeholder when assets aren't ready yet or
// an image fails to load (per the implementation guide's contract).
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
  /** Extra multiplier on top of the size token (e.g. 0.75 to trim the panel). */
  scale?: number
  /** next/image priority — only the homepage hero should set this. */
  priority?: boolean
  alt?: string
  className?: string
}

export function SpeechsmithCharacter({
  state,
  size = "panel",
  speechType = "best-man",
  decorative,
  scale = 1,
  priority,
  alt,
  className,
}: SpeechsmithCharacterProps) {
  const [failed, setFailed] = useState(false)
  const asset = resolveCharacterAsset(state, speechType, size)

  // decorative falls back to the manifest's flag, then to true.
  const isDecorative = decorative ?? asset?.decorative ?? true
  const showImage = CHARACTER_ASSETS_READY && asset !== null && !failed

  // Size token × sensitivity-tier multiplier (tokens.css) × local scale.
  const width = `calc(var(${SIZE_VAR[size]}) * var(--character-scale) * ${scale})`

  return (
    <div
      className={cn("shrink-0", className)}
      style={{ width }}
      {...(isDecorative
        ? { "aria-hidden": true, "data-decorative-illustration": "" }
        : {})}
    >
      {showImage && asset ? (
        <Image
          src={`/assets/character/best-man/${asset.filename}`}
          width={asset.width}
          height={asset.height}
          alt={isDecorative ? "" : alt ?? asset.altText ?? state}
          priority={priority}
          onError={() => setFailed(true)}
          className="h-auto w-full"
        />
      ) : (
        <CharacterPlaceholder assetId={`character-${speechType}-${state}-v01`} />
      )}
    </div>
  )
}

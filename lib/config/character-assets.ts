import manifest from "./asset-manifest.json"

// Flip to true once the Nib artwork exists in public/assets/character/best-man/.
// While false, <SpeechsmithCharacter> always renders the placeholder (no 404s).
// Individual missing files still fall back to the placeholder via onError.
export const CHARACTER_ASSETS_READY = false

export interface CharacterAsset {
  id: string
  filename: string
  speechType: string
  characterState: string
  width: number
  height: number
  decorative: boolean
  altText: string
  suitableCrops: string[]
  animationReady: boolean
}

const assets = manifest.assets as unknown as CharacterAsset[]

type Crop = "circular-avatar" | "desktop-hero" | "square"

const sizeToCrop: Record<string, Crop> = {
  avatar: "circular-avatar",
  "avatar-lg": "circular-avatar",
  hero: "desktop-hero",
  inline: "square",
  panel: "square",
}

// Resolve the best asset for a state + speech type + render size. Prefers the
// exact speech type, falls back to the best-man set, then to the closest crop.
// Never constructs a filename — always returns a manifest entry (or null).
export function resolveCharacterAsset(
  state: string,
  speechType: string,
  size: string
): CharacterAsset | null {
  const exact = assets.filter(
    (a) => a.characterState === state && a.speechType === speechType
  )
  const pool = exact.length
    ? exact
    : assets.filter(
        (a) => a.characterState === state && a.speechType === "best-man"
      )
  if (pool.length === 0) return null

  const crop = sizeToCrop[size] ?? "square"
  return (
    pool.find((a) => a.suitableCrops.includes(crop)) ??
    pool.find((a) => a.suitableCrops.includes("square")) ??
    pool[0]
  )
}

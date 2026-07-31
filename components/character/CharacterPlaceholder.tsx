import { cn } from "@/lib/utils"

// Renders the resolved asset id in a keyed stripe box until real artwork exists,
// so layout work proceeds in parallel with illustration (never a broken image).
export function CharacterPlaceholder({
  assetId,
  className,
}: {
  assetId: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid aspect-square w-full place-items-center rounded-avatar border border-line p-3",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--colour-character-placeholder-stripe-a) 0 5px, var(--colour-character-placeholder-stripe-b) 5px 10px)",
      }}
    >
      <span className="text-center font-mono text-annotation uppercase leading-relaxed text-character-placeholder-text">
        {assetId}
      </span>
    </div>
  )
}

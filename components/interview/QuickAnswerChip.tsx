import { cn } from "@/lib/utils"

// Spec §7 — selection is never colour-only; selected chips carry a check + aria-selected.
interface QuickAnswerChipProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function QuickAnswerChip({ label, selected, onToggle }: QuickAnswerChipProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-control border px-3 py-2 font-mono text-annotation",
        "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)]",
        selected
          ? "border-line-accent bg-accent-subtle text-content-primary"
          : "border-line bg-canvas text-content-primary hover:border-line-strong"
      )}
    >
      {selected && (
        <span aria-hidden className="text-occasion">
          ✓
        </span>
      )}
      {label}
    </button>
  )
}

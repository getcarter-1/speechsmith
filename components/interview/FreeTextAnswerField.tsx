import { cn } from "@/lib/utils"
import type { TextareaHTMLAttributes } from "react"

// Spec §8 — low-stakes free text. 16px min font (prevents iOS zoom), sunken fill.
interface FreeTextAnswerFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  long?: boolean
}

export function FreeTextAnswerField({
  className,
  long,
  rows,
  ...props
}: FreeTextAnswerFieldProps) {
  return (
    <textarea
      rows={rows ?? (long ? 6 : 3)}
      className={cn(
        "w-full resize-none rounded-control border border-line-strong bg-surface-sunken px-3 py-3",
        "font-ui text-body text-content-primary placeholder:text-content-faint",
        "outline-none transition-colors duration-[var(--motion-duration-fast)]",
        "focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]",
        className
      )}
      {...props}
    />
  )
}

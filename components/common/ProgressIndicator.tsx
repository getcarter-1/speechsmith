import { cn } from "@/lib/utils"

// Spec §9 — determinate only; the counter text is required, the bar alone is insufficient.
interface ProgressIndicatorProps {
  value: number
  max: number
  /** e.g. "Q06 / 18" — required, shown above the bar. */
  counter: string
  valueText?: string
  className?: string
}

export function ProgressIndicator({
  value,
  max,
  counter,
  valueText,
  className,
}: ProgressIndicatorProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-mono text-label uppercase text-content-muted">
        {counter}
      </span>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={valueText ?? counter}
        className="h-0.5 overflow-hidden rounded-pill bg-surface-sunken"
      >
        <div
          className="h-full rounded-pill bg-occasion transition-[width] duration-[var(--motion-duration-slow)] ease-[var(--motion-easing-standard)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

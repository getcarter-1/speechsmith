import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

// Spec §3 — the single most important action on a screen. Real <button>, never a div.
interface PrimaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function PrimaryCTA({
  className,
  loading,
  disabled,
  children,
  type = "button",
  ...props
}: PrimaryCTAProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-3",
        "font-ui text-button font-semibold text-content-on-accent bg-accent",
        "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)]",
        "hover:bg-accent-strong active:translate-y-px",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {loading ? "Working…" : children}
    </button>
  )
}

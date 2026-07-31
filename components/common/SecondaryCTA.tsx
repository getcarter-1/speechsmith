import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

// Spec §4 — the non-committal alternative ("Read an example", "Skip").
interface SecondaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "quiet"
}

export function SecondaryCTA({
  className,
  variant = "outline",
  type = "button",
  children,
  ...props
}: SecondaryCTAProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-control font-ui text-button font-semibold",
        "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)]",
        "hover:bg-accent-subtle disabled:cursor-not-allowed disabled:opacity-60",
        variant === "outline"
          ? "border border-line-ink px-5 py-3 text-content-primary"
          : "px-3 py-3 text-content-muted hover:text-content-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

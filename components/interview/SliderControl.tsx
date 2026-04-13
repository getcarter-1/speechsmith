"use client"

import { cn } from "@/lib/utils"

interface SliderControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export default function SliderControl({
  value,
  onChange,
  min = 1,
  max = 5,
  minLabel,
  maxLabel,
}: SliderControlProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className={cn(
              "flex-1 h-10 rounded-lg border text-sm font-medium transition-colors",
              value === step
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            )}
          >
            {step}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  )
}
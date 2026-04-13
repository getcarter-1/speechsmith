"use client"

import { cn } from "@/lib/utils"
import { QuestionOption } from "@/lib/config/interview-questions"

interface QuickSelectChipsProps {
  options: QuestionOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
}

export default function QuickSelectChips({
  options,
  value,
  onChange,
  multiple = false,
}: QuickSelectChipsProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : []

  const handleClick = (optionValue: string) => {
    if (multiple) {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((v) => v !== optionValue))
      } else {
        onChange([...selectedValues, optionValue])
      }
    } else {
      onChange(optionValue === selectedValues[0] ? "" : optionValue)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleClick(option.value)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
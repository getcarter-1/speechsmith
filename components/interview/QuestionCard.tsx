"use client"

import { Question } from "@/lib/config/interview-questions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import QuickSelectChips from "./QuickSelectChips"
import SliderControl from "./SliderControl"

interface QuestionCardProps {
  question: Question
  value: string | string[] | number
  onChange: (value: string | string[] | number) => void
}

export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base font-semibold leading-snug">
          {question.question}
          {question.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
        {question.helperText && (
          <p className="text-sm text-muted-foreground">{question.helperText}</p>
        )}
      </div>

      {question.type === "text" && (
        <Input
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "textarea" && (
        <Textarea
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
      )}

      {question.type === "chips" && question.options && (
        <QuickSelectChips
          options={question.options}
          value={(value as string | string[]) ?? ""}
          onChange={(v) => onChange(v)}
          multiple={
            question.id === "speaker_humour_style"
          }
        />
      )}

      {question.type === "radio" && question.options && (
        <QuickSelectChips
          options={question.options}
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v as string)}
          multiple={false}
        />
      )}

      {question.type === "slider" && (
        <SliderControl
          value={(value as number) ?? question.min ?? 1}
          onChange={(v) => onChange(v)}
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
        />
      )}

      {question.example && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-3">
          {question.example}
        </p>
      )}
    </div>
  )
}
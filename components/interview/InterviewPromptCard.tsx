import { cn } from "@/lib/utils"
import { Question } from "@/lib/config/interview-questions"
import { ProgressIndicator } from "@/components/common/ProgressIndicator"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"
import { QuickAnswerChip } from "./QuickAnswerChip"
import { FreeTextAnswerField } from "./FreeTextAnswerField"

// Spec §6 — the most-used surface. Asks one question. The question is interface
// (UI font), never the reading serif.
type AnswerValue = string | string[] | number

interface InterviewPromptCardProps {
  question: Question
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  counter: string
  progressValue: number
  progressMax: number
}

export function InterviewPromptCard({
  question,
  value,
  onChange,
  counter,
  progressValue,
  progressMax,
}: InterviewPromptCardProps) {
  const isMultiple = question.id === "speaker_humour_style"
  const selected = Array.isArray(value)
    ? value
    : value !== "" && value != null
      ? [String(value)]
      : []

  const toggleChip = (v: string) => {
    if (isMultiple) {
      onChange(
        selected.includes(v)
          ? selected.filter((s) => s !== v)
          : [...selected, v]
      )
    } else {
      onChange(v === selected[0] ? "" : v)
    }
  }

  const steps = Array.from(
    { length: (question.max ?? 5) - (question.min ?? 1) + 1 },
    (_, i) => (question.min ?? 1) + i
  )

  return (
    <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
      {/* progress header */}
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <SpeechsmithCharacter
          state="listening"
          size="avatar"
          className="lg:hidden"
        />
        <ProgressIndicator
          value={progressValue}
          max={progressMax}
          counter={counter}
          className="flex-1"
        />
      </div>

      {/* question — interface, not speech */}
      <h2 className="text-balance font-ui text-section-title font-bold text-content-primary">
        {question.question}
        {question.required && <span className="text-occasion"> *</span>}
      </h2>
      {question.helperText && (
        <p className="text-helper text-content-muted">{question.helperText}</p>
      )}

      {/* answer */}
      {question.type === "text" && (
        <input
          type="text"
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-11 w-full rounded-control border border-line-strong bg-surface-sunken px-3 font-ui text-body text-content-primary outline-none placeholder:text-content-faint focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]"
        />
      )}

      {question.type === "textarea" && (
        <FreeTextAnswerField
          long
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {(question.type === "chips" || question.type === "radio") &&
        question.options && (
          <div
            role="listbox"
            aria-label={question.question}
            className="flex flex-wrap gap-2"
          >
            {question.options.map((opt) => (
              <QuickAnswerChip
                key={opt.value}
                label={opt.label}
                selected={selected.includes(opt.value)}
                onToggle={() => toggleChip(opt.value)}
              />
            ))}
          </div>
        )}

      {question.type === "slider" && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {steps.map((step) => {
              const active = Number(value) === step
              return (
                <button
                  key={step}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange(step)}
                  className={cn(
                    "min-h-11 flex-1 rounded-control border font-ui text-body-sm font-semibold transition-colors duration-[var(--motion-duration-fast)]",
                    active
                      ? "border-line-accent bg-accent-subtle text-content-primary"
                      : "border-line bg-canvas text-content-secondary hover:border-line-strong"
                  )}
                >
                  {step}
                </button>
              )
            })}
          </div>
          {(question.minLabel || question.maxLabel) && (
            <div className="flex justify-between text-annotation text-content-faint">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
          )}
        </div>
      )}

      {question.example && (
        <p className="border-l-2 border-line pl-3 text-body-sm text-content-muted italic">
          {question.example}
        </p>
      )}
    </section>
  )
}

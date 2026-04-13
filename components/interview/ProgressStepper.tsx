import { INTERVIEW_STAGES, InterviewStage } from "@/lib/config/interview-questions"
import { cn } from "@/lib/utils"

interface ProgressStepperProps {
  currentStage: InterviewStage
}

export default function ProgressStepper({ currentStage }: ProgressStepperProps) {
  const currentIndex = INTERVIEW_STAGES.findIndex((s) => s.id === currentStage)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {INTERVIEW_STAGES[currentIndex]?.label}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {INTERVIEW_STAGES.length}
        </span>
      </div>
      <div className="flex gap-1">
        {INTERVIEW_STAGES.map((stage, index) => (
          <div
            key={stage.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              index < currentIndex
                ? "bg-primary"
                : index === currentIndex
                ? "bg-primary/60"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {INTERVIEW_STAGES[currentIndex]?.description}
      </p>
    </div>
  )
}
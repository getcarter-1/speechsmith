"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  INTERVIEW_STAGES,
  INTERVIEW_QUESTIONS,
  InterviewStage,
  getQuestionsByStage,
  getNextStage,
  getPreviousStage,
} from "@/lib/config/interview-questions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProgressStepper from "./ProgressStepper"
import QuestionCard from "./QuestionCard"

interface InterviewWizardProps {
  projectId: string
  groomName: string
  initialStage?: InterviewStage
  initialAnswers?: Record<string, string | string[] | number>
}

export default function InterviewWizard({
  projectId,
  groomName,
  initialStage = "speaker",
  initialAnswers = {},
}: InterviewWizardProps) {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState<InterviewStage>(initialStage)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>(initialAnswers)
  const [isSaving, setIsSaving] = useState(false)

  const stageQuestions = getQuestionsByStage(currentStage)
  const currentQuestion = stageQuestions[questionIndex]
  const isLastQuestionInStage = questionIndex === stageQuestions.length - 1
  const isLastStage = currentStage === INTERVIEW_STAGES[INTERVIEW_STAGES.length - 1].id
  const currentValue = answers[currentQuestion?.id] ?? ""

  const saveAnswer = useCallback(async (questionId: string, value: string | string[] | number) => {
    setIsSaving(true)
    try {
      await fetch(`/api/projects/${projectId}/interview`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, value }),
      })
    } catch {
      console.error("Autosave failed")
    } finally {
      setIsSaving(false)
    }
  }, [projectId])

  const handleChange = (value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = async () => {
    const value = answers[currentQuestion.id]
    if (value !== undefined && value !== "" && value !== 0) {
      await saveAnswer(currentQuestion.id, value)
    }

    if (isLastQuestionInStage) {
      const nextStage = getNextStage(currentStage)
      if (nextStage) {
        setCurrentStage(nextStage)
        setQuestionIndex(0)
      } else {
        router.push(`/project/${projectId}/sample`)
      }
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1)
    } else {
      const prevStage = getPreviousStage(currentStage)
      if (prevStage) {
        const prevStageQuestions = getQuestionsByStage(prevStage)
        setCurrentStage(prevStage)
        setQuestionIndex(prevStageQuestions.length - 1)
      } else {
        router.push(`/project/${projectId}/setup`)
      }
    }
  }

  const handleSkip = () => {
    if (isLastQuestionInStage) {
      const nextStage = getNextStage(currentStage)
      if (nextStage) {
        setCurrentStage(nextStage)
        setQuestionIndex(0)
      } else {
        router.push(`/project/${projectId}/media`)
      }
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }

  const canProceed = () => {
    if (!currentQuestion.required) return true
    const value = answers[currentQuestion.id]
    if (value === undefined || value === "" || value === 0) return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-muted-foreground">
              {groomName}'s speech
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              Save &amp; exit
            </Button>
          </div>
          <ProgressStepper currentStage={currentStage} />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="pt-6 pb-6">
            <QuestionCard
              question={currentQuestion}
              value={currentValue}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
          >
            ← Back
          </Button>

          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
            {currentQuestion.skippable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
              >
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {isLastQuestionInStage && isLastStage
                ? "Finish interview"
                : isLastQuestionInStage
                ? "Next section →"
                : "Next →"}
            </Button>
          </div>
        </div>

        {/* Question counter */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Question {questionIndex + 1} of {stageQuestions.length} in this section
        </p>
      </div>
    </div>
  )
}
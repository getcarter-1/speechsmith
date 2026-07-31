"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  INTERVIEW_STAGES,
  InterviewStage,
  getQuestionsByStage,
  getStageIndex,
  getNextStage,
  getPreviousStage,
} from "@/lib/config/interview-questions"
import { InterviewPromptCard } from "./InterviewPromptCard"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"

interface InterviewWizardProps {
  projectId: string
  groomName: string
  initialStage?: InterviewStage
  initialQuestionIndex?: number
  initialAnswers?: Record<string, string | string[] | number>
}

export default function InterviewWizard({
  projectId,
  groomName,
  initialStage = "speaker",
  initialQuestionIndex = 0,
  initialAnswers = {},
}: InterviewWizardProps) {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState<InterviewStage>(initialStage)
  const [questionIndex, setQuestionIndex] = useState(initialQuestionIndex)
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>(initialAnswers)
  const [isSaving, setIsSaving] = useState(false)

  const stageQuestions = getQuestionsByStage(currentStage)
  const currentQuestion = stageQuestions[questionIndex]
  const isLastQuestionInStage = questionIndex === stageQuestions.length - 1
  const isLastStage = currentStage === INTERVIEW_STAGES[INTERVIEW_STAGES.length - 1].id
  const currentValue = answers[currentQuestion?.id] ?? ""

  // Per-section counter — friendlier than "1 of 39".
  const stageMeta = INTERVIEW_STAGES[getStageIndex(currentStage)]
  const sectionPos = questionIndex + 1
  const sectionTotal = stageQuestions.length

  const saveAnswer = useCallback(
    async (questionId: string, value: string | string[] | number) => {
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
    },
    [projectId]
  )

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
        router.push(`/project/${projectId}/stories`)
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
        router.push(`/project/${projectId}/stories`)
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

  const counter = `${stageMeta.label} · ${sectionPos} of ${sectionTotal}`

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[var(--container-app)] px-4 py-8">
        {/* header */}
        <div className="mb-8 flex items-center justify-between">
          <span className="font-ui text-body-sm font-semibold text-content-muted">
            {groomName}&apos;s speech
          </span>
          <SecondaryCTA variant="quiet" onClick={() => router.push("/dashboard")}>
            Save &amp; exit
          </SecondaryCTA>
        </div>

        <div className="flex justify-center gap-8">
          {/* desktop character rail */}
          <aside className="hidden shrink-0 lg:block lg:w-[13.5rem]">
            <SpeechsmithCharacter state="listening" size="panel" scale={0.75} />
          </aside>

          {/* form column */}
          <div className="w-full max-w-[40rem]">
            <InterviewPromptCard
              question={currentQuestion}
              value={currentValue}
              onChange={handleChange}
              counter={counter}
              progressValue={sectionPos}
              progressMax={sectionTotal}
            />

            {/* navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <SecondaryCTA variant="quiet" onClick={handleBack}>
                ← Back
              </SecondaryCTA>
              <div className="flex items-center gap-3">
                {isSaving && (
                  <span className="font-mono text-annotation text-content-faint">
                    Saving…
                  </span>
                )}
                {currentQuestion.skippable && (
                  <SecondaryCTA variant="quiet" onClick={handleSkip}>
                    Skip
                  </SecondaryCTA>
                )}
                <PrimaryCTA onClick={handleNext} disabled={!canProceed()}>
                  {isLastQuestionInStage && isLastStage
                    ? "Finish interview"
                    : "Next"}
                </PrimaryCTA>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

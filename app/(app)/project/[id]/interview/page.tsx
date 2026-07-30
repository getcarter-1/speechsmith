import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import InterviewWizard from "@/components/interview/InterviewWizard"
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_STAGES,
  getQuestionsByStage,
  coerceAnswerForWizard,
  InterviewStage,
} from "@/lib/config/interview-questions"

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  // Reload previously saved answers so the wizard resumes rather than restarts.
  const records: Record<string, Record<string, unknown> | null> = {
    SpeakerProfile: project.speakerProfile as Record<string, unknown> | null,
    SpeechBrief: project.speechBrief as Record<string, unknown> | null,
    EventContext: project.eventContext as Record<string, unknown> | null,
    AudienceProfile: project.audienceProfile as Record<string, unknown> | null,
    CoupleProfile: project.coupleProfile as Record<string, unknown> | null,
    GroomProfile: project.groomProfile as Record<string, unknown> | null,
    PartnerProfile: project.partnerProfile as Record<string, unknown> | null,
    RedLines: project.redLines as Record<string, unknown> | null,
  }

  const initialAnswers: Record<string, string | string[] | number> = {}
  for (const q of INTERVIEW_QUESTIONS) {
    const rec = records[q.dbModel]
    if (!rec) continue
    const raw = rec[q.dbField]
    if (raw === null || raw === undefined) continue
    initialAnswers[q.id] = coerceAnswerForWizard(q, raw)
  }

  // Resume at the first unanswered required question; if every required
  // question is done, drop them on the final stage so they can carry on.
  let initialStage: InterviewStage = INTERVIEW_STAGES[0].id
  let initialQuestionIndex = 0
  let found = false
  for (const stage of INTERVIEW_STAGES) {
    const questions = getQuestionsByStage(stage.id)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.required) continue
      const v = initialAnswers[q.id]
      const empty =
        v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
      if (empty) {
        initialStage = stage.id
        initialQuestionIndex = i
        found = true
        break
      }
    }
    if (found) break
  }
  if (!found) {
    initialStage = INTERVIEW_STAGES[INTERVIEW_STAGES.length - 1].id
    initialQuestionIndex = 0
  }

  return (
    <InterviewWizard
      projectId={project.id}
      groomName={project.groomName}
      initialStage={initialStage}
      initialQuestionIndex={initialQuestionIndex}
      initialAnswers={initialAnswers}
    />
  )
}

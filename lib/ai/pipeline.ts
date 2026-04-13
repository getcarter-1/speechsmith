import { parseIntake } from "./modules/01-intake-parser"
import { detectGaps } from "./modules/02-gap-detector"
import { scoreStories } from "./modules/04-story-scorer"
import { evaluateAudienceSafety } from "./modules/05-audience-safety-evaluator"
import { planSpeech } from "./modules/06-speech-planner"
import { writeDraft } from "./modules/07-draft-writer"
import { validateSafety } from "./modules/08-safety-validator"
import { evaluateCliches } from "./modules/09-cliche-evaluator"
import { humaniseSpeech } from "./modules/10-humaniser"
import { segmentSpeech } from "./modules/11-section-segmenter"
import { runQA } from "./modules/14-qa-evaluator"

export interface PipelineInput {
  project: Record<string, unknown>
  speakerProfile: Record<string, unknown> | null
  speechBrief: Record<string, unknown> | null
  eventContext: Record<string, unknown> | null
  audienceProfile: Record<string, unknown> | null
  coupleProfile: Record<string, unknown> | null
  groomProfile: Record<string, unknown> | null
  partnerProfile: Record<string, unknown> | null
  redLines: Record<string, unknown> | null
  stories: Record<string, unknown>[]
  mediaAssets: Record<string, unknown>[]
}

export interface PipelineResult {
  success: boolean
  fullText: string
  segments: {
    sectionType: string
    title: string
    content: string
    orderIndex: number
  }[]
  qaScore: number
  error?: string
  progressLog: string[]
}

export type ProgressCallback = (stage: string, percent: number) => void

export async function runPipeline(
  input: PipelineInput,
  onProgress?: ProgressCallback
): Promise<PipelineResult> {
  const log: string[] = []
  const progress = (stage: string, percent: number) => {
    log.push(`[${percent}%] ${stage}`)
    onProgress?.(stage, percent)
  }

  try {
    // Stage 1 — Normalise inputs
    progress("Parsing your answers...", 5)
    const rawData = {
      ...input.project,
      ...input.speakerProfile,
      ...input.speechBrief,
      ...input.eventContext,
      ...input.audienceProfile,
      ...input.coupleProfile,
      ...input.groomProfile,
      ...input.partnerProfile,
      ...input.redLines,
    }
    const parsed = await parseIntake(rawData)

    // Stage 2 — Gap analysis
    progress("Checking for missing information...", 15)
    const gaps = await detectGaps(parsed)
    if (!gaps.canGenerate) {
      return {
        success: false,
        fullText: "",
        segments: [],
        qaScore: 0,
        error: `Not enough information to generate. Missing: ${gaps.missingCritical.join(", ")}`,
        progressLog: log,
      }
    }

    // Stage 4 — Score stories
    progress("Scoring your stories...", 25)
    const storyScores = await scoreStories(parsed, input.stories)

    // Stage 5 — Audience safety
    progress("Calibrating for your audience...", 35)
    const safetyEval = await evaluateAudienceSafety(parsed)

    // Stage 6 — Speech plan
    progress("Planning the speech structure...", 45)
    const plan = await planSpeech(parsed, storyScores, safetyEval)

    // Stage 7 — Write first draft
    progress("Writing your first draft...", 55)
    let draft = await writeDraft(parsed, plan)

    // Stage 8 — Safety validation
    progress("Running safety checks...", 65)
    const safetyCheck = await validateSafety(draft, parsed)
    if (!safetyCheck.passed && safetyCheck.hardBanViolations.length > 0) {
      progress("Fixing safety issues...", 68)
      draft = draft
    }

    // Stage 9 — Cliché evaluation
    progress("Removing generic phrases...", 72)
    const clicheEval = await evaluateCliches(draft)

    // Stage 10 — Humanisation
    progress("Making it sound like you...", 80)
    const humanised = await humaniseSpeech(draft, parsed, clicheEval)

    // Stage 11 — Section segmentation
    progress("Splitting into sections...", 90)
    const segmentation = await segmentSpeech(humanised)

    // Stage 14 — QA
    progress("Running quality checks...", 95)
    const qa = await runQA(humanised, parsed)

    progress("Done!", 100)

    return {
      success: true,
      fullText: humanised,
      segments: segmentation.segments,
      qaScore: qa.overallScore,
      progressLog: log,
    }
  } catch (error) {
    return {
      success: false,
      fullText: "",
      segments: [],
      qaScore: 0,
      error: error instanceof Error ? error.message : "Pipeline failed",
      progressLog: log,
    }
  }
}
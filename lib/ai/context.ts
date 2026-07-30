import { parseIntake, ParsedInput } from "./modules/01-intake-parser"

// The parsed intake isn't persisted after generation, so rewrite/finalize
// re-derive it from the saved profiles (same merge the pipeline does at
// stage 1). One fast-model call.
export interface ProjectContext {
  groomName: string
  partnerName: string
  weddingDate: Date | null
  speakerProfile: Record<string, unknown> | null
  speechBrief: Record<string, unknown> | null
  eventContext: Record<string, unknown> | null
  audienceProfile: Record<string, unknown> | null
  coupleProfile: Record<string, unknown> | null
  groomProfile: Record<string, unknown> | null
  partnerProfile: Record<string, unknown> | null
  redLines: Record<string, unknown> | null
}

export async function parsedFromProject(
  project: ProjectContext
): Promise<ParsedInput> {
  const raw: Record<string, unknown> = {
    groomName: project.groomName,
    partnerName: project.partnerName,
    weddingDate: project.weddingDate,
    ...(project.speakerProfile ?? {}),
    ...(project.speechBrief ?? {}),
    ...(project.eventContext ?? {}),
    ...(project.audienceProfile ?? {}),
    ...(project.coupleProfile ?? {}),
    ...(project.groomProfile ?? {}),
    ...(project.partnerProfile ?? {}),
    ...(project.redLines ?? {}),
  }

  return parseIntake(raw)
}

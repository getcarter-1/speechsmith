import { callAIJSON } from "@/lib/ai/openai"
import { ParsedInput } from "./01-intake-parser"

export interface GapAnalysis {
  hasMinimumData: boolean
  missingCritical: string[]
  missingRecommended: string[]
  weakAreas: string[]
  followUpQuestions: string[]
  canGenerate: boolean
}

export async function detectGaps(parsed: ParsedInput): Promise<GapAnalysis> {
  const systemPrompt = `
You are a speechwriting assistant checking whether enough information has been 
provided to write a high quality best man speech. Be practical — speeches can 
be written with partial information, but certain things are essential.
`.trim()

  const userPrompt = `
Analyse this intake data and identify gaps that would prevent writing a strong speech.

Data:
${JSON.stringify(parsed, null, 2)}

Critical fields (speech CANNOT be generated without these):
- groomName
- partnerName  
- speakerRelation
- howTheyMet (or at least one story)
- groomBestQualities
- humourMode
- audienceSize
- targetLengthMins

Recommended fields (speech will be weaker without these):
- groomFunniestTraits
- groomLovelyTrait
- whatMakesThemWork
- groomChangedBy
- partnerCompliment

Return JSON:
{
  "hasMinimumData": boolean,
  "missingCritical": ["field names missing"],
  "missingRecommended": ["field names missing"],
  "weakAreas": ["areas where data is too vague"],
  "followUpQuestions": ["up to 3 specific follow-up questions to ask the user"],
  "canGenerate": boolean
}
`.trim()

  return callAIJSON<GapAnalysis>(systemPrompt, userPrompt, "fast")
}
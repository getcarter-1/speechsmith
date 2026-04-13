import { callAIJSON } from "@/lib/ai/openai"
import { ParsedInput } from "./01-intake-parser"

export interface SafetyEvaluation {
  overallRiskLevel: "low" | "medium" | "high"
  audienceFlags: string[]
  recommendedTone: string
  avoidList: string[]
  safeHumourTypes: string[]
  warningNotes: string[]
}

export async function evaluateAudienceSafety(
  parsed: ParsedInput
): Promise<SafetyEvaluation> {
  const systemPrompt = `
You are a wedding speech consultant assessing audience risk for a British best man speech.
Your job is to identify what could go wrong with this specific audience and set guardrails.
Be practical — most wedding audiences can handle normal best man speech content.
`.trim()

  const userPrompt = `
Assess the audience safety profile for this best man speech.

Audience data:
- Size: ${parsed.audienceSize}
- Children present: ${parsed.childrenPresent}
- Elderly relatives present: ${parsed.elderlyPresent}
- Conservatism level: ${parsed.conservatismLevel}/5
- Humour mode: ${parsed.humourMode}
- Who must laugh: ${parsed.whoMustLaugh || "not specified"}
- Who must not be offended: ${parsed.whoMustNotBeOffended || "not specified"}

Permissions:
- Swearing: ${parsed.swearingAllowed}
- Innuendo: ${parsed.innuendoAllowed}
- Sexual jokes: ${parsed.sexualJokesOptIn}
- Stag do references: ${parsed.stagDoOptIn}

Return JSON:
{
  "overallRiskLevel": "low|medium|high",
  "audienceFlags": ["specific risks to watch for"],
  "recommendedTone": "description of ideal tone for this room",
  "avoidList": ["specific things to avoid for this audience"],
  "safeHumourTypes": ["types of humour that will land well"],
  "warningNotes": ["any specific warnings for generation"]
}
`.trim()

  return callAIJSON<SafetyEvaluation>(systemPrompt, userPrompt, "fast")
}
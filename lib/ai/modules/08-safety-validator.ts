import { callAIJSON } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"
import { ParsedInput } from "./01-intake-parser"

export interface SafetyValidationResult {
  passed: boolean
  hardBanViolations: string[]
  optInViolations: string[]
  audienceViolations: string[]
  topicViolations: string[]
  fixInstructions: string[]
}

export async function validateSafety(
  draft: string,
  parsed: ParsedInput
): Promise<SafetyValidationResult> {
  const systemPrompt = buildSharedSystemPrompt()

  const userPrompt = `
Review this best man speech draft for safety violations.

HARD BANS (must never appear):
- Infidelity or cheating jokes
- Body/appearance jokes
- Religion jokes
- Dead relative humour

OPT-IN STATUS:
- Sexual jokes: ${parsed.sexualJokesOptIn ? "ALLOWED" : "NOT ALLOWED"}
- Stag do references: ${parsed.stagDoOptIn ? "ALLOWED" : "NOT ALLOWED"}
- Ex references: ${parsed.exReferencesOptIn ? "ALLOWED" : "NOT ALLOWED"}
- Swearing: ${parsed.swearingAllowed ? "ALLOWED" : "NOT ALLOWED"}
- Innuendo: ${parsed.innuendoAllowed ? "ALLOWED" : "NOT ALLOWED"}

TOPICS TO AVOID: ${parsed.topicsToAvoid.join(", ") || "none"}

Children present: ${parsed.childrenPresent}
Conservatism level: ${parsed.conservatismLevel}/5

DRAFT TO REVIEW:
${draft}

Return JSON:
{
  "passed": boolean,
  "hardBanViolations": ["quote any hard ban violations found"],
  "optInViolations": ["quote any opt-in violations found"],
  "audienceViolations": ["quote any audience-inappropriate content"],
  "topicViolations": ["quote any avoided topic violations"],
  "fixInstructions": ["specific instructions to fix each violation"]
}
`.trim()

  return callAIJSON<SafetyValidationResult>(systemPrompt, userPrompt, "fast")
}
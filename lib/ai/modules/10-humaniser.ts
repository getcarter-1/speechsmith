import { callAI } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"
import { ParsedInput } from "./01-intake-parser"
import { ClicheEvaluation } from "./09-cliche-evaluator"

export async function humaniseSpeech(
  draft: string,
  parsed: ParsedInput,
  clicheEval: ClicheEvaluation
): Promise<string> {
  const systemPrompt = buildSharedSystemPrompt(
    {
      sexualJokesOptIn: parsed.sexualJokesOptIn,
      stagDoOptIn: parsed.stagDoOptIn,
      exReferencesOptIn: parsed.exReferencesOptIn,
      swearingAllowed: parsed.swearingAllowed,
      innuendoAllowed: parsed.innuendoAllowed,
      drugReferencesAllowed: false,
    },
    parsed.humourMode
  )

  const userPrompt = `
Rewrite this best man speech to sound more natural, human and spoken.

SPEAKER VOICE:
- Humour style: ${parsed.humourStyle.join(", ")}
- Speaking confidence: ${parsed.speakingConfidence}/5
- Delivery method: ${parsed.deliveryMethod}
${parsed.writingSample ? `\nWRITING SAMPLE TO MATCH:\n${parsed.writingSample}` : ""}

PROBLEMS TO FIX:
- Generic phrases to remove: ${clicheEval.genericPhrases.join(", ") || "none identified"}
- AI slop markers to remove: ${clicheEval.aiSlopMarkers.join(", ") || "none identified"}
- Weak sections to strengthen: ${clicheEval.weakSections.join(", ") || "none identified"}
- Improvement notes: ${clicheEval.improvementNotes.join("; ") || "none"}

HUMANISATION TASKS:
1. Vary sentence length — mix short punchy sentences with longer ones
2. Improve spoken cadence — this will be read aloud
3. Remove repetitive intensifiers
4. Reduce templated transitions
5. Don't overexplain punchlines — let them breathe
6. Preserve all specific story details — do not invent new ones
7. Keep the speaker's natural voice
8. Maintain all factual details exactly

DRAFT TO REWRITE:
${draft}

Return only the rewritten speech text. No headers, no commentary, no formatting.
`.trim()

  return callAI(systemPrompt, userPrompt, "quality", 0.75)
}
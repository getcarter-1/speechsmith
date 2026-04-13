import { callAIJSON } from "@/lib/ai/openai"
import { ParsedInput } from "./01-intake-parser"

export interface QAResult {
  overallScore: number
  passesQA: boolean
  humourQuality: number
  warmthQuality: number
  specificity: number
  spokenReadability: number
  britishness: number
  humanLikeness: number
  issues: string[]
  strengths: string[]
  recommendation: "approve" | "flag" | "regenerate"
}

export async function runQA(
  speech: string,
  parsed: ParsedInput
): Promise<QAResult> {
  const systemPrompt = `
You are a senior speechwriting editor doing final quality control on a 
British best man speech. Be honest — flag real problems, praise real strengths.
`.trim()

  const userPrompt = `
Run quality control on this best man speech.

Context:
- Groom: ${parsed.groomName}
- Partner: ${parsed.partnerName}
- Target length: ${parsed.targetLengthMins} minutes
- Tone: ${parsed.tonePrimary}
- Humour level: ${parsed.humourLevel}/5
- Audience: ${parsed.audienceSize} people, conservatism ${parsed.conservatismLevel}/5

SPEECH:
${speech}

Score each dimension 1-10:
- humourQuality: Are the jokes actually funny?
- warmthQuality: Is there genuine warmth?
- specificity: Does it feel written for THIS person?
- spokenReadability: Does it flow when read aloud?
- britishness: Does it feel authentically British?
- humanLikeness: Does it sound like a real person wrote it?

Overall score = weighted average (specificity and humanLikeness weighted highest)

Return JSON:
{
  "overallScore": number (1-10),
  "passesQA": boolean (true if overallScore >= 7),
  "humourQuality": number,
  "warmthQuality": number,
  "specificity": number,
  "spokenReadability": number,
  "britishness": number,
  "humanLikeness": number,
  "issues": ["specific issues found"],
  "strengths": ["specific strengths"],
  "recommendation": "approve|flag|regenerate"
}
`.trim()

  return callAIJSON<QAResult>(systemPrompt, userPrompt, "fast")
}
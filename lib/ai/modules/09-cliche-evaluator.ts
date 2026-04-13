import { callAIJSON } from "@/lib/ai/openai"

export interface ClicheEvaluation {
  clicheDensity: "low" | "medium" | "high"
  genericPhrases: string[]
  aiSlopMarkers: string[]
  repetitiveWords: string[]
  weakSections: string[]
  overallQuality: number
  improvementNotes: string[]
}

export async function evaluateCliches(draft: string): Promise<ClicheEvaluation> {
  const systemPrompt = `
You are a professional speech editor identifying generic, clichéd or AI-sounding 
content in a best man speech. Be strict — every generic phrase weakens the speech.
`.trim()

  const userPrompt = `
Evaluate this best man speech for clichés, AI slop markers and generic content.

Watch for:
- Overuse of "genuinely", "truly", "amazing", "special", "incredible", "wonderful"
- Fake wisdom statements ("isn't that what life is all about")
- Generic wedding filler ("on this special day", "as you embark on this journey")
- Empty compliments that could apply to anyone
- Repetitive sentence structures
- Overexplained jokes
- Paragraphs that sound polished but say nothing specific

DRAFT:
${draft}

Return JSON:
{
  "clicheDensity": "low|medium|high",
  "genericPhrases": ["list of generic phrases found"],
  "aiSlopMarkers": ["list of AI-sounding phrases"],
  "repetitiveWords": ["words used too many times"],
  "weakSections": ["sections that lack specificity"],
  "overallQuality": number (1-10),
  "improvementNotes": ["specific improvement suggestions"]
}
`.trim()

  return callAIJSON<ClicheEvaluation>(systemPrompt, userPrompt, "fast")
}
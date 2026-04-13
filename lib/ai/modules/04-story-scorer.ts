import { callAIJSON } from "@/lib/ai/openai"
import { ParsedInput } from "./01-intake-parser"

export interface ScoredStory {
  title: string
  content: string
  humourScore: number
  warmthScore: number
  safetyScore: number
  specificityScore: number
  overallScore: number
  recommendedUse: string
  warnings: string[]
}

export interface StoryScoreResult {
  stories: ScoredStory[]
  bestStory: string
  warmthStory: string
  openingCandidate: string
}

export async function scoreStories(
  parsed: ParsedInput,
  rawStories: Record<string, unknown>[]
): Promise<StoryScoreResult> {
  const systemPrompt = `
You are an expert speechwriter evaluating anecdotes for a British best man speech.
Score each story honestly — a mediocre story scored highly will damage the speech.
`.trim()

  const userPrompt = `
Score these stories and observations for use in a best man speech.

Speaker info: ${parsed.speakerRelation} who has known ${parsed.groomName} for ${parsed.yearsKnown}
Audience: ${parsed.audienceSize} people, conservatism level ${parsed.conservatismLevel}/5
Humour mode: ${parsed.humourMode}
Children present: ${parsed.childrenPresent}

Stories and material to score:
${JSON.stringify([
  { title: "How they met", content: parsed.howTheyMet },
  { title: "Groom funny traits", content: parsed.groomFunniestTraits },
  { title: "Groom teasing material", content: parsed.groomTeasingMaterial },
  { title: "Groom lovely trait", content: parsed.groomLovelyTrait },
  { title: "What makes them work", content: parsed.whatMakesThemWork },
  { title: "Groom changed by partner", content: parsed.groomChangedBy },
  ...rawStories.map((s) => ({ title: s.title, content: `${s.setup} ${s.event} ${s.payoff}` })),
], null, 2)}

Topics to avoid: ${parsed.topicsToAvoid.join(", ") || "none specified"}

Return JSON:
{
  "stories": [
    {
      "title": "string",
      "content": "string",
      "humourScore": number (1-10),
      "warmthScore": number (1-10),
      "safetyScore": number (1-10),
      "specificityScore": number (1-10),
      "overallScore": number (1-10),
      "recommendedUse": "opener|anecdote|warmth_moment|closer|drop",
      "warnings": ["any safety or appropriateness warnings"]
    }
  ],
  "bestStory": "title of best overall story",
  "warmthStory": "title of best warm/heartfelt story",
  "openingCandidate": "title of best story for opening"
}
`.trim()

  return callAIJSON<StoryScoreResult>(systemPrompt, userPrompt, "fast")
}
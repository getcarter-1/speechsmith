import { callAIJSON } from "@/lib/ai/openai"
import { ParsedInput } from "./01-intake-parser"
import { StoryScoreResult } from "./04-story-scorer"
import { SafetyEvaluation } from "./05-audience-safety-evaluator"

export interface SpeechSection {
  sectionType: string
  title: string
  purpose: string
  keyContent: string[]
  toneNotes: string
  estimatedWords: number
}

export interface SpeechPlan {
  sections: SpeechSection[]
  totalEstimatedWords: number
  openingStrategy: string
  closingStrategy: string
  humourMoments: string[]
  warmthMoments: string[]
  planNotes: string
}

export async function planSpeech(
  parsed: ParsedInput,
  storyScores: StoryScoreResult,
  safetyEval: SafetyEvaluation
): Promise<SpeechPlan> {
  const systemPrompt = `
You are an expert British speechwriter creating a detailed plan for a best man speech.
The plan must be specific, practical and reflect the actual material available.
Do not invent content — only plan sections that can be filled with real information.
`.trim()

  const userPrompt = `
Create a detailed speech plan for this best man speech.

Speaker: ${parsed.speakerName || "the best man"}, ${parsed.speakerRelation} for ${parsed.yearsKnown}
Groom: ${parsed.groomName}
Partner: ${parsed.partnerName}
Target length: ${parsed.targetLengthMins} minutes (~${parsed.targetLengthMins * 130} words)
Tone: ${parsed.tonePrimary}
Humour level: ${parsed.humourLevel}/5
Include toast: ${parsed.includeToast}

Best stories available:
- Best overall: ${storyScores.bestStory}
- Best warm moment: ${storyScores.warmthStory}
- Opening candidate: ${storyScores.openingCandidate}

Safety profile:
- Risk level: ${safetyEval.overallRiskLevel}
- Recommended tone: ${safetyEval.recommendedTone}
- Avoid: ${safetyEval.avoidList.join(", ")}

Key material:
- Groom qualities: ${parsed.groomBestQualities}
- Funny traits: ${parsed.groomFunniestTraits}
- Lovely trait: ${parsed.groomLovelyTrait}
- How they met: ${parsed.howTheyMet}
- What makes them work: ${parsed.whatMakesThemWork}
- Partner compliment: ${parsed.partnerCompliment}

Traditional British best man speech sections to consider:
opener, speaker-groom-setup, groom-character, anecdote-1, partner-couple-section, anecdote-2, warmth-pivot, closing-toast

Return JSON:
{
  "sections": [
    {
      "sectionType": "string",
      "title": "string",
      "purpose": "string",
      "keyContent": ["specific points to include"],
      "toneNotes": "string",
      "estimatedWords": number
    }
  ],
  "totalEstimatedWords": number,
  "openingStrategy": "string",
  "closingStrategy": "string",
  "humourMoments": ["planned humour beats"],
  "warmthMoments": ["planned warm moments"],
  "planNotes": "any notes for the writer"
}
`.trim()

  return callAIJSON<SpeechPlan>(systemPrompt, userPrompt, "quality")
}
import { callAIJSON } from "@/lib/ai/openai"

export interface SpeechSegment {
  sectionType: string
  title: string
  content: string
  orderIndex: number
}

export interface SegmentationResult {
  segments: SpeechSegment[]
  totalWordCount: number
  estimatedMinutes: number
}

export async function segmentSpeech(
  speech: string
): Promise<SegmentationResult> {
  const systemPrompt = `
You are splitting a best man speech into logical reviewable sections.
Each section should be a coherent, self-contained unit that makes sense on its own.
`.trim()

  const userPrompt = `
Split this best man speech into reviewable sections.

Section types to use:
- opener
- speaker_groom_setup  
- groom_character
- anecdote_1
- partner_couple
- anecdote_2
- warmth_pivot
- closing_toast

Guidelines:
- Each section should be 50-200 words
- Split at natural breaks in the speech
- Give each section a short descriptive title
- Preserve the exact text of each section

SPEECH:
${speech}

Return JSON:
{
  "segments": [
    {
      "sectionType": "string",
      "title": "string",
      "content": "exact text of this section",
      "orderIndex": number (0-based)
    }
  ],
  "totalWordCount": number,
  "estimatedMinutes": number
}
`.trim()

  return callAIJSON<SegmentationResult>(systemPrompt, userPrompt, "fast")
}
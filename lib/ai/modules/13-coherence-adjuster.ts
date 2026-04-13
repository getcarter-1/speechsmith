import { callAI } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"
import { SpeechSegment } from "./11-section-segmenter"
import { ParsedInput } from "./01-intake-parser"

export async function adjustCoherence(
  segments: SpeechSegment[],
  parsed: ParsedInput
): Promise<string> {
  const systemPrompt = buildSharedSystemPrompt()

  const fullSpeech = segments
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((s) => s.content)
    .join("\n\n")

  const userPrompt = `
Review this best man speech for coherence and flow after section rewrites.
Fix any jarring transitions, repetition or inconsistencies between sections.
Do not change the content of sections — only smooth the joins between them.

SPEECH:
${fullSpeech}

GROOM: ${parsed.groomName}
PARTNER: ${parsed.partnerName}

Return the complete speech with smooth transitions. 
No headers, no formatting — just the spoken text.
`.trim()

  return callAI(systemPrompt, userPrompt, "quality", 0.6)
}
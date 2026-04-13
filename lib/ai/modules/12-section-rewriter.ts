import { callAI } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"
import { ParsedInput } from "./01-intake-parser"
import { SpeechSegment } from "./11-section-segmenter"

export async function rewriteSection(
  section: SpeechSegment,
  surroundingSections: SpeechSegment[],
  rewriteNote: string,
  parsed: ParsedInput
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

  const prevSection = surroundingSections.find(
    (s) => s.orderIndex === section.orderIndex - 1
  )
  const nextSection = surroundingSections.find(
    (s) => s.orderIndex === section.orderIndex + 1
  )

  const userPrompt = `
Rewrite this section of a best man speech.

SECTION TO REWRITE:
Type: ${section.sectionType}
Title: ${section.title}
Current content:
${section.content}

${rewriteNote ? `REWRITE INSTRUCTION FROM SPEAKER:\n${rewriteNote}\n` : ""}

SURROUNDING CONTEXT (do not rewrite these — just use for continuity):
${prevSection ? `Previous section ends with: "...${prevSection.content.slice(-200)}"` : "This is the opening section."}
${nextSection ? `Next section begins with: "${nextSection.content.slice(0, 200)}..."` : "This is the closing section."}

SPEAKER INFO:
- Relation: ${parsed.speakerRelation}
- Humour style: ${parsed.humourStyle.join(", ")}
${parsed.writingSample ? `Writing sample: ${parsed.writingSample.slice(0, 300)}` : ""}

REQUIREMENTS:
- Match the length of the original section approximately
- Flow naturally from the previous section
- Flow naturally into the next section  
- Follow the rewrite instruction if provided
- Keep all factual details
- Sound natural when spoken aloud

Return only the rewritten section text. No commentary or formatting.
`.trim()

  return callAI(systemPrompt, userPrompt, "quality", 0.8)
}
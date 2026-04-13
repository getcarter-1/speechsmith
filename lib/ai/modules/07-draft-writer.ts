import { callAI } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"
import { ParsedInput } from "./01-intake-parser"
import { SpeechPlan } from "./06-speech-planner"

export async function writeDraft(
  parsed: ParsedInput,
  plan: SpeechPlan
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
Write a complete best man speech based on this plan and speaker information.

SPEAKER INFORMATION:
- Name: ${parsed.speakerName || "the best man"}
- Relation to groom: ${parsed.speakerRelation}
- Known groom for: ${parsed.yearsKnown}
- Speaking style: ${parsed.humourStyle.join(", ")}
- Delivery method: ${parsed.deliveryMethod}
${parsed.writingSample ? `\nSPEAKER WRITING SAMPLE (match this voice):\n${parsed.writingSample}` : ""}

GROOM: ${parsed.groomName}
PARTNER: ${parsed.partnerName}

KEY MATERIAL:
- How they met: ${parsed.howTheyMet}
- Groom's best qualities: ${parsed.groomBestQualities}
- Groom's funny traits: ${parsed.groomFunniestTraits}
- Groom's lovely trait: ${parsed.groomLovelyTrait}
- Teasing material: ${parsed.groomTeasingMaterial}
- Partner first impression: ${parsed.partnerFirstImpression}
- Partner brings out in groom: ${parsed.partnerBringsOutInGroom}
- Partner compliment: ${parsed.partnerCompliment}
- What makes them work: ${parsed.whatMakesThemWork}
- How groom changed: ${parsed.groomChangedBy}

SPEECH PLAN:
${plan.sections.map((s) => `
[${s.sectionType.toUpperCase()}] ${s.title}
Purpose: ${s.purpose}
Key content: ${s.keyContent.join("; ")}
Tone: ${s.toneNotes}
Target: ~${s.estimatedWords} words
`).join("\n")}

REQUIREMENTS:
- Target length: ${parsed.targetLengthMins} minutes (~${parsed.targetLengthMins * 130} words)
- Tone: ${parsed.tonePrimary}
- Humour level: ${parsed.humourLevel}/5
- Include toast at end: ${parsed.includeToast}
- Topics to avoid: ${parsed.topicsToAvoid.join(", ") || "none"}
Write the complete speech now. Write it as spoken text only — no stage directions, 
no section headers, no formatting. Just the speech as the best man would deliver it.
`.trim()

  return callAI(systemPrompt, userPrompt, "quality", 0.8)
}
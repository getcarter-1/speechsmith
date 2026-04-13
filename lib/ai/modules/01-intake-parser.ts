import { callAIJSON } from "@/lib/ai/openai"
import { buildSharedSystemPrompt } from "@/lib/ai/shared-rules"

export interface ParsedInput {
  speakerName: string
  speakerRelation: string
  yearsKnown: string
  speakingConfidence: number
  humourStyle: string[]
  deliveryMethod: string
  groomName: string
  partnerName: string
  targetLengthMins: number
  tonePrimary: string
  humourLevel: number
  formalityLevel: number
  includeToast: boolean
  venueName: string
  venueType: string
  audienceSize: string
  childrenPresent: boolean
  elderlyPresent: boolean
  conservatismLevel: number
  whoMustLaugh: string
  whoMustNotBeOffended: string
  howTheyMet: string
  relationshipLength: string
  groomChangedBy: string
  whatMakesThemWork: string
  groomBestQualities: string
  groomFunniestTraits: string
  groomTeasingMaterial: string
  groomLovelyTrait: string
  partnerFirstImpression: string
  partnerBringsOutInGroom: string
  partnerCompliment: string
  writingSample: string
  humourMode: string
  swearingAllowed: boolean
  innuendoAllowed: boolean
  sexualJokesOptIn: boolean
  stagDoOptIn: boolean
  exReferencesOptIn: boolean
  embarrassmentCeiling: number
  topicsToAvoid: string[]
}

export async function parseIntake(rawData: Record<string, unknown>): Promise<ParsedInput> {
  const systemPrompt = buildSharedSystemPrompt()

  const userPrompt = `
You are normalising raw interview data from a best man speech intake form into a clean, structured format.

Raw data:
${JSON.stringify(rawData, null, 2)}

Return a JSON object with these exact fields, inferring reasonable values where data is missing:
{
  "speakerName": "string",
  "speakerRelation": "string",
  "yearsKnown": "string",
  "speakingConfidence": number (1-5),
  "humourStyle": ["string"],
  "deliveryMethod": "string",
  "groomName": "string",
  "partnerName": "string",
  "targetLengthMins": number,
  "tonePrimary": "string",
  "humourLevel": number (1-5),
  "formalityLevel": number (1-5),
  "includeToast": boolean,
  "venueName": "string",
  "venueType": "string",
  "audienceSize": "string",
  "childrenPresent": boolean,
  "elderlyPresent": boolean,
  "conservatismLevel": number (1-5),
  "whoMustLaugh": "string",
  "whoMustNotBeOffended": "string",
  "howTheyMet": "string",
  "relationshipLength": "string",
  "groomChangedBy": "string",
  "whatMakesThemWork": "string",
  "groomBestQualities": "string",
  "groomFunniestTraits": "string",
  "groomTeasingMaterial": "string",
  "groomLovelyTrait": "string",
  "partnerFirstImpression": "string",
  "partnerBringsOutInGroom": "string",
  "partnerCompliment": "string",
  "writingSample": "string",
  "humourMode": "string",
  "swearingAllowed": boolean,
  "innuendoAllowed": boolean,
  "sexualJokesOptIn": boolean,
  "stagDoOptIn": boolean,
  "exReferencesOptIn": boolean,
  "embarrassmentCeiling": number (1-5),
  "topicsToAvoid": ["string"]
}
`.trim()

  return callAIJSON<ParsedInput>(systemPrompt, userPrompt, "fast")
}
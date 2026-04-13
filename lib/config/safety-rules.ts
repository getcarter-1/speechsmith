export const HARD_BANNED_TOPICS = [
  "infidelity",
  "cheating",
  "affair",
  "body image",
  "weight",
  "appearance",
  "religion",
  "religious",
  "deceased relative",
  "dead relative",
  "passed away",
] as const

export const DEFAULT_OPT_IN_STATE = {
  sexualJokesOptIn: false,
  stagDoOptIn: false,
  exReferencesOptIn: false,
  illegalActivityAllowed: false,
  drugReferencesAllowed: false,
  swearingAllowed: false,
  innuendoAllowed: false,
}

export const HUMOUR_MODES = {
  family_safe: {
    label: "Family Safe",
    description: "Suitable for all ages — grandma is watching",
    maxEmbarrassmentLevel: 2,
  },
  mixed_wedding_safe: {
    label: "Mixed Wedding Safe",
    description: "Standard British wedding — normal crowd",
    maxEmbarrassmentLevel: 3,
  },
  adult_evening_safe: {
    label: "Adult Evening Safe",
    description: "Mature crowd who can handle sharper humour",
    maxEmbarrassmentLevel: 5,
  },
} as const

export const MINIMUM_REQUIRED_FIELDS = [
  "groomName",
  "partnerName",
  "speakerRelation",
  "yearsKnown",
  "targetLength",
  "audienceType",
  "humourMode",
  "groomTrait",
  "coupleInsight",
  "story",
  "hardBoundaries",
] as const

export type HumourMode = keyof typeof HUMOUR_MODES
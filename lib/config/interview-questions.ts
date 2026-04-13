export type QuestionType =
  | "text"
  | "textarea"
  | "chips"
  | "slider"
  | "radio"
  | "checkbox"
  | "date"

export type InterviewStage =
  | "speaker"
  | "speech-brief"
  | "event"
  | "audience"
  | "couple"
  | "groom"
  | "partner"
  | "stories"
  | "boundaries"

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  stage: InterviewStage
  type: QuestionType
  question: string
  placeholder?: string
  helperText?: string
  example?: string
  options?: QuestionOption[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
  required?: boolean
  skippable?: boolean
  followUpTrigger?: string
  followUpQuestion?: string
  dbField: string
  dbModel: string
}

export const INTERVIEW_STAGES: { id: InterviewStage; label: string; description: string }[] = [
  { id: "speaker", label: "About You", description: "Tell us a bit about yourself" },
  { id: "speech-brief", label: "The Speech", description: "What kind of speech are you going for?" },
  { id: "event", label: "The Day", description: "Tell us about the wedding" },
  { id: "audience", label: "The Room", description: "Who will be in the audience?" },
  { id: "couple", label: "The Couple", description: "Tell us about them together" },
  { id: "groom", label: "The Groom", description: "Tell us about your mate" },
  { id: "partner", label: "The Partner", description: "Tell us about the partner" },
  { id: "stories", label: "The Stories", description: "The good stuff" },
  { id: "boundaries", label: "Boundaries", description: "What's in and what's out" },
]

export const INTERVIEW_QUESTIONS: Question[] = [

  // ─── SPEAKER ───────────────────────────────────────────────────────────────

  {
    id: "speaker_first_name",
    stage: "speaker",
    type: "text",
    question: "First, what's your name?",
    placeholder: "Your first name",
    required: true,
    skippable: false,
    dbField: "firstName",
    dbModel: "SpeakerProfile",
  },
  {
    id: "speaker_relation",
    stage: "speaker",
    type: "chips",
    question: "How do you know the groom?",
    helperText: "Pick the one that fits best.",
    options: [
      { value: "childhood_friend", label: "Childhood friend" },
      { value: "school_friend", label: "School friend" },
      { value: "university_friend", label: "University friend" },
      { value: "work_friend", label: "Work friend" },
      { value: "brother", label: "Brother" },
      { value: "cousin", label: "Cousin" },
      { value: "other", label: "Other" },
    ],
    required: true,
    skippable: false,
    dbField: "relationToGroom",
    dbModel: "SpeakerProfile",
  },
  {
    id: "speaker_years_known",
    stage: "speaker",
    type: "chips",
    question: "How long have you known him?",
    options: [
      { value: "less_than_2", label: "Less than 2 years" },
      { value: "2_to_5", label: "2–5 years" },
      { value: "5_to_10", label: "5–10 years" },
      { value: "10_to_20", label: "10–20 years" },
      { value: "over_20", label: "Over 20 years" },
      { value: "whole_life", label: "Most of my life" },
    ],
    required: true,
    skippable: false,
    dbField: "yearsKnownGroom",
    dbModel: "SpeakerProfile",
  },
  {
    id: "speaker_confidence",
    stage: "speaker",
    type: "slider",
    question: "How confident are you about public speaking?",
    min: 1,
    max: 5,
    minLabel: "Terrified",
    maxLabel: "Born for it",
    required: true,
    skippable: false,
    dbField: "speakingConfidence",
    dbModel: "SpeakerProfile",
  },
  {
    id: "speaker_humour_style",
    stage: "speaker",
    type: "chips",
    question: "How would you describe your sense of humour?",
    helperText: "Pick as many as feel right.",
    options: [
      { value: "dry", label: "Dry" },
      { value: "self_deprecating", label: "Self-deprecating" },
      { value: "storytelling", label: "Storyteller" },
      { value: "one_liners", label: "One-liners" },
      { value: "observational", label: "Observational" },
      { value: "deadpan", label: "Deadpan" },
      { value: "warm", label: "Warm and gentle" },
      { value: "not_funny", label: "I'm not really funny" },
    ],
    required: false,
    skippable: true,
    dbField: "humourStyle",
    dbModel: "SpeakerProfile",
  },
  {
    id: "speaker_delivery",
    stage: "speaker",
    type: "chips",
    question: "How are you planning to deliver the speech?",
    options: [
      { value: "memorised", label: "From memory" },
      { value: "notes", label: "From notes" },
      { value: "full_script", label: "Full script, word for word" },
      { value: "phone", label: "From my phone" },
      { value: "not_sure", label: "Not sure yet" },
    ],
    required: false,
    skippable: true,
    dbField: "deliveryMethod",
    dbModel: "SpeakerProfile",
  },

  // ─── SPEECH BRIEF ──────────────────────────────────────────────────────────

  {
    id: "brief_length",
    stage: "speech-brief",
    type: "chips",
    question: "How long do you want the speech to be?",
    helperText: "A good best man speech is usually 4–6 minutes.",
    options: [
      { value: "3", label: "3 minutes (short and punchy)" },
      { value: "4", label: "4 minutes" },
      { value: "5", label: "5 minutes (classic length)" },
      { value: "6", label: "6 minutes" },
      { value: "7", label: "7+ minutes (go big)" },
    ],
    required: true,
    skippable: false,
    dbField: "targetLengthMins",
    dbModel: "SpeechBrief",
  },
  {
    id: "brief_tone",
    stage: "speech-brief",
    type: "chips",
    question: "What's the primary tone you're going for?",
    options: [
      { value: "mostly_funny", label: "Mostly funny" },
      { value: "funny_and_warm", label: "Funny and warm" },
      { value: "mostly_warm", label: "Mostly warm" },
      { value: "heartfelt", label: "Heartfelt" },
      { value: "roast_style", label: "Roast-style (with care)" },
    ],
    required: true,
    skippable: false,
    dbField: "tonePrimary",
    dbModel: "SpeechBrief",
  },
  {
    id: "brief_humour_level",
    stage: "speech-brief",
    type: "slider",
    question: "How much humour do you want?",
    min: 1,
    max: 5,
    minLabel: "Very little",
    maxLabel: "As much as possible",
    required: true,
    skippable: false,
    dbField: "humourLevel",
    dbModel: "SpeechBrief",
  },
  {
    id: "brief_formality",
    stage: "speech-brief",
    type: "slider",
    question: "How formal should it feel?",
    min: 1,
    max: 5,
    minLabel: "Very casual",
    maxLabel: "Quite formal",
    required: false,
    skippable: true,
    dbField: "formalityLevel",
    dbModel: "SpeechBrief",
  },
  {
    id: "brief_toast",
    stage: "speech-brief",
    type: "radio",
    question: "Do you want to end with a toast?",
    options: [
      { value: "true", label: "Yes — raise a glass at the end" },
      { value: "false", label: "No — I'll close differently" },
    ],
    required: false,
    skippable: true,
    dbField: "includeToast",
    dbModel: "SpeechBrief",
  },

  // ─── EVENT CONTEXT ─────────────────────────────────────────────────────────

  {
    id: "event_venue_name",
    stage: "event",
    type: "text",
    question: "What's the name of the venue?",
    placeholder: "e.g. The Grand Hotel, Cheltenham",
    helperText: "We'll use this to personalise the opening.",
    required: false,
    skippable: true,
    dbField: "venueName",
    dbModel: "EventContext",
  },
  {
    id: "event_venue_type",
    stage: "event",
    type: "chips",
    question: "What kind of venue is it?",
    options: [
      { value: "hotel", label: "Hotel" },
      { value: "barn", label: "Barn" },
      { value: "manor", label: "Manor house" },
      { value: "pub", label: "Pub or restaurant" },
      { value: "garden", label: "Garden or outdoor" },
      { value: "church_hall", label: "Church or hall" },
      { value: "abroad", label: "Abroad" },
      { value: "other", label: "Other" },
    ],
    required: false,
    skippable: true,
    dbField: "venueType",
    dbModel: "EventContext",
  },
  {
    id: "event_speech_order",
    stage: "event",
    type: "chips",
    question: "When are you speaking?",
    options: [
      { value: "first", label: "First speaker" },
      { value: "second", label: "Second speaker" },
      { value: "last", label: "Last speaker" },
      { value: "only", label: "Only speaker" },
      { value: "not_sure", label: "Not sure yet" },
    ],
    required: false,
    skippable: true,
    dbField: "speechOrder",
    dbModel: "EventContext",
  },
  {
    id: "event_before_after_food",
    stage: "event",
    type: "radio",
    question: "Are you speaking before or after the meal?",
    options: [
      { value: "before", label: "Before the meal" },
      { value: "after", label: "After the meal" },
      { value: "not_sure", label: "Not sure" },
    ],
    required: false,
    skippable: true,
    dbField: "beforeAfterFood",
    dbModel: "EventContext",
  },

  // ─── AUDIENCE ──────────────────────────────────────────────────────────────

  {
    id: "audience_size",
    stage: "audience",
    type: "chips",
    question: "How many people will be in the room?",
    options: [
      { value: "under_30", label: "Under 30" },
      { value: "30_to_60", label: "30–60" },
      { value: "60_to_100", label: "60–100" },
      { value: "100_to_150", label: "100–150" },
      { value: "over_150", label: "Over 150" },
    ],
    required: true,
    skippable: false,
    dbField: "audienceSize",
    dbModel: "AudienceProfile",
  },
  {
    id: "audience_children",
    stage: "audience",
    type: "radio",
    question: "Will there be children in the room?",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    required: true,
    skippable: false,
    dbField: "childrenPresent",
    dbModel: "AudienceProfile",
  },
  {
    id: "audience_elderly",
    stage: "audience",
    type: "radio",
    question: "Will there be elderly relatives who might be easily shocked?",
    options: [
      { value: "true", label: "Yes, definitely" },
      { value: "false", label: "No, we're all pretty modern" },
    ],
    required: false,
    skippable: true,
    dbField: "elderlyPresent",
    dbModel: "AudienceProfile",
  },
  {
    id: "audience_conservatism",
    stage: "audience",
    type: "slider",
    question: "How conservative is the crowd overall?",
    min: 1,
    max: 5,
    minLabel: "Very relaxed",
    maxLabel: "Very traditional",
    required: true,
    skippable: false,
    dbField: "conservatismLevel",
    dbModel: "AudienceProfile",
  },
  {
    id: "audience_must_laugh",
    stage: "audience",
    type: "textarea",
    question: "Is there anyone in the room who absolutely must laugh?",
    placeholder: "e.g. The groom's dad has a great sense of humour and would love a dig at Tom's terrible fashion sense in the 2000s.",
    helperText: "Optional — but useful for calibrating the humour.",
    required: false,
    skippable: true,
    dbField: "whoMustLaugh",
    dbModel: "AudienceProfile",
  },
  {
    id: "audience_must_not_offend",
    stage: "audience",
    type: "textarea",
    question: "Is there anyone we absolutely must not offend?",
    placeholder: "e.g. Sarah's grandmother is very religious and we should avoid anything edgy.",
    helperText: "We'll keep this in mind throughout.",
    required: false,
    skippable: true,
    dbField: "whoMustNotBeOffended",
    dbModel: "AudienceProfile",
  },

  // ─── COUPLE ────────────────────────────────────────────────────────────────

  {
    id: "couple_how_met",
    stage: "couple",
    type: "textarea",
    question: "How did they meet?",
    placeholder: "e.g. They met at a mutual friend's birthday in 2019. Tom pretended to know far more about wine than he does.",
    helperText: "The more specific the better — even small details help.",
    required: true,
    skippable: false,
    dbField: "howTheyMet",
    dbModel: "CoupleProfile",
    followUpTrigger: "vague",
    followUpQuestion: "Can you remember anything specific about that first meeting — where it was, what was said, or what stood out?",
  },
  {
    id: "couple_relationship_length",
    stage: "couple",
    type: "chips",
    question: "How long have they been together?",
    options: [
      { value: "under_1", label: "Less than a year" },
      { value: "1_to_2", label: "1–2 years" },
      { value: "2_to_4", label: "2–4 years" },
      { value: "4_to_7", label: "4–7 years" },
      { value: "over_7", label: "7+ years" },
    ],
    required: false,
    skippable: true,
    dbField: "relationshipLength",
    dbModel: "CoupleProfile",
  },
  {
    id: "couple_what_changed",
    stage: "couple",
    type: "textarea",
    question: "How has the groom changed since meeting his partner?",
    placeholder: "e.g. He's calmer, tidier, actually eats vegetables now. He laughs more.",
    helperText: "This often makes for a lovely moment in the speech.",
    required: false,
    skippable: true,
    dbField: "groomChangedBy",
    dbModel: "CoupleProfile",
  },
  {
    id: "couple_what_makes_them_work",
    stage: "couple",
    type: "textarea",
    question: "What makes them work as a couple?",
    placeholder: "e.g. She keeps him grounded. He makes her laugh constantly. They're just genuinely best mates.",
    required: false,
    skippable: true,
    dbField: "whatMakesThemWork",
    dbModel: "CoupleProfile",
  },

  // ─── GROOM ─────────────────────────────────────────────────────────────────

  {
    id: "groom_best_qualities",
    stage: "groom",
    type: "textarea",
    question: "What are the groom's genuinely best qualities?",
    placeholder: "e.g. He's fiercely loyal, always the first to show up when someone needs help, and somehow always remembers everyone's birthdays.",
    helperText: "Think beyond 'he's a good laugh' — what actually makes him a good person?",
    required: true,
    skippable: false,
    dbField: "bestQualities",
    dbModel: "GroomProfile",
  },
  {
    id: "groom_funniest_traits",
    stage: "groom",
    type: "textarea",
    question: "What's his funniest trait or habit?",
    placeholder: "e.g. He insists on being 45 minutes early to everything. He has never successfully assembled flat-pack furniture on the first attempt.",
    helperText: "Specific and harmless is perfect.",
    required: false,
    skippable: true,
    dbField: "funniestTraits",
    dbModel: "GroomProfile",
    followUpTrigger: "vague",
    followUpQuestion: "Can you think of a specific moment or example that sums that up?",
  },
  {
    id: "groom_teasing_material",
    stage: "groom",
    type: "textarea",
    question: "What can we gently tease him about?",
    placeholder: "e.g. His terrible taste in cars in his twenties. The time he got lost on a lads holiday and blamed Google Maps.",
    helperText: "Affectionate teasing only — nothing that would genuinely embarrass him.",
    required: false,
    skippable: true,
    dbField: "teasingMaterial",
    dbModel: "GroomProfile",
  },
  {
    id: "groom_lovely_trait",
    stage: "groom",
    type: "textarea",
    question: "What's one thing about him that would genuinely surprise people — in a good way?",
    placeholder: "e.g. Despite the lad exterior, he volunteers at a local food bank every month and never mentions it.",
    helperText: "This often creates the best warm moment of the speech.",
    required: false,
    skippable: true,
    dbField: "lovelyTrait",
    dbModel: "GroomProfile",
  },

  // ─── PARTNER ───────────────────────────────────────────────────────────────

  {
    id: "partner_first_impression",
    stage: "partner",
    type: "textarea",
    question: "What was your first impression of the partner?",
    placeholder: "e.g. Honestly, I thought she was way out of his league. Still do.",
    required: false,
    skippable: true,
    dbField: "firstImpression",
    dbModel: "PartnerProfile",
  },
  {
    id: "partner_brings_out",
    stage: "partner",
    type: "textarea",
    question: "What does the partner bring out in the groom?",
    placeholder: "e.g. She makes him more patient. He's more confident around her. She's the only person who can make him sit still.",
    required: false,
    skippable: true,
    dbField: "bringsOutInGroom",
    dbModel: "PartnerProfile",
  },
  {
    id: "partner_compliment",
    stage: "partner",
    type: "textarea",
    question: "How would you describe the partner to the room — in a sentence or two?",
    placeholder: "e.g. She's warm, hilarious, and somehow puts up with Tom's obsession with Formula 1 without complaint.",
    helperText: "Keep it genuine and warm — this is a compliment, not a roast.",
    required: false,
    skippable: true,
    dbField: "worthMentioning",
    dbModel: "PartnerProfile",
  },

  // ─── BOUNDARIES ────────────────────────────────────────────────────────────

  {
    id: "boundaries_swearing",
    stage: "boundaries",
    type: "radio",
    question: "Is swearing acceptable in the speech?",
    options: [
      { value: "true", label: "Yes — within reason" },
      { value: "false", label: "No — keep it clean" },
    ],
    required: true,
    skippable: false,
    dbField: "swearingAllowed",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_innuendo",
    stage: "boundaries",
    type: "radio",
    question: "Is mild innuendo acceptable?",
    options: [
      { value: "true", label: "Yes — a little goes a long way" },
      { value: "false", label: "No — keep it wholesome" },
    ],
    required: false,
    skippable: true,
    dbField: "innuendoAllowed",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_stag",
    stage: "boundaries",
    type: "radio",
    question: "Can we reference the stag do?",
    options: [
      { value: "true", label: "Yes — nothing too specific" },
      { value: "false", label: "No — best left alone" },
    ],
    required: false,
    skippable: true,
    dbField: "stagDoOptIn",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_ex",
    stage: "boundaries",
    type: "radio",
    question: "Can we mention any ex-partners?",
    options: [
      { value: "true", label: "Yes — carefully" },
      { value: "false", label: "No — absolutely not" },
    ],
    required: false,
    skippable: true,
    dbField: "exReferencesOptIn",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_topics_to_avoid",
    stage: "boundaries",
    type: "textarea",
    question: "Are there any topics we should completely avoid?",
    placeholder: "e.g. His redundancy last year. His parents' divorce. Anything to do with his previous relationship.",
    helperText: "Nothing you mention here will appear in the speech.",
    required: false,
    skippable: true,
    dbField: "topicsToAvoid",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_embarrassment_ceiling",
    stage: "boundaries",
    type: "slider",
    question: "How embarrassing can we go?",
    min: 1,
    max: 5,
    minLabel: "Keep it kind",
    maxLabel: "He can take it",
    required: true,
    skippable: false,
    dbField: "embarrassmentCeiling",
    dbModel: "RedLines",
  },
  {
    id: "boundaries_humour_mode",
    stage: "boundaries",
    type: "chips",
    question: "What's the overall humour mode for the room?",
    helperText: "This helps us calibrate every joke in the speech.",
    options: [
      { value: "family_safe", label: "Family safe — grandma is watching" },
      { value: "mixed_wedding_safe", label: "Mixed wedding safe — normal British wedding" },
      { value: "adult_evening_safe", label: "Adult evening safe — it's that kind of crowd" },
    ],
    required: true,
    skippable: false,
    dbField: "humourMode",
    dbModel: "RedLines",
  },
]

export function getQuestionsByStage(stage: InterviewStage): Question[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.stage === stage)
}

export function getStageIndex(stage: InterviewStage): number {
  return INTERVIEW_STAGES.findIndex((s) => s.id === stage)
}

export function getNextStage(stage: InterviewStage): InterviewStage | null {
  const index = getStageIndex(stage)
  if (index === -1 || index === INTERVIEW_STAGES.length - 1) return null
  return INTERVIEW_STAGES[index + 1].id
}

export function getPreviousStage(stage: InterviewStage): InterviewStage | null {
  const index = getStageIndex(stage)
  if (index <= 0) return null
  return INTERVIEW_STAGES[index - 1].id
}

export function getRequiredQuestions(): Question[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.required)
}
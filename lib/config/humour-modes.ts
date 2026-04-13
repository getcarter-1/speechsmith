export type HumourMode = "family_safe" | "mixed_wedding_safe" | "adult_evening_safe"

export const HUMOUR_MODE_CONFIG: Record
  HumourMode,
  {
    label: string
    description: string
    maxEmbarrassmentLevel: number
    allowsInnuendo: boolean
    allowsMildSwearing: boolean
  }
> = {
  family_safe: {
    label: "Family Safe",
    description: "Suitable for all ages including children",
    maxEmbarrassmentLevel: 2,
    allowsInnuendo: false,
    allowsMildSwearing: false,
  },
  mixed_wedding_safe: {
    label: "Mixed Wedding Safe",
    description: "Standard British wedding audience",
    maxEmbarrassmentLevel: 3,
    allowsInnuendo: false,
    allowsMildSwearing: false,
  },
  adult_evening_safe: {
    label: "Adult Evening Safe",
    description: "Mature audience, sharper humour",
    maxEmbarrassmentLevel: 5,
    allowsInnuendo: true,
    allowsMildSwearing: true,
  },
}
# Speechsmith — Claude Code Implementation Guide

Read `BRAND_SYSTEM.md` first, then this. Do not make design decisions; everything needed is specified. If something genuinely is not specified, stop and ask rather than inventing a value.

## Folder structure

```
src/
├── components/
│   ├── brand/
│   │   ├── SiteHeader.tsx
│   │   ├── Wordmark.tsx
│   │   └── SiteFooter.tsx
│   ├── character/
│   │   ├── SpeechsmithCharacter.tsx
│   │   ├── CharacterPlaceholder.tsx
│   │   └── CharacterTransitionPanel.tsx
│   ├── interview/
│   │   ├── InterviewPromptCard.tsx
│   │   ├── QuickAnswerChip.tsx
│   │   ├── FreeTextAnswerField.tsx
│   │   ├── InterviewRail.tsx
│   │   ├── InterviewMilestonePanel.tsx
│   │   ├── MediaUploadCard.tsx
│   │   └── StoryCard.tsx
│   ├── draft/
│   │   ├── GenerationState.tsx
│   │   ├── DraftReviewHeader.tsx
│   │   ├── DraftSectionCard.tsx
│   │   ├── SectionDecisionControls.tsx
│   │   ├── GoodButton.tsx
│   │   ├── DropButton.tsx
│   │   ├── RewriteButton.tsx
│   │   ├── RewriteNoteField.tsx
│   │   ├── WarningPanel.tsx
│   │   └── FinalSpeechReader.tsx
│   └── common/
│       ├── PrimaryCTA.tsx
│       ├── SecondaryCTA.tsx
│       ├── ProgressIndicator.tsx
│       ├── ProjectCard.tsx
│       ├── EmptyState.tsx
│       └── RecoverableErrorState.tsx
├── config/
│   ├── brand-tokens.ts        // typed re-export of brand-tokens.json
│   ├── character-states.ts
│   ├── speech-types.ts
│   └── asset-manifest.ts      // typed import of asset-manifest.json
├── styles/
│   └── tokens.css
└── types/
    └── brand.ts               // from brand-types.ts

public/
└── assets/
    ├── brand/
    │   ├── wordmark.svg
    │   └── favicon/
    ├── character/
    │   ├── best-man/          // character-best-man-[state]-v01.{png,webp}
    │   └── shared/            // reference sheets, not shipped
    └── icons/
```

The `spec/` files in this repo map as: `brand-tokens.json` → `src/config/`, `tokens.css` → `src/styles/`, `speech-types.ts` + `character-states.ts` → `src/config/`, `brand-types.ts` → `src/types/brand.ts`, `asset-manifest.json` → `public/assets/character/` **and** typed import in `src/config/asset-manifest.ts`, `tailwind-theme-example.ts` → `tailwind.config.ts`.

---

## Implementation sequence

Steps 1–6 do **not** require final illustration assets. `SpeechsmithCharacter` renders `CharacterPlaceholder` whenever the manifest lookup returns `null` or the image fails to load, so all layout work proceeds in parallel with Batches 1–4.

| # | Step | Needs artwork? | Done when |
|---|---|---|---|
| 1 | Add `tokens.css`, import once in `app/layout.tsx` | no | every token resolves in devtools; no literal hex anywhere in `src/` |
| 2 | Configure fonts via `next/font/google`: Archivo (400–700), IBM Plex Mono (400,500), Source Serif 4 (400) | no | no FOUT; fallback stacks verified with fonts blocked |
| 3 | Map Tailwind theme from `tailwind-theme-example.ts` | no | `bg-surface`, `text-content-muted`, `text-prompt` etc. all compile |
| 4 | Build `common/` primitives: PrimaryCTA, SecondaryCTA, ProgressIndicator, EmptyState, RecoverableErrorState | no | all states incl. focus/disabled/loading; 44px targets verified |
| 5 | Build `SpeechsmithCharacter` + `CharacterPlaceholder` | no | placeholder shows the resolved asset id; every `size` renders at spec |
| 6 | Wire `asset-manifest.json` through `resolveCharacterAsset` | no | no filename string exists in any component |
| 7 | Implement page layouts against the trees in `COMPONENT_SPEC.md` | no | all 10 routes render with placeholders |
| 8 | Integrate character states per `COMPONENT_CHARACTER_MAP` | **yes** (Batch 3) | one instance max per viewport; forbidden components audited |
| 9 | Add responsive rules per the band table | partial | 360 / 414 / 768 / 1024 / 1440 all pass |
| 10 | Add accessibility behaviour | no | axe clean; keyboard-only pass on all 10 routes |
| 11 | Visual QA against `VISUAL_QA_CHECKLIST.md` | yes | every box ticked |

---

## Character component contract

```tsx
type SpeechsmithCharacterProps = {
  state: CharacterState;              // required, no default
  speechType?: string;                // default "best-man"
  size?: CharacterSize;               // default: CHARACTER_STATES[state].recommendedSize
  decorative?: boolean;               // default: CHARACTER_STATES[state].decorative
  alt?: string;                       // overrides manifest altText; ignored when decorative
  className?: string;
};
```

Required behaviour:

- **Resolution:** `resolveCharacterAsset(manifest, state, speechType)`. Falls back to the `best-man` set, then to `CharacterPlaceholder`. Never construct a filename.
- **Missing asset:** render `CharacterPlaceholder` at the same box size. Log once in development. Never render a broken image, never collapse the layout.
- **Alt text:** `decorative` → `alt=""` + `aria-hidden="true"` + `data-decorative-illustration`. Otherwise the manifest `altText` (or the `alt` prop). An empty `altText` on a non-decorative asset is a build-time error.
- **Sizing:** width from `illustration.*` for the given `size`, clamped by the asset's `minRenderedPx`/`maxRenderedPx`, then multiplied by `var(--character-scale)`. Never upscale past `maxRenderedPx`.
- **Responsive:** honours `mobileTreatment`. When a state is hidden on mobile, render nothing — do not render at 0 opacity.
- **Reduced motion:** the only animation-capable asset is `generating`; disable its loop under `prefers-reduced-motion`.
- **Next.js:** `next/image` with `sizes` derived from the size token and `priority` only on the homepage hero.

---

## Enforcement rules

Add these as lint rules or a CI check — they are the difference between a system and a suggestion:

1. No hex colour literal in `src/` outside `tokens.css`.
2. No `px` value in a component that is not a border width, an icon size, or an illustration clamp.
3. No string matching `character-.*-v\d+` outside `asset-manifest.json`.
4. No `<SpeechsmithCharacter>` inside any component named in `CHARACTER_FORBIDDEN_COMPONENTS`.
5. No `SpeechCategory` or `CharacterState` string literal that is not a member of the exported union.
6. `outline: none` is forbidden without an accompanying visible focus style.
7. `font-family` may only be set via the three family tokens.

---

## What must not be invented

Do not invent colours, spacing values, radii, durations, character states, speech categories or speech types. Do not rename anything. Do not decide where the character belongs — `COMPONENT_CHARACTER_MAP` and the forbidden list are exhaustive. Do not create culturally specific variants. Do not reverse-engineer values from any screenshot. Do not hard-code asset filenames.

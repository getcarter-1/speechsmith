# Speechsmith — Brand System

**Version** 1.0.0 · **Territory** Quiet Bureau · **Status** approved for MVP
**MVP persona** Best man (`best-man`) · **Character** Nib

> Every value in this document exists as a token in `brand-tokens.json` / `tokens.css`. If a value is not in the tokens, it is not approved.

---

## 1. Executive design summary

Speechsmith helps someone who is not a writer produce a speech they can stand up and deliver. The product's core emotional job is **removing dread**, not generating excitement. The visual system is therefore built on restraint: a warm paper canvas, a cool ink, institutional structure, and a small non-human assistant who stays out of the way.

The system must simultaneously host a stag-do speech and a bar mitzvah tribute. That constraint drives every decision: playfulness lives in **microcopy and accent intensity**, never in the chassis. One `data-sensitivity` attribute on `<body>` downshifts character size, accent chroma, decorative illustration and humour across the whole app — so a sensitive occasion is a *configuration* of the same components, never a separate design.

**Three decisions that carry the most weight:**

1. **The character is a fountain-pen nib, not a person.** A human mascot fixes an age, gender and ethnicity that every future persona inherits, and makes religious and bereavement-adjacent occasions unshippable. An object mascot costs less per outfit variation and implies nothing.
2. **`#F4F0E8` is both the brand canvas and the keying colour.** The illustration background disappears into the UI, so background removal is a quality safeguard rather than a visual requirement — assets look correct even before the alpha channel is cut.
3. **Occasion colour is a single indirection.** Components reference `--colour-occasion-active` only. Adding a speech type never touches a component.

---

## 2. Recommended visual territory

**DECISION: Quiet Bureau.**

Warm paper canvas (`#F4F0E8`) against a cool near-black ink (`#22262E`), one steel-blue accent (`#3E5A7A`), sharp 2px radii, hairline rules instead of shadows, monospace for all labels and metadata, and a reading serif reserved for the speech text itself.

**Rationale.** The warm/cool tension gives the interface life without saturation, which means occasion accents can sit at low chroma and still register. Structure is carried by rules and grid rather than cards-on-cards, so the same chassis reads as celebratory (birthday, accent at full chroma) or grave (redundancy farewell, accent at 0.35 chroma) with no restyling. It is also the only one of the three explored territories that already looks correct for the future business tier.

**Fallback alternatives (not implemented):** *Letterpress Workshop* — same palette logic with a serif display and a human scribe; warmer, less future-proof. *Warm Editorial* — rounded, magazine-like, most immediately likeable but weakest under formal and sensitive occasions.

---

## 3. Brand principles

1. **The user's voice wins.** The interface never sounds more polished than the speech will. Copy is plain, second person, contraction-friendly.
2. **Calm beats delight.** No confetti, no streaks, no celebration animation. The reward is the draft.
3. **Structure over decoration.** Hairlines, grid and type hierarchy carry the design. Decoration is the exception and must be removable.
4. **The assistant is not the star.** The character occupies roughly 30% of the visual attention budget and never appears where the user is reading or deciding.
5. **Sensitivity is a setting, not a redesign.** One attribute reconfigures tone, scale and colour intensity system-wide.
6. **Nothing important is carried by an image or a colour alone.**

---

## 4. Character identity specification

**Name** Nib · **Type** non-human object mascot · **Reference** `character-lock-front-neutral-v01`

See `brand-types.ts → SPEECHSMITH_CHARACTER` for the machine-readable contract. Summary:

**Permanent (never varies)**
- Tapered teardrop nib body with a central slit and a round breather hole at chest height
- Two round dot eyes on the upper shoulder plate, one eye-width apart
- No mouth, no eyebrows — expression comes from eye shape, plate tilt and posture
- Two thin limbs with mitten hands; thin legs with simple shoes
- Body height ≈ 4.5 head-plate widths
- Uniform-weight dark ink outline, one flat mid-tone fill, one darker shade in the slit
- Warm graphite body colour, always distinct from `#F4F0E8`

**Permitted variation** pose · eye shape · plate tilt · outfit and worn accessories · held props (max two) · limb position

**Prohibited** a mouth · eyebrows · changed proportions · gradients, texture or painterly shading · changed line weight · cuteness, chibi proportions, bouncing, winking · religious garments, symbols or ritual objects · cultural dress as decoration · trophies, microphones, drinks · `#F4F0E8` anywhere inside the figure · depiction at a lectern addressing a crowd

**Recognisability test:** strip the outfit and the silhouette must still read as Nib. Outfit is the only per-speech-type variable, so identity cannot depend on it.

---

## 5. Character usage rules

- **Attention budget:** at most one character instance visible per viewport. If two components both want one, the higher-priority component wins and the other renders text only. Priority order: `generating` > `draft-ready` > `safety-check` > `welcome` > `empty-project` > `error-recovery` > everything else.
- **Never** in the site header, the speech editor body, any draft section card, the final speech reader, decision controls, login/signup, payment, or an unrecoverable error. See `CHARACTER_FORBIDDEN_COMPONENTS`.
- **Never animated on entry of a new interview question.** The character is static between questions; only the progress indicator moves.
- **Never the sole carrier of meaning.** Every state's message exists in text within the same component.
- `decorative: true` → `alt=""` plus `aria-hidden="true"` plus `data-decorative-illustration` (so sensitive tiers can hide it via CSS).
- Below `md` (768px) the character renders only at `avatar` size or is hidden — see each state's `mobileTreatment` in `character-states.ts`.

---

## 6. Speech-category variation system

Nine categories, 39 approved types — the complete universe, in `speech-types.ts`. No additions.

One type is **parameterised** rather than duplicated: `special-birthdays` covers the source list's 30th–100th range via `milestoneAge` (30–100, step 10). It has one slug, one outfit, one asset set and one accent; the age varies copy only. This is the approved pattern for any future range-shaped occasion — parameterise, never multiply slugs.

What varies per **type**: outfit reference, permitted props, emotional tone, playfulness (0–3), sensitivity tier.
What varies per **category**: the occasion accent token.
What never varies: layout, spacing, type scale, component anatomy, character identity.

Outfit fidelity is per **type** (client decision). Cost is contained by the mascot: an outfit is 1–2 worn accessories on an unchanged body, not a redrawn figure. Only `joint-bride-and-groom` needs a novel two-figure composition.

MVP ships `best-man` only. Every other type resolves to the shared `best-man` asset set via `resolveCharacterAsset`, which is correct-looking because the mascot is occasion-neutral.

---

## 7. Sensitive-occasion rules

Five tiers. Rule table in `character-states.ts → SENSITIVITY_RULES`, enforced in CSS via `[data-sensitivity]`.

| Tier | Char. scale | Expressions | Props | Motion | Accent chroma | Humour | Decorative illus. |
|---|---|---|---|---|---|---|---|
| `playful` | 1.0 | warm, amused, delighted, wry | state default | yes | 1.0 | yes | yes |
| `warm` | 1.0 | warm, attentive, proud, neutral | state default | yes | 0.85 | no | yes |
| `formal` | 0.7 | attentive, neutral, respectful | reduced | yes | 0.6 | no | yes |
| `sensitive` | 0.45 | neutral only | none | no | 0.35 | no | **no** |
| `culturally-reviewed` | 0.45 | neutral only | none | no | 0.35 | no | **no** |

**Religious and cultural occasions.** `bar-mitzvah-speech` and `christening-speech` must not ship without review by a qualified cultural advisor. The character wears no religious garment, holds no ritual object, and stands in no depicted place of worship. There is no illustrated cultural signalling of any kind — the occasion is carried by typography, layout and the user's own words. This is why an object mascot was chosen.

---

## 8. Colour system

Full values in `brand-tokens.json`. Roles:

- **Canvas** `#F4F0E8` — page background and illustration keying colour.
- **Surface** `#FAF8F3` — cards, panels, anything sitting on canvas. **Raised** `#FFFFFF` for overlays only.
- **Sunken** `#EDE8DC` — inputs, wells, progress tracks.
- **Ink** `#22262E` — primary text, primary button fill, emphasis rules.
- **Accent** `#3E5A7A` — the single interactive colour: primary CTA, focus ring, progress fill, links.
- **Highlight** `#8A6A2E` — reserved for warning and for the "changed since last draft" marker. Never decorative.
- **Rules** `#DEDACD` / `#C9C5B8` / `#B4B0A2` — subtle / default / strong.

**Occasion accents** are nine values at matched lightness and chroma, differing only in hue, all ≥4.5:1 on canvas and on surface. Components use `--colour-occasion-active`; `<body data-occasion>` selects. Sensitive tiers reduce perceived intensity via `--occasion-chroma`.

**Rules.** No colour outside the tokens. Never colour as the only signal (Good/Drop/Rewrite carry icon + label + colour). White (`#FFFFFF`) appears only as overlay surface — never as page background, which would break the illustration keying relationship.

---

## 9. Typography system

Three families, all open source, all with clear web routes:

| Family | Token | Licence | Use |
|---|---|---|---|
| Archivo | `font.family.ui` | Open source (OFL) | All interface text, headlines, buttons |
| IBM Plex Mono | `font.family.mono` | Open source (OFL) | Labels, metadata, counters, annotations |
| Source Serif 4 | `font.family.reading` | Open source (OFL) | **Only** the speech text — editor and reader |

System fallbacks are declared in the token stacks. No commercially licensed and no optional fonts. The mono face carries no essential body copy; the serif carries no interface chrome.

| Role | Family | Weight | Desktop | Mobile | Line height | Tracking | Use |
|---|---|---|---|---|---|---|---|
| `displayHeadline` | ui | 700 | 48px | 34px | 1.02 | -3% | Homepage hero only |
| `pageTitle` | ui | 700 | 34px | 28px | 1.08 | -2.5% | One per page |
| `sectionTitle` | ui | 600 | 22px | 20px | 1.25 | -1.5% | Section headers |
| `cardTitle` | ui | 600 | 17px | 17px | 1.35 | -1% | Cards, list rows |
| `body` | ui | 400 | 16px | 16px | 1.65 | 0 | Default prose |
| `bodySmall` | ui | 400 | 14px | 14px | 1.55 | 0 | Secondary prose, chips |
| `label` | mono | 500 | 11px | 11px | 1.3 | +10% caps | Counters, metadata, eyebrows |
| `helperText` | ui | 400 | 13px | 13px | 1.5 | 0 | Field hints |
| `button` | ui | 600 | 15px | 16px | 1 | 0 | All buttons (larger on mobile) |
| `conversationalPrompt` | ui | 700 | 28px | 23px | 1.15 | -2% | Interview questions |
| `speechEditorText` | reading | 400 | 19px | 18px | 1.75 | 0 | Draft sections |
| `speechReaderText` | reading | 400 | 22px | 19px | 1.85 | 0 | Final reader / rehearsal |
| `annotation` | mono | 400 | 12px | 12px | 1.45 | +4% | Rewrite notes, timestamps |

Measure: prose ≤ 68ch; speech text 40rem (`--container-reading`).

---

## 10. Spacing and layout system

4px base, tokens `space-0` … `space-24`. No arbitrary values.

Vertical rhythm: `space-2` within a control, `space-4` between related elements, `space-6` between blocks in a card, `space-10` between page sections on mobile, `space-16` on desktop.

Containers: `reading` 640px, `form` 540px, `app` 1200px, `wide` 1440px. Gutters 16 / 24 / 40px at mobile / tablet / desktop.

Radii are deliberately near-zero (`0.125rem`). `radius-pill` exists for the progress track only.

Elevation is carried by **borders**, not shadows. `shadow-raised` is permitted on the media upload card in drag-over state; `shadow-overlay` on modals only.

---

## 11. Illustration and iconography rules

**Illustration** = the character only. There is no secondary illustration library in MVP. Empty states use the character plus text; they do not get bespoke spot art.

**Icons:** one open-source line set (Lucide), 1.5px stroke, 20px default / 24px on touch targets, `currentColor` only. Icons never appear inside the speech text. Every icon that conveys state is paired with a text label.

**Placeholders before artwork exists:** a 135° 5px repeating stripe between `--colour-character-placeholder-stripe-a/b`, a hairline `--colour-border-default` frame, and the resolved asset id in `annotation` type at `--colour-character-placeholder-text`. This is what `<SpeechsmithCharacter>` renders when the manifest lookup fails — so page work proceeds before Batch 3.

---

## 12. Responsive behaviour

| Band | Width | Layout | Character |
|---|---|---|---|
| Small mobile | 360–413 | Single column, 16px gutter | `avatar` only, or hidden |
| Large mobile | 414–767 | Single column, 16px gutter | `avatar`, or `panel` at ≤200px for `welcome` / `generating` / `draft-ready` |
| Tablet | 768–1023 | Single column at `form` width; rails collapse to top | Up to `inline` (160px) |
| Desktop | 1024–1439 | Two column: content + 260px rail | Full state spec |
| Wide desktop | ≥1440 | Content capped at `app`; extra space becomes margin, never wider text | Full state spec, no upscaling past `maxRenderedPx` |

Per-state min/max width, alignment, crop and hide behaviour are declared in `character-states.ts` (`mobileTreatment` / `desktopTreatment`) and bounded by `minRenderedPx` / `maxRenderedPx` in the manifest. Text measure never exceeds 68ch at any band. Layout stacks at `md` and below for every page except the final reader, which is single-column at all widths.

---

## 13. Accessibility requirements

- **Contrast:** body and label text ≥4.5:1; text ≥24px ≥3:1. All nine occasion accents verified ≥4.5:1 on canvas and surface. Never place occasion accent text on its own subtle tint below 4.5:1.
- **Keyboard:** every interactive element reachable in DOM order; quick-answer chips are a `role="listbox"`/`role="option"` group with arrow-key traversal; Good/Drop/Rewrite are real buttons.
- **Focus:** 2px `--colour-border-focus` outline, 2px offset, never removed. Focus is visible on canvas, surface and inverse.
- **Semantics:** one `<h1>` per page; interview question is a `<legend>` or `<h2>` bound to its field; draft sections are `<article>` inside an ordered list.
- **Character alt text:** meaningful states (`welcome`, `draft-ready`) take manifest `altText`. All others are `alt=""` + `aria-hidden="true"`.
- **Reduced motion:** `prefers-reduced-motion` zeroes all durations; the generation state's progress is text and a determinate bar, never a spinner-only.
- **Touch targets:** ≥44px, 8px minimum separation.
- **Errors:** text, not colour; announced via `role="alert"`; recovery action adjacent.
- **Status:** generation progress in an `aria-live="polite"` region.
- **Colour independence:** Good = check icon + "Good"; Drop = cross + "Drop"; Rewrite = pencil + "Rewrite".

---

## 14. Motion and interaction guidance

| Component | Trigger | Duration | Easing | Property | Reduced-motion |
|---|---|---|---|---|---|
| Primary/secondary CTA | hover, active | 120ms | standard | `background-color`, `border-color` | instant swap |
| Quick-answer chip | select | 120ms | standard | `background-color`, `border-color` | instant swap |
| Progress indicator | value change | 320ms | standard | `width` | instant width |
| Character transition panel | state change | 200ms | enter | `opacity` 0→1 only | instant, no fade |
| Draft section card | Good/Drop decision | 200ms | exit | `opacity` 1→0.5 | instant opacity |
| Warning panel | mount | 200ms | enter | `opacity` | instant |
| Modal / overlay | open | 200ms | enter | `opacity` + 8px `translateY` | opacity only |

Forbidden: continuous character movement, bouncing, idle loops, motion on every interview question, motion required to understand content, any animation exceeding 480ms.

---

## 15. Asset inventory

MVP: 12 core best-man states + 3 responsive alternates + 1 avatar-optimised crop = **16 production assets** (`asset-manifest.json`).
Character-lock batch: 6 review images. Outfit-lock batch: 3 review images. Neither ships.
Brand: wordmark (Archivo 700, uppercase, +2% tracking), 20px square ink glyph, favicon set.
Icons: Lucide subset — approximately 18 glyphs.

---

## 16. Decisions / recommendations / optional / future / unresolved

**Decisions (implement):** Quiet Bureau territory · Nib mascot · `#F4F0E8` as canvas *and* keying colour · Archivo + IBM Plex Mono + Source Serif 4 · sharp 2px radii · borders not shadows · single `--colour-occasion-active` indirection · `data-sensitivity` on `<body>` · per-type outfit via worn accessories · manifest-resolved assets, never hard-coded filenames.

**Recommendations (adopt unless there is a reason not to):** ship MVP with the 12 core states plus the hero and avatar alternates only · keep the character out of the interview flow on mobile entirely · put the "changed since last draft" marker in `highlight`.

**Optional alternatives:** a dark-background variant set (not needed for MVP — no dark surfaces host the character) · an `animationReady` two-frame loop for `generating` only.

**Future phase (do not build now):** business tier styling · localisation · white-label theming · per-type artwork beyond best man · the two-figure `joint-bride-and-groom` composition.

**Unresolved questions:** none. All items closed as of 2026-07-30.

**Resolved 2026-07-30:** Nib confirmed as the character — Batch 1 may proceed. The source list's "30th – 100th" range is one type, `special-birthdays`, labelled **Special Birthdays** and parameterised by `milestoneAge` (30–100, step 10): one slug, one outfit, one asset set, one accent. The age drives copy only — "Special Birthdays" in the picker, "60th birthday speech" in project titles and headings. 18th and 21st remain separate types. `proposal-speech` and `marriage-proposal-speech` are kept as two distinct types: the first is the semi-public engagement toast (warm tier, playfulness 1), the second the private words said at the moment of proposing (sensitive tier, playfulness 0). `head-student-speech` is **removed** from the approved universe — the safeguarding burden of a minor as speaker is out of scope.

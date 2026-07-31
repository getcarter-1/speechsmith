# Speechsmith — Component Specification (MVP)

Token names are authoritative. Where a value is written as a token (`space-4`, `colour.text.muted`) the implementation must reference the CSS variable, never the literal.

Shared conventions for every component below:
- **Focus:** 2px `border.focus` outline, 2px offset. Never suppressed.
- **Touch:** all interactive elements ≥ `touchTarget.minimum` (44px), ≥8px apart.
- **Radius:** `radius-card` (2px) on containers, `radius-control` (2px) on controls. No exceptions except the progress track.
- **Elevation:** 1px `border.default` on surface containers. Shadows only where stated.
- **Disabled:** `colour.text.faint` text, `colour.background.sunken` fill, `border.subtle`, `cursor: not-allowed`, `aria-disabled`.

---

## 1. SiteHeader

**Purpose** Persistent identity and escape hatch. Nothing more.
**Anatomy** ink square glyph 20px · wordmark (`sectionTitle`, uppercase, +2% tracking) · nav links (`label`) · primary action button.
**Variants** `marketing` (nav + "Start a speech") · `app` (project name + account menu).
**States** default · scrolled (adds bottom `border.default`) · mobile (glyph + wordmark + single icon button).
**Tokens** bg `background.surface`, bottom border `border.default`, height 56px mobile / 64px desktop, padding-x `container.gutter`.
**Interaction** sticky, `z-sticky`. No hide-on-scroll.
**Mobile** wordmark only; nav collapses to a menu button (44px).
**Desktop** full nav, right-aligned, `space-5` between links.
**A11y** `<header>` + `<nav aria-label="Main">`; wordmark links home; skip-to-content link precedes it.
**Character** **Never.**

---

## 2. HomepageHero

**Purpose** State who this is for and remove the fear in one screen.
**Anatomy** occasion eyebrow (`label`, occasion colour) · headline (`displayHeadline`) · subhead (`body`, max 42ch) · CTA pair · reassurance line (`annotation`) · character column.
**Variants** `best-man` (MVP). Future variants change eyebrow, headline and character outfit only.
**States** default · reduced (`data-sensitivity` ≥ formal collapses the character column and centres the text).
**Tokens** bg `background.surface`, right column bg `background.canvas`, dividing 1px `border.default`, padding `space-10` mobile / `space-16` desktop, gap `space-4` between text elements.
**Typography** as anatomy. Headline `text-wrap: balance`.
**Interaction** none beyond the CTAs.
**Mobile** single column, character above the eyebrow at `illustration.heroMobile` (200px) centred, portrait crop.
**Desktop** 1.5fr / 1fr grid; character column full-bleed to the grid edge with the `16:9` hero crop, `illustration.hero` max.
**A11y** headline is the `<h1>`. Character uses manifest `altText` (meaningful, not decorative).
**Character** `welcome`, `size="hero"`, `decorative={false}`.

---

## 3. PrimaryCTA

**Purpose** The single most important action on a screen. One per view.
**Anatomy** label, optional 20px leading icon.
**Variants** `accent` (default, `brand.accent` fill) · `ink` (`brand.ink` fill — used in the app chrome where accent is already the progress colour).
**States** default · hover (`brand.accentStrong`) · active (same, 1px inset) · focus · disabled · loading (label swaps to "Working…", `aria-busy`, no spinner).
**Tokens** text `text.onAccent`, `type.button`, padding `space-3` `space-5`, min-height 44px, radius `radius-control`.
**Interaction** 120ms `standard` on `background-color`.
**Mobile** full width, `type.button` at 16px.
**Desktop** intrinsic width, 15px.
**A11y** real `<button>`; never a div. Loading state announced politely.
**Character** Never.

---

## 4. SecondaryCTA

**Purpose** The alternative path — always non-committal ("Read an example", "Skip").
**Anatomy** label, optional icon.
**Variants** `outline` (1px `border.ink`, transparent fill) · `quiet` (text only, `text.muted`).
**States** default · hover (`background.accentSubtle`) · active · focus · disabled.
**Tokens** text `text.primary`, `type.button`, padding `space-3` `space-5` (1px less to compensate for the border).
**Mobile** full width below the primary CTA, `space-2` gap. Never side-by-side below 414px.
**Desktop** inline after the primary, `space-3` gap.
**A11y** as PrimaryCTA. `quiet` variant must still meet 4.5:1.
**Character** Never.

---

## 5. ProjectCard

**Purpose** One speech in progress, on the dashboard.
**Anatomy** occasion eyebrow (`label`, occasion colour) · title (`cardTitle`) · subject line (`bodySmall`, `text.muted`) · progress meter · status chip · relative timestamp (`annotation`).
**Variants** `in-progress` · `draft-ready` (status chip in `semantic.successSurface`) · `complete`.
**States** default · hover (`border.strong`) · focus-within · pressed.
**Tokens** bg `background.surface`, 1px `border.default`, padding `space-5`, internal gap `space-3`.
**Interaction** whole card is one link; hover changes border only, never lifts.
**Mobile** full width, stacked list, `space-3` between cards.
**Desktop** 3-up grid at `app` width, `space-5` gap.
**A11y** title is the link text; the card is not a nested-interactive trap — the status chip is not a button.
**Character** Never. Status is text.

---

## 6. InterviewPromptCard

**Purpose** Ask one question. The most-used surface in the product.
**Anatomy** progress header (avatar + counter + track) · question (`conversationalPrompt`) · helper line (`helperText`, `text.muted`) · quick-answer chips · free-text field · action row (Next + Skip).
**Variants** `chips-and-text` (default) · `text-only` · `chips-only` · `media` (delegates to MediaUploadCard).
**States** default · answered (Next becomes `accent`) · saving (`annotation` "Saved" after 400ms) · error.
**Tokens** bg `background.surface`, 1px `border.default`, padding `space-5`, gap `space-4`; header separated by 1px `border.default`.
**Typography** question `conversationalPrompt`; helper `helperText`; never place the question in the reading serif — it is interface, not speech.
**Interaction** chips toggle instantly (120ms); Enter submits from the text field only with ⌘/Ctrl; question changes without animation.
**Mobile** full width at `container.gutter`; action row sticky to the bottom of the viewport when the field is focused; question at 23px.
**Desktop** `container.form` (540px) centred, with the `listening` character in a 260px left rail.
**A11y** question is an `<h2>` and the field's accessible name via `aria-labelledby`; chips are `role="listbox"` + `role="option"` with arrow-key traversal and `aria-selected`; progress uses `role="progressbar"` with `aria-valuenow`/`max`; "Question 6 of 18" is real text, not only a bar.
**Character** `listening`, `size="panel"` in the desktop rail (static across questions), `size="avatar"` in the mobile header. Hidden entirely at `data-sensitivity` ≥ sensitive.

---

## 7. QuickAnswerChip

**Purpose** Lower the cost of answering — a tap instead of a sentence.
**Anatomy** label, optional 16px leading icon, no close affordance.
**Variants** `single-select` · `multi-select` (adds a check icon when selected).
**States** default (`background.canvas`, 1px `border.default`) · hover (`border.strong`) · selected (1px `border.accent`, `background.accentSubtle`, `text.primary`) · focus · disabled.
**Tokens** `bodySmall` in `font.family.mono` at 12px, padding `space-2` `space-3`, min-height 44px, radius `radius-control`.
**Interaction** 120ms `standard`. Selecting never advances the question.
**Mobile** wrapping flex, `space-2` gap.
**Desktop** identical.
**A11y** selection is not colour-only — selected chips carry a check icon and `aria-selected="true"`.
**Character** Never.

---

## 8. FreeTextAnswerField

**Purpose** Where the actual material arrives. Must feel low-stakes.
**Anatomy** textarea · placeholder in `text.faint` · optional character-count `annotation` (only above 400 characters) · autosave indicator.

**Voice sample is paste-only in MVP.** No audio recording, no speech-to-text. The affordances are a textarea and a "Paste from clipboard" button; audio capture is future-phase and must not be implied in copy.
**Variants** `short` (3 rows) · `long` (6 rows, autogrow to 16).
**States** default (`background.sunken`, 1px `border.strong`) · focus (1px `border.accent` + focus ring) · filled · error (`semantic.dangerBorder` + message) · saving.
**Tokens** `body` at 16px minimum (prevents iOS zoom), padding `space-3`, line-height 1.6.
**Interaction** autogrow; autosave debounced 800ms; never blocks typing; no word-count pressure.
**Mobile** 16px font mandatory; action row lifts above the keyboard.
**Desktop** identical, max-width `container.form`.
**A11y** real `<label>` (visually the question); errors via `aria-describedby` + `role="alert"`; placeholder is never the only label.
**Character** Never.

---

## 9. ProgressIndicator

**Purpose** Show how much is left. The only moving element in the interview.
**Anatomy** counter (`label`, e.g. "Q06 / 18") · 2px track · optional step name.
**Variants** `interview` (2px, `brand.accent` fill) · `generation` (4px, determinate) · `review` (segments, one per draft section).
**States** determinate only. No indeterminate variant.
**Tokens** track `background.sunken`, fill `brand.accent`, radius `radius-pill`, height 2px / 4px.
**Interaction** 320ms `standard` width transition; instant under reduced motion.
**Mobile** full width under the counter.
**Desktop** identical; `review` variant sits in the sticky action bar.
**A11y** `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`. The counter text is required — the bar alone is insufficient.
**Character** Never.

---

## 10. StoryCard

**Purpose** A captured memory, reviewable and editable.
**Anatomy** source badge (`label` — "You said" / "From a photo" / "From a message") · excerpt (`bodySmall`, 3-line clamp) · tag row · edit and remove icon buttons.
**Variants** `text` · `media-derived` (adds 40px thumbnail) · `flagged` (1px `semantic.warningBorder`, warning icon + reason text).
**States** default · hover · expanded (full text) · removed (fades to 0.5 opacity for one undo cycle).
**Tokens** bg `background.surface`, 1px `border.default`, padding `space-4`, gap `space-2`.
**Interaction** click expands; remove is undoable for 8 seconds via a toast.
**Mobile** full width; icon buttons 44px.
**Desktop** 2-up grid.
**A11y** `<article>` in an `<ol>`; icon buttons have `aria-label`; flag reason is text, never an icon alone.
**Character** Never.

---

## 11. MediaUploadCard

**Purpose** Accept photos, voice notes and message screenshots without anxiety.
**Anatomy** heading (`sectionTitle`) · explanation (`body`) · dropzone (2px dashed `border.strong`) · accepted-formats line (`annotation`) · file list · character (desktop only).
**Variants** `empty` · `has-files` · `uploading` · `error`.
**States** idle · drag-over (`background.accentSubtle`, `border.accent`, `shadow-raised`) · uploading (per-file determinate bar) · partial failure (per-file retry, never a whole-batch failure).
**Tokens** dropzone min-height 160px, padding `space-6`, radius `radius-card`.
**Interaction** drag-drop plus a visible "Choose files" button — drag is never the only route.
**Mobile** button only, no dropzone; character hidden.
**Desktop** dropzone + `media-review` character at `illustration.inline` to its left.
**A11y** the dropzone contains a real `<input type="file">`; upload progress in `aria-live="polite"`; each file row names its own state in text.
**Character** `media-review`, `size="inline"`, decorative. Desktop only.

---

## 12. CharacterTransitionPanel

**Purpose** Mark a genuine phase change (interview → generation → review). The only place the character changes state visibly.
**Anatomy** character · phase title (`sectionTitle`) · one-line explanation (`body`) · continue action.
**Variants** `milestone` (inline, in flow) · `interstitial` (full-panel, between steps).
**States** entering · settled. No looping.
**Tokens** bg `background.canvas`, padding `space-10`, gap `space-5`, centred, max-width `container.form`.
**Interaction** 200ms `enter` opacity fade on the character only — no movement, no scale. Under reduced motion, no fade.
**Mobile** character at ≤180px, or hidden below 414px with title and explanation retained.
**Desktop** character at `illustration.panel`.
**A11y** the phase change is announced in an `aria-live="polite"` region as text; the panel is never a focus trap.
**Character** state per phase (`story-gathering`, `generating`, `draft-ready`), decorative.

---

## 13. GenerationState

**Purpose** Hold the user's attention honestly during the longest wait in the product.
**Anatomy** character · determinate progress bar · current-step text (`body`) · elapsed hint (`annotation`) · cancel (quiet secondary).
**Variants** `full-page` (first draft) · `inline` (single-section rewrite, no character).
**States** working · slow (past 20s, adds "This one's taking a little longer — still going") · failed → RecoverableErrorState.
**Tokens** bg `background.canvas`, centred, gap `space-5`; bar 4px, `container.form` wide.
**Interaction** the bar moves; nothing else does. No skeleton shimmer, no pulsing character.
**Mobile** character ≤180px above the bar.
**Desktop** character at `illustration.panel` above the bar.
**A11y** step text in `aria-live="polite"`; `role="progressbar"` with `aria-valuetext`; cancel is keyboard-reachable at all times.
**Character** `generating`, `size="panel"`, decorative. The only asset with `animationReady: true` (optional two-frame loop, ≤0.5Hz, disabled under reduced motion).

---

## 14. DraftSectionCard

**Purpose** One passage of the speech, with a decision attached. The core review unit.
**Anatomy** section label (`label` — "Opening", "The story", "Toast") · speech text (`speechEditorText`, reading serif) · decision controls · rewrite note (when present) · warning panel (when flagged).
**Variants** `undecided` (1px `border.default`) · `good` (1px `semantic.successBorder`, check icon + "Kept") · `dropped` (0.5 opacity, `background.sunken`, cross icon + "Dropped") · `rewriting` (1px `border.accent`) · `flagged`.
**States** default · hover (`border.strong`) · focus-within · decided.
**Tokens** bg `background.surface`, padding `space-5` `space-6`, text max-width `container.reading`, gap `space-4`.
**Typography** the speech text is the **only** place `font.family.reading` appears in the review flow — it must look like a speech, not an app.
**Interaction** decisions apply instantly and are undoable; 200ms `exit` opacity on drop; the card never collapses or reorders on decision.
**Mobile** full width; decision controls become a 3-up equal-width row, each ≥44px.
**Desktop** decision controls inline right of the section label.
**A11y** `<article>` with the section label as `<h3>`; the decision group is a `role="group"` with `aria-label="Decision for {section}"`; state is announced in text ("Kept", "Dropped"), never colour alone.
**Character** **Never.** The user is reading — nothing competes.

---

## 15. GoodButton

**Purpose** Keep this passage.
**Anatomy** check icon (20px) + label "Good".
**Variants** none.
**States** default (`outline`, `border.default`) · hover (`semantic.successBorder`, `semantic.successSurface`) · selected (`semantic.successSurface` fill, `semantic.successText`, `aria-pressed="true"`) · focus.
**Tokens** `type.button`, padding `space-2` `space-4`, min-height 44px.
**Interaction** toggle; selecting deselects Drop/Rewrite.
**Mobile** one third of the decision row.
**Desktop** intrinsic width.
**A11y** `aria-pressed`; icon + text always both present.
**Character** Never.

---

## 16. DropButton

Identical to GoodButton except: cross icon + label "Drop"; selected uses `semantic.dangerSurface` / `semantic.dangerText` / `semantic.dangerBorder`; selecting applies a 200ms `exit` fade to the parent card body to 0.5 opacity and reveals an "Undo" quiet button in the section label row.

---

## 17. RewriteButton

Identical to GoodButton except: pencil icon + label "Rewrite"; selected uses `background.accentSubtle` / `brand.accent` / `border.accent`; selecting expands RewriteNoteField below the speech text and moves focus into it.

---

## 18. RewriteNoteField

**Purpose** Capture *why* — the single highest-value input in the review flow.
**Anatomy** label ("What should change?", `label`) · 2-row autogrow textarea · 3–4 suggestion chips ("Too long", "Not my voice", "Cut the joke", "More about her") · submit ("Rewrite this bit") · cancel (quiet).
**Variants** `section` · `whole-speech`.
**States** default · focus · submitting (`aria-busy`) · error.
**Tokens** bg `background.sunken`, 1px `border.strong`, padding `space-4`, `annotation` for the note text, gap `space-3`.
**Interaction** chips append text to the field rather than replacing it; ⌘/Ctrl+Enter submits.
**Mobile** submit full width; chips wrap.
**Desktop** submit inline right.
**A11y** real label; chips are buttons that mutate the field, not options; submission result announced politely.
**Character** Never.

---

## 19. WarningPanel

**Purpose** Flag something that may land badly, without moralising or blocking.
**Anatomy** avatar-size character (desktop) or warning icon (mobile) · reason (`bodySmall`) · two actions ("Keep it as is" / "Soften this").
**Variants** `advisory` (default, `semantic.warningSurface`) · `sensitive` (`background.sunken`, no character, no humour, `data-sensitivity` ≥ formal).
**States** default · dismissed (collapses to a `label` "Flag dismissed" with an undo).
**Tokens** 1px `semantic.warningBorder`, padding `space-4`, gap `space-3`, radius `radius-card`.
**Interaction** never blocks; both actions are equally weighted (no primary CTA); 200ms `enter` opacity on mount.
**Mobile** icon + text stacked; character hidden.
**Desktop** 48px character left of the text.
**A11y** `role="status"` (not `alert` — it is advisory); the reason is always full text; the character is `aria-hidden`, and removing it must not change meaning.
**Character** `safety-check`, `size="avatar"`, decorative, desktop only. Never in the `sensitive` variant.

---

## 20. FinalSpeechReader

**Purpose** Read it, print it, rehearse it. Nothing else.
**Anatomy** minimal top bar (back, word count, estimated speaking time, export) · speech body (`speechReaderText`) · rehearsal controls (font size stepper, line-focus toggle).

**Speaking-rate constant.** Every duration shown anywhere in the product derives from **130 words per minute** — the pace of someone reading aloud to a room, not conversational speed (~150) and not a trained speaker (~110). Define it once as `SPEAKING_WORDS_PER_MINUTE = 130` and derive every figure: 3 min = 390 words, 5 min = 650, 7 min = 910. Never hard-code a word count next to a duration.
**Variants** `screen` · `print` (see below) · `rehearsal` (larger text, increased leading, single paragraph in focus).
**States** default · line-focus active.
**Tokens** bg `background.canvas`, text max-width `container.reading`, paragraph spacing `space-6`, padding-x `container.gutter`.
**Typography** `speechReaderText` only. No headings inside the speech. No accent colour anywhere in the body.
**Interaction** font-size stepper adjusts 19→28px in 3px steps, persisted in `localStorage`.
**Mobile** 19px base; controls in a sticky bottom bar.
**Desktop** 22px base; controls top-right.
**Print** letter/A4, 12pt minimum, serif, no UI chrome, page numbers, speaker's name in the running header.
**A11y** the speech is one `<article>` of `<p>` elements; the font stepper is two buttons with `aria-label`; no `aria-live` here — the text is static.
**Character** **Never.** This is the product's most sacred surface.

---

## 21. EmptyState

**Purpose** Explain what goes here and give exactly one way to start.
**Anatomy** character · heading (`sectionTitle`) · explanation (`body`, max 48ch) · single primary CTA.
**Variants** `dashboard-empty` · `stories-empty` · `search-no-results` (no character).
**States** static.
**Tokens** bg `background.canvas`, centred, padding `space-12`, gap `space-4`, max-width `container.form`.
**Mobile** character ≤180px.
**Desktop** character at `illustration.panel` (260px).
**A11y** heading is the section's `<h2>`; character decorative; the CTA is the only interactive element.
**Character** `empty-project`, `size="panel"`, decorative. Hidden under `sensitive` tiers.

---

## 22. RecoverableErrorState

**Purpose** Take responsibility, confirm nothing was lost, offer the retry.
**Anatomy** character (desktop) · heading (`sectionTitle`) · plain-language cause (`body`) · reassurance ("Your answers are saved") · retry primary CTA · quiet "Get help" link.
**Variants** `inline` (within a card) · `page` (whole route).
**States** default · retrying (`aria-busy`).
**Tokens** bg `background.surface`, 1px `semantic.dangerBorder`, padding `space-6`, gap `space-4`. Text is `text.primary`, **not** danger red — only the border carries the semantic colour.
**Interaction** retry is always available; no auto-retry loops.
**Mobile** character hidden; text and retry only.
**Desktop** character at `illustration.inline` left of the text.
**A11y** `role="alert"`; the cause is human-readable, never a stack trace or code; retry is the first focusable element.
**Character** `error-recovery`, `size="inline"`, decorative, desktop only. **Never** on an unrecoverable error — a mascot beside unrecoverable data loss reads as mockery.

---

## Page-level implementation maps

Character placement is stated explicitly. Anywhere unstated, the character does not appear.

```
HomePage
├── SiteHeader (variant="marketing")            ✗ character
├── HomepageHero                                ✓ welcome / hero
├── HowItWorksSection                           ✗
├── ExampleSpeechSection                        ✗
└── SiteFooter                                  ✗

AuthPage (login | signup)
├── SiteHeader (variant="marketing")            ✗
└── AuthCard                                    ✗ character — never
    ├── AuthForm
    └── AuthAlternateLink

DashboardPage
├── SiteHeader (variant="app")                  ✗
├── DashboardHeader
├── ProjectGrid
│   └── ProjectCard × n                         ✗
└── EmptyState (when no projects)               ✓ empty-project / panel

NewProjectPage
├── SiteHeader (variant="app")                  ✗
├── SpeechTypePicker                            ✗
├── SubjectDetailsForm
└── PrimaryCTA
      (sets body[data-occasion] and body[data-sensitivity] on submit)

GuidedInterviewPage
├── SiteHeader (variant="app")                  ✗
├── InterviewRail (desktop ≥lg only)            ✓ listening / panel — static
├── ProgressIndicator (variant="interview")
├── InterviewPromptCard                         ✓ listening / avatar (mobile header only)
│   ├── QuickAnswerChip × n
│   ├── FreeTextAnswerField
│   └── InterviewActionRow
└── InterviewMilestonePanel (every 6th answer)  ✓ story-gathering / panel — desktop only

MediaUploadPage
├── SiteHeader (variant="app")                  ✗
├── MediaUploadCard                             ✓ media-review / inline — desktop only
└── StoryList
    └── StoryCard × n                           ✗

WritingSamplePage
├── SiteHeader (variant="app")                  ✗
├── WritingSampleStep                           ✓ writing / inline — desktop only
│   ├── FreeTextAnswerField (variant="long")
│   └── SecondaryCTA ("Skip this")
└── ProgressIndicator

DraftGenerationPage
└── GenerationState (variant="full-page")       ✓ generating / panel

DraftReviewPage
├── SiteHeader (variant="app")                  ✗
├── DraftReviewHeader                           ✓ editing / avatar (48–56px max)
├── ReviewProgress (variant="review")
├── SpeechSectionList
│   └── DraftSectionCard × n                    ✗ character — never
│       ├── SectionText
│       ├── SectionDecisionControls
│       │   ├── GoodButton
│       │   ├── DropButton
│       │   └── RewriteButton
│       ├── RewriteNoteField (conditional)
│       └── WarningPanel (conditional)          ✓ safety-check / avatar — desktop only
└── ReviewActionBar (sticky)                    ✗

FinalOutputPage
├── SiteHeader (variant="app")                  ✗
├── FinalOutputConfirmation                     ✓ complete / inline
├── FinalSpeechReader                           ✗ character — never
└── ExportActionBar                             ✗
```

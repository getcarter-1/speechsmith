# Speechsmith — Visual QA Checklist

Run before any release and after any change to tokens, the character component, or a page layout. Every box must be ticked or explicitly waived with a reason.

## Tokens

- [ ] No hex, rgb or hsl literal appears anywhere in `src/` except `tokens.css`
- [ ] No colour is used that is absent from `brand-tokens.json`
- [ ] `#FFFFFF` appears only as overlay surface — never as a page background
- [ ] Every spacing value resolves to a `--space-*` token; no arbitrary `13px`, `18px`, `p-[7px]`
- [ ] Every radius is `radius-none`, `radius-sharp`/`card`/`control`/`avatar` (2px) or `radius-pill` (progress track only)
- [ ] Shadows appear only on the drag-over media card (`shadow-raised`) and modals (`shadow-overlay`)
- [ ] Components reference `--colour-occasion-active`, never a named occasion colour
- [ ] `brand.highlight` is used only for warnings and the changed-since-last-draft marker

## Typography

- [ ] Only three families in use: Archivo, IBM Plex Mono, Source Serif 4
- [ ] Source Serif 4 appears **only** in speech text (editor + reader + print)
- [ ] IBM Plex Mono carries no body copy — labels, counters and annotations only
- [ ] Exactly one `<h1>` per route, and it is the page title
- [ ] Heading order never skips a level
- [ ] Interview question uses `conversationalPrompt`, not the reading serif
- [ ] No prose line exceeds 68ch; speech text is capped at `container-reading`
- [ ] Mobile body and input text is ≥16px (no iOS zoom on focus)
- [ ] Fallback stacks render acceptably with web fonts blocked

## Character

- [ ] Rendered state matches the product state per `COMPONENT_CHARACTER_MAP`
- [ ] At most **one** character instance visible per viewport at every breakpoint
- [ ] No character in: SiteHeader, DraftSectionCard, FinalSpeechReader, decision controls, login, signup, payment, unrecoverable error
- [ ] No character on any `religious-cultural` speech-type surface
- [ ] Character is static between interview questions
- [ ] No filename string appears outside `asset-manifest.json`
- [ ] Missing asset renders the placeholder, not a broken image, and does not collapse layout
- [ ] Rendered width respects the asset's `minRenderedPx` / `maxRenderedPx`
- [ ] No asset is upscaled beyond its master resolution
- [ ] Identity holds across all 12 states: proportions, line weight, eye placement, no mouth
- [ ] Character silhouette is still recognisable with the outfit removed

## Sensitivity modes

- [ ] `data-sensitivity` on `<body>` matches the active speech type's tier
- [ ] `sensitive` and `culturally-reviewed` hide every `data-decorative-illustration` element
- [ ] Character scale downshifts correctly: 1.0 / 1.0 / 0.7 / 0.45 / 0.45
- [ ] No humour in microcopy at `warm` or stricter
- [ ] No props on the character at `sensitive` or stricter
- [ ] No motion at `sensitive` or stricter
- [ ] No religious garment, symbol, ritual object or cultural dress in any asset
- [ ] Every sensitive surface remains fully comprehensible with all images removed

## Responsive

- [ ] 360, 414, 768, 1024 and 1440 all render without horizontal scroll
- [ ] Layout stacks at `md` and below on every route except FinalSpeechReader
- [ ] Content never exceeds `container-app`; extra width becomes margin
- [ ] States marked hidden on mobile render nothing (not 0 opacity, not 1px)
- [ ] Interview action row remains reachable above the mobile keyboard
- [ ] Crops preserve the focal point — hands, notebook and eye plate are never clipped
- [ ] Portrait, square, hero and avatar crops each use the intended manifest asset, not a stretched square
- [ ] Sticky headers and action bars do not overlap content at 360px

## Accessibility

- [ ] All body and label text ≥4.5:1; text ≥24px ≥3:1
- [ ] All nine occasion accents verified ≥4.5:1 on canvas and on surface
- [ ] Every route completable with keyboard only
- [ ] Focus visible on canvas, surface and inverse backgrounds; never suppressed
- [ ] Quick-answer chips traversable with arrow keys, with `aria-selected`
- [ ] Touch targets ≥44px with ≥8px separation
- [ ] Decorative characters have `alt=""` + `aria-hidden="true"`
- [ ] Meaningful characters (`welcome`, `draft-ready`) have non-empty manifest alt text
- [ ] Good / Drop / Rewrite each carry icon **and** text label, not colour alone
- [ ] Every form field has a real programmatic label; placeholder is never the only label
- [ ] Errors are text, adjacent to the field, announced via `role="alert"`
- [ ] Generation progress announced via `aria-live="polite"` with `aria-valuetext`
- [ ] `prefers-reduced-motion` zeroes all transitions and disables the `generating` loop
- [ ] No information is carried by colour alone anywhere in the product
- [ ] axe reports zero violations on all 10 routes

## Motion

- [ ] No animation exceeds 480ms
- [ ] No continuous or idle character movement
- [ ] No animation on interview question change
- [ ] Only opacity and `width`/`translateY` animate — no scale, no rotation, no bounce
- [ ] Nothing requires animation to be understood

## Content and tone

- [ ] Humour appears only on `playful` tier surfaces
- [ ] No emoji anywhere in product copy
- [ ] Error copy names a cause in plain language and confirms nothing was lost
- [ ] No placeholder or lorem text remains in any shipped route
- [ ] Reassurance line present on both the homepage CTA and the first interview screen

## Print (FinalSpeechReader)

- [ ] Exports at letter and A4 without clipping
- [ ] Body text ≥12pt in the reading serif
- [ ] No UI chrome, no accent colour, no character in the printed output
- [ ] Page numbers and speaker name present in the running header

# Speechsmith — Image Generation Briefs

For GPT Image 2 (or equivalent). Follow the batch order — do not start Batch 3 before Batches 1 and 2 are approved, because every MVP state uses the approved images as inputs.

## Constants — repeat verbatim in every prompt

> Flat vector illustration. Uniform-weight dark ink outline (no tapering). One flat mid-tone fill plus one darker shade in the nib slit. No gradients, no texture, no cross-hatching, no painterly shading, no highlights. Completely flat uniform background colour #F4F0E8 with no texture, gradient, grain, vignette, pattern, scenery or cast shadow. Clean hard edge between subject and background. Character centred, all important detail inside the central 75% of the canvas, generous clear space around head plate, hands, held props and feet. Square 1536 × 1536 canvas. No text, no labels, no captions, no speech bubbles, no watermark, no border, no interface elements, no other objects.

## Character constants — repeat verbatim in every prompt

> The character is Nib: a friendly fountain-pen nib with a tapered teardrop body, a central vertical slit and a round breather hole at chest height. Two round dot eyes sit on the upper shoulder plate of the nib, spaced one eye-width apart. It has NO mouth and NO eyebrows — all expression comes from eye shape, plate tilt and posture. Two thin arms with simple mitten hands, two thin legs with simple shoes. Total height about 4.5 head-plate widths. Warm graphite body colour, clearly distinct from the background. Not cute, not chibi, not winking. It is a calm studio assistant who helps write the speech — never the person delivering it.

**Hard prohibitions for every prompt:** no mouth · no eyebrows · no gradients or texture · no changed proportions or line weight · no religious garment, symbol or ritual object · no cultural dress · no trophy, microphone or drink · #F4F0E8 must not appear inside the character · never at a lectern addressing a crowd · never more than two held props.

---

## Batch 1 — Character lock (6 images, review only, not shipped)

Generate all six from the constants above. Approve one as the reference before proceeding.

| Filename | Prompt addition |
|---|---|
| `character-lock-front-neutral-v01` | Front view, standing, arms relaxed at sides, no props, round open eyes, plate upright. |
| `character-lock-three-quarter-neutral-v01` | Three-quarter view turned 30° to its left, standing, arms relaxed, no props, round open eyes. |
| `character-lock-side-neutral-v01` | Full side profile facing left, standing, arms relaxed, no props, one eye visible. |
| `character-lock-front-welcoming-v01` | Front view, one hand raised in a small open-palm greeting at waist height, eyes slightly softened, plate tilted 5° toward the viewer. |
| `character-lock-three-quarter-thinking-v01` | Three-quarter view, one mitten hand resting near the shoulder plate as if considering, eyes narrowed slightly, plate tilted 10° upward. |
| `character-lock-turnaround-sheet-v01` | Contact sheet exception: front, three-quarter and side views side by side on one canvas, evenly spaced, no labels. |

**Approve on:** consistent proportions across all six · slit and breather hole in the same relative position · eye spacing identical · line weight identical · no mouth has appeared · silhouette readable at 40px.

---

## Batch 2 — Best man outfit lock (3 images, review only)

Use the approved Batch 1 reference as an image input. Same pose in all three (three-quarter view, standing, notebook held low in the right hand) so only the outfit varies.

| Filename | Outfit |
|---|---|
| `character-best-man-outfit-a-v01` | Charcoal morning-suit waistcoat with a slim buttonhole flower, worn over the nib body. Nothing on the head plate. |
| `character-best-man-outfit-b-v01` | Navy bow tie at the neck of the plate plus a folded pocket square. No waistcoat. |
| `character-best-man-outfit-c-v01` | Rolled shirt sleeves on the arms and a loosened tie — the "an hour before the speech" read. |

Select **one**. Every Batch 3 image uses the selected outfit and must not reinterpret it.

---

## Batch 3 — The twelve MVP states

Every prompt: constants + character constants + approved Batch 1 reference + selected Batch 2 outfit as image inputs, then the state addition below. State the filename immediately before presenting each image.

| Filename | Pose, expression, props |
|---|---|
| `character-best-man-welcome-v01` | Three-quarter view, weight settled, notebook held low in one hand, round open eyes toward the viewer, plate upright. Warm and unhurried. |
| `character-best-man-listening-v01` | Three-quarter view, slight forward lean, open notebook in one hand and a pen poised over it in the other, eyes turned slightly off to the side as if listening. Attentive, patient. |
| `character-best-man-story-gathering-v01` | Seated three-quarter view on a simple stool, notebook open on one knee, mid-note with the pen touching the page, eyes down on the page, plate tilted down 15°. Quietly engaged. Two props maximum: notebook and pen. |
| `character-best-man-media-review-v01` | Front view, holding a single blank photograph at chest height angled slightly toward the viewer without covering the eye plate. Eyes softened, plate tilted 10°. Curious and careful. One prop only. |
| `character-best-man-writing-v01` | Side view facing left at a small plain desk, writing in a notebook, shoulders low. Absorbed, calm — not frowning. Props: notebook, pen, and one simple desk lamp. |
| `character-best-man-editing-v01` | Three-quarter view, a pencil held up in one hand and a single blank page in the other, eyes toward the viewer rather than the page, plate tilted 5°. Collaborative, asking. |
| `character-best-man-safety-check-v01` | Front view, one mitten hand raised palm-up at waist height in a "let's pause" gesture. Level round eyes, plate upright. Candid and protective — NOT alarmed, NOT winking. No props. |
| `character-best-man-generating-v01` | Side view facing left, sleeves pushed up, both hands working over several blank pages spread on a plain surface, plate turned away from the viewer. Purposeful work. Props: spread pages and a pen. |
| `character-best-man-draft-ready-v01` | Front view, extending a small sheaf of blank pages toward the viewer with both hands, round open eyes, plate tilted 5° toward the viewer. Quietly pleased, handing something over. One prop. |
| `character-best-man-complete-v01` | Three-quarter view, hands empty and relaxed at sides, a slight step back, eyes softened, plate upright. Satisfied and stepping away. No props. |
| `character-best-man-empty-project-v01` | Front view, closed notebook held at one side, arms otherwise relaxed, neutral round eyes, plate upright. Inviting and patient — not disappointed. One prop. |
| `character-best-man-error-recovery-v01` | Three-quarter view, one hand gesturing open-palm to its own left as if indicating a way forward, eyes slightly narrowed, plate tilted 5°. Apologetic but composed — NOT distressed, NOT comic. No props. |

---

## Batch 4 — Responsive alternatives

Recompose, do not stretch or crop. Same identity, same outfit, new composition for the frame.

| Filename | Canvas | Composition |
|---|---|---|
| `character-best-man-welcome-portrait-v01` | 1280 × 1600 (4:5) | Vertical composition, character full-body, more headroom above the plate, feet inside the lower 12%. |
| `character-best-man-welcome-hero-v01` | 1920 × 1080 (16:9) | Character positioned in the right third, full body, facing slightly left into the empty left two-thirds. Left 20% completely empty background. |
| `character-best-man-listening-avatar-v01` | 1024 × 1024 (1:1) | Tight crop: head plate and shoulders only, centred, eyes at 45% height, readable at 40px. No hands, no props. |

---

## Quality checks before presenting any asset

Identity matches the approved reference · outfit matches the selected lock · no facial-construction drift (eye spacing, slit and breather-hole position) · line weight and shading consistent · prop count correct and within the permitted list · mitten hands plausible · no text has appeared · background is one flat uniform #F4F0E8 with no texture · safe crop intact (all detail inside the central 75%) · readable at 40px · no mouth or eyebrows have appeared · no wedding or cultural stereotype added · the character reads as the speechwriting accomplice, not the speech giver.

If any check fails, regenerate before presenting.

## Post-production

1. Key out `#F4F0E8`, feathering ≤1px, and export a transparent PNG master at full resolution.
2. Export WebP at 1536, 1024, 512 and 256 for each asset; optional AVIF derivative.
3. Verify no `#F4F0E8` remains inside the figure (it would punch a hole).
4. Fill in `focalPoint` in `asset-manifest.json` from the actual artwork if it differs from the value already recorded.
5. Verify each asset against its manifest `suitableCrops` at `minRenderedPx`.

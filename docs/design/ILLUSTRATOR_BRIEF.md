# Speechsmith — Illustrator Brief

**Commissioning document.** For a freelance illustrator quoting on the Speechsmith character system.
Version 1.0.0 · 30 July 2026 · Contact: [to be filled in]

---

## 1. What we're making

Speechsmith is a web app that helps someone write a speech they have to stand up and deliver — a best man speech first, later father-of-the-bride, retirement, graduation and around forty other occasions. The product's job is removing dread, not creating excitement.

We need a small recurring character called **Nib** who appears throughout the interface in twelve defined states. He is a *speechwriting accomplice* — the person who helps you write it — never the person delivering it. He is the studio assistant, not the star.

The character sits inside a deliberately restrained interface: warm paper background, cool near-black ink, hairline rules, no shadows, no gradients, no rounded corners. He must feel like he belongs in a well-set printed document.

**The hardest constraint:** the same character has to be acceptable on a stag-do speech and on a bar mitzvah tribute. He can never be jokey, never cute, never celebratory in himself. All the warmth comes from posture and eye shape.

---

## 2. What Nib is

A friendly **fountain-pen nib** with simple limbs. Non-human by decision — a human figure would imply an age, gender and ethnicity that every future speech type inherits, and would make bereavement-adjacent and religious occasions unusable.

### Permanent identity — must be identical in every asset

- Tapered teardrop nib body with a central vertical slit and a round breather hole at chest height
- Two round dot eyes on the upper shoulder plate of the nib, spaced one eye-width apart
- **No mouth. No eyebrows.** All expression comes from eye shape, plate tilt and posture
- Two thin arms with simple mitten hands; two thin legs with simple shoes
- Total height ≈ 4.5 head-plate widths
- Uniform-weight outline — no tapering, no brush modulation
- One flat mid-tone body fill plus one darker shade inside the slit. Nothing else
- Warm graphite body colour, always clearly distinct from the page background

### Permitted variation

Pose · eye shape (open / narrowed / softened) · plate tilt · outfit and worn accessories · held props (maximum two) · limb position.

### Prohibited — non-negotiable

A mouth · eyebrows · changed proportions or plate size · gradients, texture, cross-hatching, painterly shading, highlights · varied or tapered line weight · cuteness, chibi proportions, bouncing, winking · religious garments, symbols or ritual objects · cultural dress used as decoration · trophies, microphones or drinks · the background colour appearing anywhere inside the figure · depiction at a lectern addressing a crowd.

### Tone

Calm, competent, unhurried. Someone who has done this many times and is not going to make a fuss about it. Dry rather than warm; never performing.

---

## 3. Style specification

| | |
|---|---|
| Technique | Flat vector. Outline plus flat fills. |
| Outline | Uniform weight, colour `#22262E`. See §5 for optical sizes. |
| Fills | Body `#7A756B` · slit and inner shadow `#4A463F` · paper and props `#FAF8F3` with `#C9C5B8` edges |
| Outfit accents | `#3E5A7A` (steel blue) and `#7E463A` (wedding accent) only |
| Background | Transparent in the vector masters. Flat `#F4F0E8` in raster exports, no texture or gradient |
| Shadow | None, or one very subtle self-contained ellipse directly beneath the feet. Never soft, never cast onto the background |
| Corners | Sharp or minimally rounded — the interface uses a 2px radius throughout |

The whole system is two greys, one blue and one red-brown. If a state seems to need another colour, it doesn't.

---

## 4. Deliverables

### Milestone 1 — Identity lock (6 drawings + 1 sheet)

Front, three-quarter and side views at neutral, plus welcoming, thinking and a turnaround sheet showing all three angles together. **We approve one canonical reference here before anything else proceeds.** Expect us to be fussy at this stage and relaxed afterwards.

### Milestone 2 — Best man outfit options (3 drawings)

Same pose in all three (three-quarter, standing, notebook held low), so only the outfit varies:
- **A** — charcoal morning-suit waistcoat with a slim buttonhole flower. Nothing on the head plate.
- **B** — navy bow tie at the neck of the plate plus a folded pocket square. No waistcoat.
- **C** — rolled shirt sleeves and a loosened tie — the "an hour before the speech" read.

We select one. Everything after this uses it.

### Milestone 3 — The twelve states (12 drawings)

| State | Pose, expression, props |
|---|---|
| `welcome` | Three-quarter, weight settled, notebook held low in one hand, round open eyes to viewer, plate upright. Warm, unhurried. |
| `listening` | Three-quarter, slight forward lean, open notebook and pen poised over it, eyes turned slightly off to the side as if listening. |
| `story-gathering` | Seated three-quarter on a plain stool, notebook open on one knee, pen touching the page, eyes down, plate tilted down 15°. |
| `media-review` | Front, holding one blank photograph at chest height angled toward viewer without covering the eye plate. Eyes softened, plate tilted 10°. |
| `writing` | Side profile at a small plain desk, writing, shoulders low. Absorbed and calm — not frowning. Props: notebook, pen, one simple desk lamp. |
| `editing` | Three-quarter, pencil held up in one hand, single blank page in the other, eyes to the viewer rather than the page. Asking, collaborative. |
| `safety-check` | Front, one mitten hand raised palm-up at waist height in a "let's pause" gesture. Level eyes, plate upright. Candid and protective — **not** alarmed, **not** winking. No props. |
| `generating` | Side profile, sleeves pushed up, both hands working over several blank pages on a plain surface, plate turned away. Purposeful. |
| `draft-ready` | Front, extending a small sheaf of blank pages toward the viewer with both hands, round open eyes, plate tilted 5° toward viewer. |
| `complete` | Three-quarter, hands empty and relaxed, slight step back, eyes softened, plate upright. Satisfied, stepping away. |
| `empty-project` | Front, closed notebook held at one side, neutral round eyes, plate upright. Inviting and patient — not disappointed. |
| `error-recovery` | Three-quarter, one hand gesturing open-palm to indicate a way forward, eyes slightly narrowed, plate tilted 5°. Apologetic but composed — **not** distressed, **not** comic. |

### Milestone 4 — Optical and format variants (4 drawings)

- **Avatar master** — a deliberately simplified version of `listening`: head plate and shoulders only, heavier relative stroke, fewer internal details, legible at **40px**. Not a scaled-down copy; a redrawn one.
- **Portrait recompose** of `welcome` at 4:5 — more headroom, full body, feet inside the lower 12%.
- **Landscape recompose** of `welcome` at 16:9 — figure in the right third, facing slightly left into empty space; left 20% entirely empty.
- **Second avatar master** of `editing` at the same simplification level.

**Total: 25 drawings across 4 milestones**, of which 16 are production assets and 9 are review-only.

---

## 5. Technical requirements

**Primary format: SVG.** This is the main reason we're commissioning an illustrator rather than generating the artwork. Vector gives us clean rendering at every size with no background-removal step.

- Artboard **1536 × 1536** for square assets (matching viewBox), 1280 × 1600 portrait, 1920 × 1080 landscape
- All important detail inside the **central 75%** of the artboard; generous clear space around head plate, hands, props, feet and all outer edges
- Composition must survive cropping to square, portrait card, circular avatar, mobile panel and desktop hero — do not let hands, notebook, eye plate or props sit near an edge
- **Named layers and named shapes** — we read the SVG in code. `nib-body`, `eye-left`, `eye-right`, `arm-right`, `prop-notebook` and so on. Not `Path 47`.
- Strokes **expanded to outlines** on delivery, plus a working file with live strokes retained
- No clipping masks where a boolean would do; no embedded raster; no text elements
- Optimised SVG (SVGO-safe), no editor metadata, no `<style>` blocks — presentation attributes or inline fills only
- Full-detail masters carry an outline weight of **6 units in a 1536 viewBox**. The avatar masters are drawn at a **512 viewBox with a 10-unit outline** — heavier by design, because a proportionally scaled line disappears at 40px.

**Also deliver per asset:** PNG at 1536 on flat `#F4F0E8`, and PNG at 1536 with transparent background. WebP derivatives are our job, not yours.

**Working files:** native source (`.ai`, `.afdesign`, `.fig` or `.svg` — your choice, stated up front) with layers intact, so we can produce future speech-type outfits ourselves.

**File naming — exactly this pattern:**

```
character-best-man-[state]-v01.svg
character-best-man-welcome-portrait-v01.svg
character-best-man-listening-avatar-v01.svg
character-lock-[view]-[expression]-v01.svg     (milestone 1, review only)
character-best-man-outfit-[a|b|c]-v01.svg      (milestone 2, review only)
```

Lowercase, kebab-case, no spaces, no capitals, no version numbers other than `v01` unless we request a revision (`v02`).

---

## 6. Revisions and process

- **Milestone 1:** up to three rounds included. Identity is everything — every later asset inherits it, so we'd rather spend the time here.
- **Milestones 2–4:** one round of revisions per asset included, covering drift from the approved reference, prop errors and crop-safety problems. Style changes after Milestone 1 approval are a new commission, not a revision.
- Deliver each milestone as a single contact sheet for review before final files, so we can compare assets side by side rather than one at a time.
- Please don't start Milestone 3 before Milestone 2 is signed off in writing.

**Quality checks before you send anything:** identity matches the approved reference · outfit matches the selected option · eye spacing, slit and breather-hole positions unchanged · line weight consistent · prop count correct and within the permitted list · hands plausible · no mouth or eyebrows have appeared · no texture or gradient · safe crop intact · legible at 40px · nothing that reads as a wedding or cultural stereotype · the character still reads as the accomplice, not the speech giver.

---

## 7. Rights

We need **full assignment of copyright** in the delivered artwork, worldwide and in perpetuity, including the right to modify, recolour and extend the character for future speech types without further approval or fee. Moral rights waived to the extent permitted by law. Credit is offered gladly if you want it, and we're happy for it to appear in your portfolio.

Please price on that basis and flag it up front if it changes your quote materially — we'd rather know than negotiate late.

---

## 8. What we supply

- This brief
- `spec/BRAND_SYSTEM.md` — the full visual system, including the character identity contract
- `spec/character-states.ts` — the twelve states with purpose, emotional tone, UI placement and rendered size
- `spec/asset-manifest.json` — the target filenames, aspect ratios, focal points and safe crops
- The live design system page, so you can see the interface the character has to sit inside
- A named point of contact for questions, answered same working day

---

## 9. What we'd like in your quote

1. Fee per milestone, and total
2. Working file format you'll deliver in
3. Availability and a realistic date for Milestone 1
4. Whether the rights position in §7 is acceptable as written
5. Anything in this brief you think is wrong. You draw characters for a living and we don't — if the no-mouth constraint or the 4.5-head proportion is going to fight you, say so now rather than working around it.

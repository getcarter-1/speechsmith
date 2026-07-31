# Nib character assets — best-man set

Drop the generated Nib artwork here. Filenames must match the manifest exactly
(`lib/config/asset-manifest.json`), e.g.:

- `character-best-man-welcome-v01.png`
- `character-best-man-listening-v01.png`
- `character-best-man-generating-v01.png`
- …one per entry in the manifest (incl. crop variants like
  `character-best-man-welcome-hero-v01.png`).

Then flip the switch in `lib/config/character-assets.ts`:

```ts
export const CHARACTER_ASSETS_READY = true
```

Until that flag is `true`, `<SpeechsmithCharacter>` renders a striped
placeholder. After it's `true`, each state renders its artwork — and any
individual file still missing falls back to the placeholder automatically
(no broken images).

Generate the prompts from `docs/design/IMAGE_GENERATION_BRIEFS.md`. The brief's
keying background is the canvas colour `#F4F0E8`
(`backgroundRemovalColour` in the manifest); supply either that flat background
or transparent PNGs.

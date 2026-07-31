// Split a speech into clean paragraphs (blank-line separated), collapsing any
// single newlines inside a paragraph into spaces. Shared by all exporters.
export function speechToParagraphs(speech: string): string[] {
  return speech
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
}

export function speechToText(title: string, speech: string): string {
  const body = speechToParagraphs(speech).join("\n\n")
  return `${title}\n\n${body}\n`
}

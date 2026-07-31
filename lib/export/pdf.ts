import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { speechToParagraphs } from "./text"

// The standard PDF fonts use WinAnsi encoding, which can't render smart quotes,
// dashes, etc. Normalise those to safe equivalents and drop anything else
// outside Latin-1 so drawText never throws.
function sanitise(text: string): string {
  return text
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x00-\xFF]/g, "")
}

export async function speechToPdf(
  title: string,
  speech: string
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await doc.embedFont(StandardFonts.TimesRomanBold)

  const pageWidth = 595.28 // A4
  const pageHeight = 841.89
  const margin = 64
  const maxWidth = pageWidth - margin * 2
  const fontSize = 13
  const lineHeight = fontSize * 1.5

  let page = doc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const newLineOrPage = () => {
    if (y < margin + lineHeight) {
      page = doc.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
    }
  }

  // Title
  const titleSize = 20
  page.drawText(sanitise(title), {
    x: margin,
    y: y - titleSize,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  y -= titleSize + lineHeight

  const drawParagraph = (paragraph: string) => {
    const words = sanitise(paragraph).split(/\s+/)
    let line = ""
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && line) {
        newLineOrPage()
        page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font })
        y -= lineHeight
        line = word
      } else {
        line = candidate
      }
    }
    if (line) {
      newLineOrPage()
      page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font })
      y -= lineHeight
    }
  }

  for (const paragraph of speechToParagraphs(speech)) {
    drawParagraph(paragraph)
    y -= lineHeight * 0.6 // spacing between paragraphs
  }

  return doc.save()
}

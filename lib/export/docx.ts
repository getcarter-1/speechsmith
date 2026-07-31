import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"
import { speechToParagraphs } from "./text"

export async function speechToDocx(
  title: string,
  speech: string
): Promise<Buffer> {
  const body = speechToParagraphs(speech).map(
    (paragraph) =>
      new Paragraph({
        children: [new TextRun({ text: paragraph, size: 26 })], // 13pt (half-points)
        spacing: { after: 200, line: 360 },
      })
  )

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          ...body,
        ],
      },
    ],
  })

  return Packer.toBuffer(doc)
}

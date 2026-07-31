import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { getProjectById } from "@/lib/db/queries/projects"
import { speechToText } from "@/lib/export/text"
import { speechToPdf } from "@/lib/export/pdf"
import { speechToDocx } from "@/lib/export/docx"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const format = new URL(req.url).searchParams.get("format") ?? "txt"

  const project = await getProjectById(id, session.user.id)
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const draft =
    project.drafts.find((d) => d.status === "COMPLETE") ?? project.drafts[0]
  const speech = draft?.fullText?.trim()
    ? draft.fullText
    : draft
      ? [...draft.sections]
          .filter((s) => s.status !== "DROP")
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((s) => s.content)
          .join("\n\n")
      : ""

  if (!speech.trim()) {
    return NextResponse.json({ error: "No speech yet" }, { status: 400 })
  }

  const title = `${project.groomName}'s Best Man Speech`
  const slug =
    project.groomName.trim().replace(/\s+/g, "-").toLowerCase() || "speech"
  const filename = `${slug}-best-man-speech`

  if (format === "pdf") {
    const bytes = await speechToPdf(title, speech)
    // Copy into a fresh ArrayBuffer-backed view so it's a valid Blob part
    const body = Uint8Array.from(bytes)
    return new Response(new Blob([body], { type: "application/pdf" }), {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    })
  }

  if (format === "docx") {
    const buffer = await speechToDocx(title, speech)
    const body = Uint8Array.from(buffer)
    return new Response(
      new Blob([body], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}.docx"`,
        },
      }
    )
  }

  return new Response(speechToText(title, speech), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.txt"`,
    },
  })
}

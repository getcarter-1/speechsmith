import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { getProjectById } from "@/lib/db/queries/projects"
import { parsedFromProject, ProjectContext } from "@/lib/ai/context"
import { rewriteSection } from "@/lib/ai/modules/12-section-rewriter"
import { SpeechSegment } from "@/lib/ai/modules/11-section-segmenter"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const MAX_REWRITE_ROUNDS = 2

function toContext(project: Awaited<ReturnType<typeof getProjectById>>): ProjectContext {
  const p = project!
  return {
    groomName: p.groomName,
    partnerName: p.partnerName,
    weddingDate: p.weddingDate,
    speakerProfile: p.speakerProfile as Record<string, unknown> | null,
    speechBrief: p.speechBrief as Record<string, unknown> | null,
    eventContext: p.eventContext as Record<string, unknown> | null,
    audienceProfile: p.audienceProfile as Record<string, unknown> | null,
    coupleProfile: p.coupleProfile as Record<string, unknown> | null,
    groomProfile: p.groomProfile as Record<string, unknown> | null,
    partnerProfile: p.partnerProfile as Record<string, unknown> | null,
    redLines: p.redLines as Record<string, unknown> | null,
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId } = await params
  const project = await getProjectById(projectId, session.user.id)
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const draft =
    project.drafts.find((d) => d.status === "COMPLETE") ?? project.drafts[0]
  if (!draft) {
    return NextResponse.json({ error: "No draft to rewrite" }, { status: 400 })
  }
  if (draft.rewriteRound >= MAX_REWRITE_ROUNDS) {
    return NextResponse.json(
      { error: "Rewrite limit reached" },
      { status: 400 }
    )
  }

  const sections = [...draft.sections].sort(
    (a, b) => a.orderIndex - b.orderIndex
  )
  const toRewrite = sections.filter((s) => s.status === "REWRITE")
  if (toRewrite.length === 0) {
    return NextResponse.json({ error: "Nothing to rewrite" }, { status: 400 })
  }

  const segments: SpeechSegment[] = sections.map((s) => ({
    sectionType: s.sectionType,
    title: s.title ?? "",
    content: s.content,
    orderIndex: s.orderIndex,
  }))

  try {
    const parsed = await parsedFromProject(toContext(project))

    for (const section of toRewrite) {
      const seg: SpeechSegment = {
        sectionType: section.sectionType,
        title: section.title ?? "",
        content: section.content,
        orderIndex: section.orderIndex,
      }
      const newContent = await rewriteSection(
        seg,
        segments,
        section.rewriteNote ?? "",
        parsed
      )
      await prisma.draftSection.update({
        where: { id: section.id },
        // Rewritten sections go back to PENDING so the speaker re-reviews them
        data: { content: newContent, status: "PENDING", rewriteNote: null },
      })
    }

    const newRound = draft.rewriteRound + 1
    await prisma.draft.update({
      where: { id: draft.id },
      data: { rewriteRound: newRound },
    })
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newRound === 1 ? "REWRITE_1" : "REWRITE_2" },
    })

    return NextResponse.json({ success: true, rewritten: toRewrite.length })
  } catch (error) {
    console.error("Rewrite error:", error)
    return NextResponse.json({ error: "Rewrite failed" }, { status: 500 })
  }
}

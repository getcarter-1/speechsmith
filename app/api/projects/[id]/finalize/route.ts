import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { getProjectById } from "@/lib/db/queries/projects"
import { parsedFromProject, ProjectContext } from "@/lib/ai/context"
import { adjustCoherence } from "@/lib/ai/modules/13-coherence-adjuster"
import { SpeechSegment } from "@/lib/ai/modules/11-section-segmenter"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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
    return NextResponse.json({ error: "No draft to finalise" }, { status: 400 })
  }

  // The final speech is every section except the ones the speaker dropped.
  const segments: SpeechSegment[] = [...draft.sections]
    .filter((s) => s.status !== "DROP")
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((s) => ({
      sectionType: s.sectionType,
      title: s.title ?? "",
      content: s.content,
      orderIndex: s.orderIndex,
    }))

  if (segments.length === 0) {
    return NextResponse.json(
      { error: "Keep at least one section to build a speech." },
      { status: 400 }
    )
  }

  const joined = segments.map((s) => s.content).join("\n\n")

  let fullText = joined
  try {
    // A light coherence pass smooths the joins between kept/rewritten sections
    const parsed = await parsedFromProject(toContext(project))
    const smoothed = await adjustCoherence(segments, parsed)
    if (smoothed && smoothed.trim()) fullText = smoothed
  } catch (error) {
    console.error("Coherence pass failed, using joined sections:", error)
  }

  await prisma.draft.update({
    where: { id: draft.id },
    data: { fullText },
  })
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "FINAL" },
  })

  return NextResponse.json({ success: true })
}

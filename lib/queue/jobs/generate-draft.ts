import { runPipeline, PipelineInput } from "@/lib/ai/pipeline"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function generateDraftJob(
  projectId: string,
  draftId: string,
  onProgress: (stage: string, percent: number) => Promise<void>
): Promise<void> {
  try {
    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "GENERATING" },
    })

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        speakerProfile: true,
        speechBrief: true,
        eventContext: true,
        audienceProfile: true,
        coupleProfile: true,
        groomProfile: true,
        partnerProfile: true,
        redLines: true,
        stories: true,
        mediaAssets: true,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    const input: PipelineInput = {
      project: {
        groomName: project.groomName,
        partnerName: project.partnerName,
        weddingDate: project.weddingDate,
      },
      speakerProfile: project.speakerProfile as Record<string, unknown> | null,
      speechBrief: project.speechBrief as Record<string, unknown> | null,
      eventContext: project.eventContext as Record<string, unknown> | null,
      audienceProfile: project.audienceProfile as Record<string, unknown> | null,
      coupleProfile: project.coupleProfile as Record<string, unknown> | null,
      groomProfile: project.groomProfile as Record<string, unknown> | null,
      partnerProfile: project.partnerProfile as Record<string, unknown> | null,
      redLines: project.redLines as Record<string, unknown> | null,
      stories: project.stories as Record<string, unknown>[],
      mediaAssets: project.mediaAssets as Record<string, unknown>[],
    }

    const result = await runPipeline(input, onProgress)

    if (!result.success) {
      await prisma.draft.update({
        where: { id: draftId },
        data: { status: "FAILED" },
      })
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "INTERVIEW" },
      })
      return
    }

    await prisma.draft.update({
      where: { id: draftId },
      data: {
        status: "COMPLETE",
        fullText: result.fullText,
      },
    })

    for (const segment of result.segments) {
      await prisma.draftSection.create({
        data: {
          draftId,
          sectionType: segment.sectionType,
          title: segment.title,
          content: segment.content,
          orderIndex: segment.orderIndex,
          status: "PENDING",
        },
      })
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "REVIEW" },
    })
  } catch (error) {
    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "FAILED" },
    })
    throw error
  }
}
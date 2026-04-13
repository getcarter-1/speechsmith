import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { INTERVIEW_QUESTIONS } from "@/lib/config/interview-questions"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId } = await params
  const { questionId, value } = await req.json()

  const question = INTERVIEW_QUESTIONS.find((q) => q.id === questionId)
  if (!question) {
    return NextResponse.json({ error: "Unknown question" }, { status: 400 })
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { dbModel, dbField } = question

  const upsertData = { [dbField]: value }

  try {
    switch (dbModel) {
      case "SpeakerProfile":
        await prisma.speakerProfile.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "SpeechBrief":
        await prisma.speechBrief.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "EventContext":
        await prisma.eventContext.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "AudienceProfile":
        await prisma.audienceProfile.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "CoupleProfile":
        await prisma.coupleProfile.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "GroomProfile":
        await prisma.groomProfile.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "PartnerProfile":
        await prisma.partnerProfile.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
      case "RedLines":
        await prisma.redLines.upsert({
          where: { projectId },
          create: { projectId, ...upsertData },
          update: upsertData,
        })
        break
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "INTERVIEW", updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Interview save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
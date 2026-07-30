import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const TEXT_FIELDS = ["title", "setup", "event", "payoff", "whatItReveals"] as const

function ownedStory(storyId: string, projectId: string, userId: string) {
  return prisma.story.findFirst({
    where: { id: storyId, projectId, project: { userId } },
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; storyId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId, storyId } = await params
  const body = await req.json()

  const story = await ownedStory(storyId, projectId, session.user.id)
  if (!story) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data: Record<string, string> = {}
  for (const field of TEXT_FIELDS) {
    if (typeof body[field] === "string") data[field] = body[field]
  }

  try {
    await prisma.story.update({ where: { id: storyId }, data })
    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Story save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; storyId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId, storyId } = await params

  const story = await ownedStory(storyId, projectId, session.user.id)
  if (!story) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.story.delete({ where: { id: storyId } })
  return NextResponse.json({ success: true })
}

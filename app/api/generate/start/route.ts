import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { generationQueue } from "@/lib/queue/worker"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { projectId } = await req.json()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const draft = await prisma.draft.create({
    data: {
      projectId,
      version: 1,
      rewriteRound: 0,
      status: "PENDING",
    },
  })

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "GENERATING" },
  })

  const job = await generationQueue.add("generate", {
    projectId,
    draftId: draft.id,
  })

  return NextResponse.json({ jobId: job.id, draftId: draft.id })
}
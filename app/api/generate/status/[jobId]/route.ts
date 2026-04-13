import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { generationQueue } from "@/lib/queue/worker"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { jobId } = await params
  const job = await generationQueue.getJob(jobId)

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const state = await job.getState()
  const progress = job.progress as number ?? 0
  const logs = await job.logs(0)

  const latestLog = logs.logs[logs.logs.length - 1] ?? "Starting..."

  let draftId = job.data.draftId
  let projectStatus = "GENERATING"

  if (state === "completed") {
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })
    projectStatus = draft?.status === "COMPLETE" ? "REVIEW" : "FAILED"
  }

  return NextResponse.json({
    state,
    progress,
    latestLog,
    draftId,
    projectStatus,
  })
}
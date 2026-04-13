import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

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
  const { writingSample } = await req.json()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.speakerProfile.upsert({
    where: { projectId },
    create: { projectId, writingSample },
    update: { writingSample },
  })

  await prisma.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
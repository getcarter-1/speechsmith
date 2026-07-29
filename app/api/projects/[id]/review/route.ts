import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const VALID_STATUSES = ["PENDING", "GOOD", "DROP", "REWRITE"] as const
type SectionStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId } = await params
  const { sectionId, status, rewriteNote } = await req.json()

  if (!sectionId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Confirm the section belongs to a draft in a project owned by this user
  const section = await prisma.draftSection.findFirst({
    where: {
      id: sectionId,
      draft: { project: { id: projectId, userId: session.user.id } },
    },
  })
  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    await prisma.draftSection.update({
      where: { id: sectionId },
      data: {
        status: status as SectionStatus,
        // A note only makes sense while a section is flagged for rewrite
        rewriteNote: status === "REWRITE" ? rewriteNote ?? null : null,
      },
    })

    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Review save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

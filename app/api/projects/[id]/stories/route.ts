import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Create a new (blank) story for a project. Fields are filled in and saved
// afterwards via PATCH as the user types.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId } = await params

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const story = await prisma.story.create({
    data: {
      projectId,
      title: "",
      setup: "",
      event: "",
      payoff: "",
      whatItReveals: "",
    },
  })

  return NextResponse.json(story)
}

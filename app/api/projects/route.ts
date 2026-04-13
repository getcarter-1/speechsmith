import { auth } from "@/lib/auth/config"
import { createProject, getProjectsByUserId } from "@/lib/db/queries/projects"
import { NextResponse } from "next/server"
import { z } from "zod"

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  groomName: z.string().min(1, "Groom name is required"),
  partnerName: z.string().min(1, "Partner name is required"),
  weddingDate: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const projects = await getProjectsByUserId(session.user.id)
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createProjectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { title, groomName, partnerName, weddingDate } = parsed.data

  const project = await createProject({
    userId: session.user.id,
    title,
    groomName,
    partnerName,
    weddingDate: weddingDate ? new Date(weddingDate) : undefined,
  })

  return NextResponse.json(project, { status: 201 })
}
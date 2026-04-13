import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { generateUploadUrl, deleteFromR2 } from "@/lib/storage/r2"
import { randomUUID } from "crypto"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function GET(
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
    include: { mediaAssets: { orderBy: { createdAt: "asc" } } },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(project.mediaAssets)
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
  const { fileName, fileType, fileSize, caption } = await req.json()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const key = `${session.user.id}/${projectId}/${randomUUID()}-${fileName}`
  const uploadUrl = await generateUploadUrl(key, fileType)

  const asset = await prisma.mediaAsset.create({
    data: {
      projectId,
      fileName,
      fileType,
      fileSize,
      storageKey: key,
      caption: caption ?? null,
    },
  })

  return NextResponse.json({ asset, uploadUrl })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id: projectId } = await params
  const { assetId } = await req.json()

  const asset = await prisma.mediaAsset.findFirst({
    where: { id: assetId, projectId },
    include: { project: true },
  })

  if (!asset || asset.project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await deleteFromR2(asset.storageKey)
  await prisma.mediaAsset.delete({ where: { id: assetId } })

  return NextResponse.json({ success: true })
}
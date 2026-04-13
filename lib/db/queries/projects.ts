import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function getProjectsByUserId(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      groomName: true,
      partnerName: true,
      weddingDate: true,
      status: true,
      updatedAt: true,
    },
  })
}

export async function getProjectById(id: string, userId: string) {
  return prisma.project.findFirst({
    where: { id, userId },
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
      drafts: {
        include: {
          sections: true,
        },
        orderBy: { version: "desc" },
      },
    },
  })
}

export async function createProject(data: {
  userId: string
  title: string
  groomName: string
  partnerName: string
  weddingDate?: Date
}) {
  return prisma.project.create({
    data: {
      ...data,
      status: "SETUP",
    },
  })
}

export async function updateProjectStatus(id: string, userId: string, status: string) {
  return prisma.project.update({
    where: { id, userId },
    data: { status: status as any },
  })
}

export async function deleteProject(id: string, userId: string) {
  return prisma.project.delete({
    where: { id, userId },
  })
}
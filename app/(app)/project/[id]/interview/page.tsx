import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import InterviewWizard from "@/components/interview/InterviewWizard"

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  return (
    <InterviewWizard
      projectId={project.id}
      groomName={project.groomName}
    />
  )
}
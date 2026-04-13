import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import WritingSampleForm from "@/components/interview/WritingSampleForm"

export default async function SamplePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  return (
    <WritingSampleForm
      projectId={project.id}
      groomName={project.groomName}
      existingSample={project.speakerProfile?.writingSample ?? ""}
    />
  )
}
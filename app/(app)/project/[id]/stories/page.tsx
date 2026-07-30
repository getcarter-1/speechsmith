import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import StoriesManager from "@/components/stories/StoriesManager"

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  const stories = [...project.stories]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((s) => ({
      id: s.id,
      title: s.title ?? "",
      setup: s.setup ?? "",
      event: s.event ?? "",
      payoff: s.payoff ?? "",
      whatItReveals: s.whatItReveals ?? "",
    }))

  return (
    <StoriesManager
      projectId={project.id}
      groomName={project.groomName}
      initialStories={stories}
    />
  )
}

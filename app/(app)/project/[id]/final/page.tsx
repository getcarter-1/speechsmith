import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import FinalSpeech from "@/components/final/FinalSpeech"

export default async function FinalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  const draft =
    project.drafts.find((d) => d.status === "COMPLETE") ?? project.drafts[0]

  const speech = draft?.fullText?.trim()
    ? draft.fullText
    : draft
      ? [...draft.sections]
          .filter((s) => s.status !== "DROP")
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((s) => s.content)
          .join("\n\n")
      : ""

  if (!draft || !speech.trim()) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Your speech isn&apos;t ready yet</h1>
          <p className="text-muted-foreground">
            Finish reviewing {project.groomName}&apos;s speech first.
          </p>
          <Link
            className={buttonVariants()}
            href={`/project/${project.id}/review`}
          >
            Go to review
          </Link>
        </div>
      </div>
    )
  }

  return (
    <FinalSpeech
      projectId={project.id}
      groomName={project.groomName}
      speech={speech}
    />
  )
}

import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import SpeechReview from "@/components/review/SpeechReview"

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  // drafts come back ordered by version desc, so prefer the newest completed one
  const draft =
    project.drafts.find((d) => d.status === "COMPLETE") ?? project.drafts[0]
  const sections = draft
    ? [...draft.sections].sort((a, b) => a.orderIndex - b.orderIndex)
    : []

  if (!draft || sections.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Nothing to review yet</h1>
          <p className="text-muted-foreground">
            {project.groomName}&apos;s speech hasn&apos;t finished generating.
            Head back and generate a draft first.
          </p>
          <Link className={buttonVariants()} href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SpeechReview
      projectId={project.id}
      groomName={project.groomName}
      sections={sections.map((s) => ({
        id: s.id,
        sectionType: s.sectionType,
        title: s.title,
        content: s.content,
        orderIndex: s.orderIndex,
        status: s.status,
        rewriteNote: s.rewriteNote,
      }))}
    />
  )
}

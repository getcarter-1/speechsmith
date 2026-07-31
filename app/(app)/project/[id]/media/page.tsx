import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { primaryLinkClass, outlineLinkClass } from "@/lib/ui"
import { StepHeader } from "@/components/flow/StepHeader"
import MediaUploader from "@/components/shared/MediaUploader"

export default async function MediaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[var(--container-form)] px-4 py-8">
        <StepHeader groomName={project.groomName} />

        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-label uppercase text-occasion">
            Optional
          </span>
          <h1 className="font-ui text-page-title font-bold">Add some photos</h1>
          <p className="text-body text-content-muted">
            Got a photo that tells a story? Upload it and we&apos;ll use it as
            context when writing the speech. Completely optional.
          </p>
        </div>

        <MediaUploader projectId={project.id} initialAssets={project.mediaAssets} />

        <div className="mt-8 flex items-center justify-between">
          <Link
            href={`/project/${id}/stories`}
            className={cn(outlineLinkClass, "border-0 px-0 hover:bg-transparent")}
          >
            ← Back
          </Link>
          <Link href={`/project/${id}/sample`} className={primaryLinkClass}>
            Continue →
          </Link>
        </div>
      </div>
    </div>
  )
}

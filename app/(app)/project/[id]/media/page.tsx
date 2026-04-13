import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import MediaUploader from "@/components/shared/MediaUploader"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-muted-foreground">
            {project.groomName}'s speech
          </span>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Save &amp; exit
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">Add some photos</h1>
          <p className="text-muted-foreground">
            Got a photo that tells a story? Upload it here and we'll use it 
            as context when writing the speech. This step is completely optional.
          </p>
        </div>

        {/* Uploader */}
        <MediaUploader
          projectId={project.id}
          initialAssets={project.mediaAssets}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Link href={`/project/${id}/interview`}>
            <Button variant="ghost">← Back</Button>
          </Link>
          <div className="flex gap-3">
            <Link href={`/project/${id}/sample`}>
              <Button>
                Continue →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
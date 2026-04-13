import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SetupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const project = await getProjectById(id, session!.user!.id!)

  if (!project) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Let's write {project.groomName}'s speech
          </h1>
          <p className="text-muted-foreground">
            We'll guide you through a short interview to gather everything 
            we need. It takes about 10–15 minutes.
          </p>
        </div>
        <div className="rounded-lg border p-6 text-left space-y-3">
          <h2 className="font-semibold">What we'll cover:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ A bit about you and how you know {project.groomName}</li>
            <li>✓ Stories and moments worth sharing</li>
            <li>✓ The couple and what makes them great together</li>
            <li>✓ Your audience and any boundaries</li>
            <li>✓ Your preferred tone and style</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Link href={`/project/${id}/interview`}>
            <Button size="lg" className="w-full">
              Start the interview
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
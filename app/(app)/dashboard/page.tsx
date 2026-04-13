import { auth } from "@/lib/auth/config"
import { getProjectsByUserId } from "@/lib/db/queries/projects"
import { signOut } from "@/lib/auth/config"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ProjectCard from "@/components/dashboard/ProjectCard"
import NewProjectDialog from "@/components/dashboard/NewProjectDialog"

export default async function DashboardPage() {
  const session = await auth()
  const projects = await getProjectsByUserId(session!.user!.id!)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">SpeechSmith</h1>
            <p className="text-xs text-muted-foreground">Best man speech writer</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.email}
            </span>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Speeches</h2>
            <p className="text-muted-foreground mt-1">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
            </p>
          </div>
          <NewProjectDialog />
        </div>

        <Separator className="mb-8" />

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No speeches yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Ready to write something brilliant? 
              We'll guide you through every step.
            </p>
            <NewProjectDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                groomName={project.groomName}
                partnerName={project.partnerName}
                weddingDate={project.weddingDate}
                status={project.status}
                updatedAt={project.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
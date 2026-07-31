import { auth, signOut } from "@/lib/auth/config"
import { getProjectsByUserId } from "@/lib/db/queries/projects"
import { SiteHeader } from "@/components/brand/SiteHeader"
import { EmptyState } from "@/components/common/EmptyState"
import ProjectCard from "@/components/dashboard/ProjectCard"
import NewProjectDialog from "@/components/dashboard/NewProjectDialog"

export default async function DashboardPage() {
  const session = await auth()
  const projects = await getProjectsByUserId(session!.user!.id!)

  const accountControls = (
    <>
      <span className="hidden text-body-sm text-content-muted sm:block">
        {session?.user?.email}
      </span>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <button
          type="submit"
          className="min-h-11 font-ui text-body-sm font-semibold text-content-muted hover:text-content-primary"
        >
          Sign out
        </button>
      </form>
    </>
  )

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader variant="app" right={accountControls} />
      <main className="mx-auto max-w-[var(--container-app)] px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-ui text-page-title font-bold">Your speeches</h1>
            <p className="mt-1 text-body text-content-muted">
              Welcome back
              {session?.user?.name ? `, ${session.user.name}` : ""}
            </p>
          </div>
          {projects.length > 0 && <NewProjectDialog />}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            heading="No speeches yet"
            explanation="Ready to write something brilliant? We'll guide you through every step."
            action={<NewProjectDialog />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

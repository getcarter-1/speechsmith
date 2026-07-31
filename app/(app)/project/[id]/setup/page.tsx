import { auth } from "@/lib/auth/config"
import { getProjectById } from "@/lib/db/queries/projects"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { primaryLinkClass, outlineLinkClass } from "@/lib/ui"

const cover = [
  "A bit about you and how you know him",
  "Stories and moments worth sharing",
  "The couple and what makes them great together",
  "Your audience and any boundaries",
  "Your preferred tone and style",
]

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
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[var(--container-form)] flex-col justify-center px-4 py-10">
        <span className="font-mono text-label uppercase text-occasion">
          Best man speech
        </span>
        <h1 className="mt-3 font-ui text-page-title font-bold">
          Let&apos;s write {project.groomName}&apos;s speech
        </h1>
        <p className="mt-2 text-body text-content-muted">
          We&apos;ll guide you through a short interview to gather everything we
          need — about 10–15 minutes.
        </p>

        <div className="mt-6 rounded-card border border-line bg-surface p-5">
          <h2 className="font-mono text-label uppercase text-content-muted">
            What we&apos;ll cover
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-body-sm text-content-secondary">
            {cover.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-occasion">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/project/${id}/interview`}
            className={cn(primaryLinkClass, "w-full")}
          >
            Start the interview
          </Link>
          <Link href="/dashboard" className={cn(outlineLinkClass, "w-full")}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

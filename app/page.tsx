import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Create a speech project",
    text: "Capture the couple, wedding date, and the basic context first.",
  },
  {
    title: "Answer the interview",
    text: "Work through the guided questions about stories, tone, audience, and boundaries.",
  },
  {
    title: "Add optional context",
    text: "Upload photos or paste a writing sample before generating the draft.",
  },
]

export default async function Home() {
  const session = await auth()
  const primaryHref = session?.user ? "/dashboard" : "/signup"
  const primaryLabel = session?.user ? "Open dashboard" : "Start a speech"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-bold tracking-tight">SpeechSmith</p>
            <p className="text-xs text-muted-foreground">
              Best man speech writer
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-5xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Guided speech drafting
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Build a best man speech from the stories that actually matter.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Start with the wedding basics, move through a structured interview,
              add optional photos or writing samples, then generate a draft ready
              for review.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={primaryHref} className={buttonVariants({ size: "lg" })}>
              {primaryLabel}
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 border-b pb-5">
            <h2 className="text-xl font-semibold">Where to go</h2>
            <p className="text-sm text-muted-foreground">
              These are the main screens in the current app.
            </p>
          </div>
          <div className="divide-y">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4 py-5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "secondary" }), "mt-4 w-full")}
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}

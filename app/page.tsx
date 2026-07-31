import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Tell us about the groom",
    text: "A guided interview digs out the stories, in-jokes and details that make a speech personal — not generic.",
  },
  {
    title: "Set the tone and the limits",
    text: "Choose how funny, how heartfelt and how cheeky — and mark anything that's strictly off-limits for the room.",
  },
  {
    title: "Generate, then make it yours",
    text: "Get a full draft, then keep, rewrite or drop each part until every line sounds like you.",
  },
  {
    title: "Download and deliver",
    text: "Export to PDF or Word with a spoken-length estimate, and walk up to the mic with something you're proud of.",
  },
]

const features = [
  {
    title: "Sounds like you, not a robot",
    text: "Paste a message you've written and it matches your voice, rhythm and sense of humour.",
  },
  {
    title: "Calibrated for the room",
    text: "Family-safe, mixed wedding, or adult evening — tuned to the audience, the venue and who mustn't be offended.",
  },
  {
    title: "Built on real stories",
    text: "Specific, personal anecdotes beat filler every time. The interview pulls out the good stuff.",
  },
  {
    title: "You stay in control",
    text: "Review it section by section. Rewrite what's not landing. Drop what doesn't fit. Two rewrite rounds built in.",
  },
  {
    title: "Proudly British",
    text: "British English, British weddings, British humour — none of the American gloss or wedding-filler clichés.",
  },
  {
    title: "Ready to deliver",
    text: "Download as PDF, Word or plain text, with a rough timing so you know you're not running long.",
  },
]

export default async function Home() {
  const session = await auth()
  const primaryHref = session?.user ? "/dashboard" : "/signup"
  const primaryLabel = session?.user ? "Open dashboard" : "Start your speech"

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-bold tracking-tight">SpeechSmith</p>
            <p className="text-xs text-muted-foreground">
              Best man speeches, done properly
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
              href={primaryHref}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {session?.user ? "Dashboard" : "Get started"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <p className="text-sm font-medium text-muted-foreground">
          For the best man who wants to get it right
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          The speech he&apos;ll never let you forget — for the right reasons.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          SpeechSmith turns what you know about your mate into a warm, funny,
          properly personal best man speech — built from real stories, pitched
          perfectly for the room, and always in your own voice.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
        <p className="mt-4 text-sm text-muted-foreground">
          Free to start · about 15 minutes · no speechwriting experience needed
        </p>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="space-y-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Why it beats a blank page (or a generic AI)
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Funny, never at the wrong person&apos;s expense
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            No cheating jokes, no body-shaming, no mocking anyone who&apos;s no
            longer with us — ever. Anything you flag as off-limits stays out, and
            you approve every line before it&apos;s final.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          He trusted you with this. Let&apos;s make it land.
        </h2>
        <div className="mt-8">
          <Link href={primaryHref} className={buttonVariants({ size: "lg" })}>
            {primaryLabel}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <p className="font-medium text-foreground">SpeechSmith</p>
          <p>Best man speeches, done properly.</p>
        </div>
      </footer>
    </main>
  )
}

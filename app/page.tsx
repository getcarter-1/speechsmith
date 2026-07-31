import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { SiteHeader } from "@/components/brand/SiteHeader"
import { SiteFooter } from "@/components/brand/SiteFooter"
import { SpeechsmithCharacter } from "@/components/character/SpeechsmithCharacter"

const primaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 font-ui text-button font-semibold text-content-on-accent no-underline transition-colors duration-[var(--motion-duration-fast)] hover:bg-accent-strong"
const outlineLink =
  "inline-flex min-h-11 items-center justify-center rounded-control border border-line-ink px-5 font-ui text-button font-semibold text-content-primary no-underline transition-colors duration-[var(--motion-duration-fast)] hover:bg-accent-subtle"

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
    text: "Review it section by section. Rewrite what's not landing. Drop what doesn't fit.",
  },
  {
    title: "Proudly British",
    text: "British English, British weddings, British humour — none of the American gloss or wedding clichés.",
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
    <main className="min-h-screen bg-canvas text-content-primary">
      <SiteHeader variant="marketing" primaryHref={primaryHref} primaryLabel={session?.user ? "Dashboard" : "Get started"} />

      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[var(--container-app)] items-center gap-8 px-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-label uppercase text-occasion">
              For the best man who wants to get it right
            </span>
            <h1 className="text-balance font-ui text-display font-bold text-content-primary">
              The speech he&apos;ll never let you forget — for the right reasons.
            </h1>
            <p className="max-w-[42ch] text-body text-content-secondary">
              SpeechSmith turns what you know about your mate into a warm, funny,
              properly personal best man speech — built from real stories,
              pitched for the room, and always in your own voice.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className={primaryLink}>
                {primaryLabel}
              </Link>
              <Link href="/login" className={outlineLink}>
                Sign in
              </Link>
            </div>
            <p className="text-annotation text-content-faint">
              Free to start · about 15 minutes · no speechwriting experience
              needed
            </p>
          </div>
          <div className="flex justify-center bg-canvas p-4 lg:justify-end lg:p-6">
            <SpeechsmithCharacter
              state="welcome"
              size="hero"
              decorative={false}
              alt="SpeechSmith, ready to help you write"
              className="max-w-full"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-[var(--container-app)] px-4 py-12 lg:py-16">
          <h2 className="text-center font-ui text-page-title font-bold">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3">
                <span className="grid size-9 place-items-center rounded-control bg-ink font-ui text-body-sm font-semibold text-content-inverse">
                  {index + 1}
                </span>
                <h3 className="font-ui text-card-title font-semibold">
                  {step.title}
                </h3>
                <p className="text-body-sm text-content-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-app)] px-4 py-12 lg:py-16">
          <h2 className="text-center font-ui text-page-title font-bold">
            Why it beats a blank page (or a generic AI)
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-card border border-line bg-surface-raised p-5"
              >
                <h3 className="font-ui text-card-title font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-body-sm text-content-muted">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-[var(--container-reading)] px-4 py-12 text-center lg:py-16">
          <h2 className="font-ui text-page-title font-bold">
            Funny, never at the wrong person&apos;s expense
          </h2>
          <p className="mt-4 text-body text-content-secondary">
            No cheating jokes, no body-shaming, no mocking anyone who&apos;s no
            longer with us — ever. Anything you flag as off-limits stays out, and
            you approve every line before it&apos;s final.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-reading)] px-4 py-16 text-center">
          <h2 className="font-ui text-page-title font-bold">
            He trusted you with this. Let&apos;s make it land.
          </h2>
          <div className="mt-8">
            <Link href={primaryHref} className={primaryLink}>
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

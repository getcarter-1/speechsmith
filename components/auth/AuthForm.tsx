"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"

const inputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-surface-sunken px-3 font-ui text-body text-content-primary outline-none placeholder:text-content-faint focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]"

function GoogleMark() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  const copy =
    mode === "login"
      ? {
          title: "Welcome back",
          sub: "Sign in to carry on with your speech",
          sent: "Click the link to sign in — no password needed.",
          altText: "No account yet?",
          altLabel: "Get started",
          altHref: "/signup",
        }
      : {
          title: "Start your speech",
          sub: "Create your account and get going",
          sent: "Click the link to create your account — no password needed.",
          altText: "Already have an account?",
          altLabel: "Sign in",
          altHref: "/login",
        }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      })
      if (result?.error) setError("Something went wrong. Please try again.")
      else setIsSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  if (isSent) {
    return (
      <div className="w-full max-w-[var(--container-form)] rounded-card border border-line bg-surface p-6 text-center">
        <h1 className="font-ui text-page-title font-bold">Check your email</h1>
        <p className="mt-2 text-body text-content-muted">
          We sent a magic link to{" "}
          <span className="font-semibold text-content-primary">{email}</span>.{" "}
          {copy.sent}
        </p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="mt-5 min-h-11 font-ui text-button font-semibold text-content-muted hover:text-content-primary"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[var(--container-form)] rounded-card border border-line bg-surface p-6">
      <div className="mb-6 text-center">
        <h1 className="font-ui text-page-title font-bold">{copy.title}</h1>
        <p className="mt-1 text-body-sm text-content-muted">{copy.sub}</p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-line-ink font-ui text-button font-semibold text-content-primary transition-colors duration-[var(--motion-duration-fast)] hover:bg-accent-subtle disabled:opacity-60"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-annotation uppercase text-content-faint">
            or
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-ui text-body-sm font-semibold">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={inputClass}
            />
          </div>
          {error && <p className="text-body-sm text-danger">{error}</p>}
          <PrimaryCTA type="submit" loading={isLoading} className="w-full">
            Send magic link
          </PrimaryCTA>
        </form>
      </div>

      <p className="mt-6 text-center text-body-sm text-content-muted">
        {copy.altText}{" "}
        <Link
          href={copy.altHref}
          className="font-semibold text-content-primary no-underline hover:underline"
        >
          {copy.altLabel}
        </Link>
      </p>
    </div>
  )
}

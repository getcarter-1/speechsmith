"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import StatusChip from "./StatusChip"

interface ProjectCardProps {
  id: string
  title: string
  groomName: string
  partnerName: string
  weddingDate: Date | null
  status: string
  updatedAt: Date
}

const statusRoutes: Record<string, string> = {
  SETUP: "setup",
  INTERVIEW: "interview",
  MEDIA: "media",
  SAMPLE: "sample",
  GENERATING: "generating",
  REVIEW: "review",
  REWRITE_1: "review",
  REWRITE_2: "review",
  FINAL: "final",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export default function ProjectCard({
  id,
  title,
  groomName,
  partnerName,
  weddingDate,
  status,
  updatedAt,
}: ProjectCardProps) {
  const router = useRouter()
  const continueHref = `/project/${id}/${statusRoutes[status] ?? "setup"}`

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-label uppercase text-occasion">
            Best man speech
          </span>
          <h3 className="font-ui text-card-title font-semibold text-content-primary">
            {title}
          </h3>
          <p className="text-body-sm text-content-muted">
            {groomName} &amp; {partnerName}
          </p>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="text-annotation text-content-faint">
        {weddingDate && <span>Wedding {formatDate(weddingDate)} · </span>}
        <span>Updated {formatDate(updatedAt)}</span>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-1">
        <Link
          href={continueHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-accent px-4 font-ui text-button font-semibold text-content-on-accent no-underline transition-colors duration-[var(--motion-duration-fast)] hover:bg-accent-strong"
        >
          Continue
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="min-h-11 px-2 font-ui text-button font-semibold text-content-muted transition-colors hover:text-danger"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

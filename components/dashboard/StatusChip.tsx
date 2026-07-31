const statusConfig: Record<string, { label: string; cls: string }> = {
  SETUP: { label: "Setup", cls: "border-line text-content-muted" },
  INTERVIEW: {
    label: "Interview",
    cls: "border-info-border bg-info-surface text-info",
  },
  MEDIA: {
    label: "Photos",
    cls: "border-info-border bg-info-surface text-info",
  },
  SAMPLE: {
    label: "Your voice",
    cls: "border-info-border bg-info-surface text-info",
  },
  GENERATING: {
    label: "Generating…",
    cls: "border-info-border bg-info-surface text-info",
  },
  REVIEW: {
    label: "Ready to review",
    cls: "border-success-border bg-success-surface text-success",
  },
  REWRITE_1: {
    label: "Rewrite 1",
    cls: "border-warning-border bg-warning-surface text-warning",
  },
  REWRITE_2: {
    label: "Rewrite 2",
    cls: "border-warning-border bg-warning-surface text-warning",
  },
  FINAL: {
    label: "Final",
    cls: "border-success-border bg-success-surface text-success",
  },
}

export default function StatusChip({ status }: { status: string }) {
  const info = statusConfig[status] ?? {
    label: status,
    cls: "border-line text-content-muted",
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-control border px-2 py-0.5 font-mono text-annotation ${info.cls}`}
    >
      {info.label}
    </span>
  )
}

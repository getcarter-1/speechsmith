import { Badge } from "@/components/ui/badge"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  SETUP: { label: "Setup", variant: "outline" },
  INTERVIEW: { label: "Interview", variant: "secondary" },
  MEDIA: { label: "Media", variant: "secondary" },
  SAMPLE: { label: "Writing Sample", variant: "secondary" },
  GENERATING: { label: "Generating...", variant: "default" },
  REVIEW: { label: "Ready to Review", variant: "default" },
  REWRITE_1: { label: "Rewrite Round 1", variant: "secondary" },
  REWRITE_2: { label: "Rewrite Round 2", variant: "secondary" },
  FINAL: { label: "Final", variant: "default" },
}

export default function StatusChip({ status }: { status: string }) {
  const statusInfo = statusConfig[status] ?? { label: status, variant: "outline" as const }
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  )
}
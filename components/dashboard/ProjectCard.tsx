"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

interface ProjectCardProps {
  id: string
  title: string
  groomName: string
  partnerName: string
  weddingDate: Date | null
  status: string
  updatedAt: Date
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
  const statusInfo = statusConfig[status] ?? { label: status, variant: "outline" as const }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date))
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    router.refresh()
  }

  const getContinueHref = () => {
    const statusRoutes: Record<string, string> = {
      SETUP: `/project/${id}/setup`,
      INTERVIEW: `/project/${id}/interview`,
      MEDIA: `/project/${id}/media`,
      SAMPLE: `/project/${id}/sample`,
      GENERATING: `/project/${id}/generating`,
      REVIEW: `/project/${id}/review`,
      REWRITE_1: `/project/${id}/review`,
      REWRITE_2: `/project/${id}/review`,
      FINAL: `/project/${id}/final`,
    }
    return statusRoutes[status] ?? `/project/${id}/setup`
  }

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge variant={statusInfo.variant} className="shrink-0 text-xs">
            {statusInfo.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {groomName} &amp; {partnerName}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-1 text-sm text-muted-foreground">
          {weddingDate && (
            <p>Wedding: {formatDate(weddingDate)}</p>
          )}
          <p>Updated: {formatDate(updatedAt)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={getContinueHref()} className="flex-1">
          <Button className="w-full">Continue</Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
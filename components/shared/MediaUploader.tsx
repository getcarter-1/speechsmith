"use client"

import { useState, useRef } from "react"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"

interface MediaAsset {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  storageKey: string
  caption: string | null
}

interface MediaUploaderProps {
  projectId: string
  initialAssets?: MediaAsset[]
}

const captionInputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-surface-sunken px-3 font-ui text-body-sm text-content-primary outline-none placeholder:text-content-faint focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]"

export default function MediaUploader({
  projectId,
  initialAssets = [],
}: MediaUploaderProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, WebP or GIF image.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.")
      return
    }

    setError("")
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const res = await fetch(`/api/projects/${projectId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      })
      if (!res.ok) throw new Error("Failed to get upload URL")

      const { asset, uploadUrl } = await res.json()

      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
      })
      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject())
        xhr.onerror = reject
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)
      })

      setAssets((prev) => [...prev, asset])
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async (assetId: string) => {
    if (!confirm("Remove this image?")) return
    try {
      await fetch(`/api/projects/${projectId}/media`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      })
      setAssets((prev) => prev.filter((a) => a.id !== assetId))
    } catch {
      setError("Failed to delete image.")
    }
  }

  const handleCaptionUpdate = (assetId: string, caption: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, caption } : a))
    )
  }

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)}KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)}MB`

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-surface p-8 text-center transition-colors hover:border-line-accent hover:bg-accent-subtle"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="text-3xl" aria-hidden>
          📷
        </span>
        <span className="font-ui text-body font-semibold text-content-primary">
          Choose a photo
        </span>
        <span className="text-annotation text-content-faint">
          JPG, PNG, WebP or GIF — max 10MB
        </span>
      </button>

      {isUploading && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-body-sm">
            <span className="text-content-muted">Uploading…</span>
            <span className="font-mono text-annotation text-content-faint">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-pill bg-surface-sunken">
            <div
              className="h-full rounded-pill bg-accent transition-[width] duration-[var(--motion-duration-slow)]"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-body-sm text-danger">{error}</p>}

      {assets.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-label uppercase text-content-muted">
            Uploaded photos ({assets.length})
          </h3>
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-start gap-3 rounded-card border border-line bg-surface p-3"
            >
              <div
                className="grid size-16 shrink-0 place-items-center rounded-control bg-surface-sunken text-2xl"
                aria-hidden
              >
                🖼️
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-ui text-body-sm font-semibold text-content-primary">
                      {asset.fileName}
                    </p>
                    <p className="text-annotation text-content-faint">
                      {formatSize(asset.fileSize)}
                    </p>
                  </div>
                  <SecondaryCTA
                    variant="quiet"
                    onClick={() => handleDelete(asset.id)}
                  >
                    Remove
                  </SecondaryCTA>
                </div>
                <input
                  className={captionInputClass}
                  placeholder="Add a caption (optional) — e.g. Tom's stag do, 2023"
                  value={asset.caption ?? ""}
                  onChange={(e) => handleCaptionUpdate(asset.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

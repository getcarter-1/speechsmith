"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

  const handleCaptionUpdate = async (assetId: string, caption: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, caption } : a))
    )
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-2">
          <div className="text-4xl">📷</div>
          <p className="font-medium">Click to upload a photo</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, WebP or GIF — max 10MB
          </p>
        </div>
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Uploaded images */}
      {assets.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">
            Uploaded photos ({assets.length})
          </h3>
          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0 text-2xl">
                  🖼️
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium truncate">
                        {asset.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(asset.fileSize)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    placeholder="Add a caption (optional) — e.g. Tom's stag do, 2023"
                    value={asset.caption ?? ""}
                    onChange={(e) =>
                      handleCaptionUpdate(asset.id, e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
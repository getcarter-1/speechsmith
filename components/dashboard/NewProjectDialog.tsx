"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PrimaryCTA } from "@/components/common/PrimaryCTA"
import { SecondaryCTA } from "@/components/common/SecondaryCTA"

const inputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-surface-sunken px-3 font-ui text-body text-content-primary outline-none placeholder:text-content-faint focus-visible:border-line-accent focus-visible:shadow-[var(--shadow-focus-ring)]"

export default function NewProjectDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    groomName: "",
    partnerName: "",
    weddingDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.formErrors?.[0] ?? "Something went wrong.")
        return
      }
      const project = await res.json()
      setOpen(false)
      router.push(`/project/${project.id}/setup`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const field = (
    name: keyof typeof form,
    label: string,
    placeholder: string,
    opts: { type?: string; required?: boolean; hint?: string } = {}
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-ui text-body-sm font-semibold">
        {label}
        {opts.hint && (
          <span className="font-normal text-content-muted"> {opts.hint}</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={opts.type ?? "text"}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required={opts.required}
        disabled={isLoading}
        className={inputClass}
      />
    </div>
  )

  return (
    <>
      <PrimaryCTA onClick={() => setOpen(true)}>Write my speech</PrimaryCTA>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-ui text-section-title font-bold">
              Start a new speech
            </DialogTitle>
            <DialogDescription className="text-body-sm text-content-muted">
              Tell us a little about the wedding first.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {field("title", "Project name", "e.g. Tom's wedding speech", {
              required: true,
            })}
            {field("groomName", "Groom's name", "e.g. Tom", { required: true })}
            {field("partnerName", "Partner's name", "e.g. Sarah", {
              required: true,
            })}
            {field("weddingDate", "Wedding date", "", {
              type: "date",
              hint: "(optional)",
            })}
            {error && <p className="text-body-sm text-danger">{error}</p>}
            <div className="mt-2 flex items-center justify-end gap-3">
              <SecondaryCTA
                variant="quiet"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </SecondaryCTA>
              <PrimaryCTA type="submit" loading={isLoading}>
                Let&apos;s go
              </PrimaryCTA>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

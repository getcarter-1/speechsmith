// Minimal chrome for the guided project steps: subject + escape hatch.
export function StepHeader({ groomName }: { groomName: string }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <span className="font-ui text-body-sm font-semibold text-content-muted">
        {groomName}&apos;s speech
      </span>
      <a
        href="/dashboard"
        className="font-ui text-body-sm font-semibold text-content-muted no-underline hover:text-content-primary"
      >
        Save &amp; exit
      </a>
    </div>
  )
}

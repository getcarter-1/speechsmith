export default function VerifyRequestPage() {
  return (
    <div className="w-full max-w-[var(--container-form)] rounded-card border border-line bg-surface p-8 text-center">
      <h1 className="font-ui text-page-title font-bold">Check your email</h1>
      <p className="mt-3 text-body text-content-muted">
        A sign-in link is on its way to your inbox. Click it to continue — it
        expires in 24 hours.
      </p>
    </div>
  )
}

import { auth } from "@/lib/auth/config"
import { signOut } from "@/lib/auth/config"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Speeches</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
            </p>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No speeches yet</h2>
          <p className="text-muted-foreground mb-6">
            Ready to write something brilliant? Let's get started.
          </p>
          <Button>
            Write my speech
          </Button>
        </div>
      </div>
    </div>
  )
}
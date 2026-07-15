import { Card, CardContent } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your workspace settings.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">

          <div>
            <h2 className="text-lg font-semibold">
              Portal
            </h2>

            <p className="text-sm text-slate-500">
              Configure branding, notifications,
              authentication and business preferences.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="font-medium">
              Owner Account
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This workspace is controlled by a single owner account.
              Staff members operate under this account and permissions
              will be expanded later.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

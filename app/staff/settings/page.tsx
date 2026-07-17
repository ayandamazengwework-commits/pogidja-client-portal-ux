import {
  Bell,
  Building2,
  Lock,
  ShieldCheck,
  UserCog,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          Configure your workspace and firm preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="rounded-3xl">
          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Building2 className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Firm Information
                </h2>

                <p className="text-sm text-slate-500">
                  POG Advisory & Chartered Accountants
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">

              <div className="space-y-2">

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Workspace
                  </span>

                  <span className="font-medium">
                    Production
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Portal
                  </span>

                  <span className="font-medium text-green-600">
                    Active
                  </span>
                </div>

              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Security
                </h2>

                <p className="text-sm text-slate-500">
                  Authentication & permissions
                </p>
              </div>
            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between rounded-xl border p-4">

                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-500" />

                  <div>
                    <p className="font-medium">
                      Secure Login
                    </p>

                    <p className="text-sm text-slate-500">
                      Powered by Supabase Authentication
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Enabled
                </span>

              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="rounded-3xl">
          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-purple-100 p-3">
                <Bell className="h-6 w-6 text-purple-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Notifications
                </h2>

                <p className="text-sm text-slate-500">
                  Email and portal alerts
                </p>
              </div>

            </div>

            <div className="rounded-xl border bg-slate-50 p-4">

              <p className="text-sm text-slate-600">
                Notification preferences will become configurable in a future
                update.
              </p>

            </div>

          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-orange-100 p-3">
                <UserCog className="h-6 w-6 text-orange-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Workspace Administration
                </h2>

                <p className="text-sm text-slate-500">
                  Owner controlled settings
                </p>
              </div>

            </div>

            <div className="rounded-xl border bg-slate-50 p-4">

              <p className="text-sm text-slate-600">
                Staff permissions, branding, workflow automation and advanced
                settings are managed by the workspace owner.
              </p>

            </div>

            <Button
              disabled
              className="w-full"
            >
              Owner Settings (Coming Soon)
            </Button>

          </CardContent>
        </Card>

      </div>

    </div>
  )
}

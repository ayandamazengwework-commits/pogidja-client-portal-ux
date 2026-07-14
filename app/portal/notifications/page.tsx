import {
  Bell,
  Clock,
  Activity,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  const today = new Date()

  const todayCount =
    logs?.filter((log) => {
      const date = new Date(log.created_at)

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }).length ?? 0

  return (
    <div className="space-y-8">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              ACCOUNT ACTIVITY
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Notifications
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Every update made to your services,
              documents and requests appears here.
            </p>

          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <Activity className="mx-auto mb-3 h-10 w-10 text-blue-200" />

              <p className="text-sm text-slate-300">
                Today's Activity
              </p>

              <p className="mt-2 text-4xl font-bold">
                {todayCount}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* Timeline */}

      {logs && logs.length > 0 ? (

        <div className="space-y-5">

          {logs.map((log) => (

            <Card
              key={log.id}
              className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg"
            >

              <CardContent className="p-6">

                <div className="flex gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                    <Bell className="h-5 w-5 text-blue-700" />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">

                          {log.action}

                        </h3>

                        <Badge
                          variant="secondary"
                          className="mt-2"
                        >
                          Activity
                        </Badge>

                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Clock className="h-4 w-4" />

                        {new Date(
                          log.created_at
                        ).toLocaleString()}

                      </div>

                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">

                      {log.description}

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="flex flex-col items-center py-24">

            <div className="mb-8 rounded-full bg-slate-100 p-8">

              <Bell className="h-14 w-14 text-slate-400" />

            </div>

            <h2 className="text-3xl font-bold">
              You're All Caught Up
            </h2>

            <p className="mt-4 max-w-xl text-center text-slate-500">

              When POG Advisory updates your
              requests, reviews documents or sends
              progress updates, they'll appear here.

            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

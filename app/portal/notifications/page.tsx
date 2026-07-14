import {
  Bell,
  Clock
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

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

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="mt-2 text-muted-foreground">
          Stay updated on your requests and documents.
        </p>

      </div>

      {logs && logs.length > 0 ? (

        <div className="space-y-4">

          {logs.map((log) => (

            <Card
              key={log.id}
              className="rounded-2xl"
            >

              <CardContent className="flex items-start gap-4 p-6">

                <Bell className="mt-1 h-5 w-5 text-[#1E88E5]" />

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {log.action}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {log.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">

                    <Clock className="h-3 w-3" />

                    {new Date(
                      log.created_at
                    ).toLocaleString()}

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card>

          <CardContent className="py-20 text-center">

            <Bell className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No Notifications
            </h2>

            <p className="mt-3 text-slate-500">
              Updates from POG Advisory will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

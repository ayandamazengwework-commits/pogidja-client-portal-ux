import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function StaffNotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: notifications } = await supabase
    .from('notifications')
    .select(`
      *,
      profile:profiles!notifications_user_id_fkey(
        first_name,
        last_name,
        company_name
      )
    `)
    .order('created_at', {
      ascending: false,
    })
    .limit(100)

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="text-slate-500">
          Notifications delivered to clients.
        </p>

      </div>

      {!notifications || notifications.length === 0 ? (
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <p className="text-slate-500">
              No notifications have been sent yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">

          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="rounded-3xl border-0 shadow-sm"
            >
              <CardContent className="space-y-4 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-semibold">
                      {notification.title}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {notification.profile?.company_name ??
                        `${notification.profile?.first_name ?? ''} ${notification.profile?.last_name ?? ''}`}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      notification.read
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {notification.read ? 'Read' : 'Unread'}
                  </span>

                </div>

                <p className="text-slate-700">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-400">
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </p>

                  {notification.link && (
                    <Button
                      asChild
                      variant="outline"
                    >
                      <Link href={notification.link}>
                        Open
                      </Link>
                    </Button>
                  )}

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}

    </div>
  )
}

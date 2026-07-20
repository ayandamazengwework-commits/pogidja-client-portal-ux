import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="text-slate-500">
          Recent updates from your advisor.
        </p>

      </div>

      {!notifications || notifications.length === 0 ? (
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">

            <Bell className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <p className="text-slate-500">
              No notifications yet.
            </p>

          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">

          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`rounded-3xl border-0 shadow-sm ${
                notification.read
                  ? ''
                  : 'border-l-4 border-l-[#1E88E5]'
              }`}
            >
              <CardContent className="p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="font-semibold">
                      {notification.title}
                    </h2>

                    <p className="mt-2 text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  {!notification.read && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      New
                    </span>
                  )}

                </div>

                {notification.link && (
                  <div className="mt-5">

                    <Button asChild>

                      <a href={notification.link}>
                        Open
                      </a>

                    </Button>

                  </div>
                )}

              </CardContent>
            </Card>
          ))}

        </div>
      )}

    </div>
  )
}

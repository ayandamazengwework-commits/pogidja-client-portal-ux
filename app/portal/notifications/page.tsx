import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Bell } from 'lucide-react'

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
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="mt-2 text-slate-500">
          Recent updates from your advisor.
        </p>

      </div>

      {notifications && notifications.length > 0 ? (

        <div className="space-y-4">

          {notifications.map((notification) => (

            <Card
              key={notification.id}
              className={`rounded-3xl border-0 shadow-sm ${
                notification.read
                  ? ''
                  : 'border-l-4 border-l-blue-600'
              }`}
            >

              <CardContent className="flex gap-4 p-6">

                <div className="rounded-2xl bg-blue-100 p-3">

                  <Bell className="h-5 w-5 text-blue-700" />

                </div>

                <div className="flex-1">

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

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="py-16 text-center">

            <Bell className="mx-auto mb-4 h-12 w-12 text-slate-300" />

            <p className="text-slate-500">
              No notifications yet.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

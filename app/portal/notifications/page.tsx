import Link from 'next/link'
import { Bell, CheckCheck } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  const unread =
    notifications?.filter((n) => !n.read).length ?? 0

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 text-slate-500">
            Recent updates from your advisor.
          </p>

        </div>

        {unread > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button>

              <CheckCheck className="mr-2 h-4 w-4" />

              Mark all as read

            </Button>
          </form>
        )}

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
                      <form
                        action={async () => {
                          'use server'
                          await markNotificationAsRead(
                            notification.id
                          )
                        }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          Mark read
                        </Button>
                      </form>
                    )}

                  </div>

                  {notification.link && (
                    <div className="mt-4">

                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                      >
                        <Link href={notification.link}>
                          Open
                        </Link>
                      </Button>

                    </div>
                  )}

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

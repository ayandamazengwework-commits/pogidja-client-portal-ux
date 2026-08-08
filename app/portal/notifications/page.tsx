import Link from 'next/link'
import { Bell, CheckCheck, ArrowRight } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './actions'

function formatNotificationDate(date: string) {
  return new Date(date).toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getNotificationIcon(type?: string | null) {
  switch (type) {
    case 'message':
      return '💬'

    case 'service':
      return '📋'

    case 'document':
      return '📄'

    case 'onboarding':
      return '👋'

    default:
      return '🔔'
  }
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const {
    data: notifications,
    error,
  } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(
      'Failed to load notifications:',
      error
    )
  }

  const notificationList = notifications ?? []

  const unreadCount = notificationList.filter(
    (notification) => !notification.read
  ).length

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
              <Bell className="h-5 w-5 text-[#1E88E5]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>

              <p className="mt-1 text-slate-500">
                Recent updates from your advisor.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </form>
        )}

      </div>


      {/* SUMMARY */}
      {notificationList.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Notification activity
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {notificationList.length}{' '}
                {notificationList.length === 1
                  ? 'notification'
                  : 'notifications'}
              </p>
            </div>

            {unreadCount > 0 ? (
              <div className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {unreadCount} unread
              </div>
            ) : (
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                All caught up
              </div>
            )}

          </div>

        </div>
      )}


      {/* EMPTY STATE */}
      {notificationList.length === 0 ? (

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Bell className="h-8 w-8 text-slate-300" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              When your advisor sends you a message,
              requests a document, or updates your
              service, you'll see it here.
            </p>

          </CardContent>
        </Card>

      ) : (

        /* NOTIFICATIONS */
        <div className="space-y-4">

          {notificationList.map((notification) => (

            <Card
              key={notification.id}
              className={`rounded-3xl border shadow-sm transition ${
                notification.read
                  ? 'border-slate-200 bg-white'
                  : 'border-blue-200 bg-blue-50/40'
              }`}
            >

              <CardContent className="p-5 sm:p-6">

                <div className="flex items-start gap-4">

                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                      notification.read
                        ? 'bg-slate-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>


                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <h2 className="font-semibold text-slate-900">
                            {notification.title}
                          </h2>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                          )}

                        </div>

                        <p className="mt-2 leading-relaxed text-slate-600">
                          {notification.message}
                        </p>

                      </div>


                      {!notification.read && (
                        <span className="w-fit shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          New
                        </span>
                      )}

                    </div>


                    {/* DATE */}

                    <p className="mt-3 text-xs text-slate-400">
                      {formatNotificationDate(
                        notification.created_at
                      )}
                    </p>


                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-wrap items-center gap-3">

                      {notification.link && (
                        <Button
                          asChild
                          className="rounded-xl bg-[#1E88E5] hover:bg-[#1565C0]"
                        >
                          <Link
                            href={notification.link}
                          >
                            Open
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}


                      {!notification.read && (
                        <form
                          action={markNotificationAsRead.bind(
                            null,
                            notification.id
                          )}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            className="rounded-xl text-slate-600"
                          >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark as read
                          </Button>
                        </form>
                      )}

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>
  )
}

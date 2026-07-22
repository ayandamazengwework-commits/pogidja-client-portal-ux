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
    .select(
      `
      *,
      profile:profiles!notifications_user_id_fkey(
        first_name,
        last_name,
        company_name
      )
    `
    )
    .order('created_at', {
      ascending: false,
    })
    .limit(100)

  // Mark all unread notifications as read
  if (notifications?.length) {
    const unreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id)

    if (unreadIds.length) {
      await supabase
        .from('notifications')
        .update({
          read: true,
        })
        .in('id', unreadIds)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              STAFF
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Notifications
            </h1>

            <p className="mt-3 text-slate-300">
              Activity across your client portal.
            </p>
          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-300">
                Total
              </p>

              <p className="mt-2 text-4xl font-bold">
                {notifications?.length ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {!notifications?.length ? (
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <p className="text-slate-500">
              No notifications yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg"
            >
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {notification.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {notification.profile?.company_name ??
                        `${notification.profile?.first_name ?? ''} ${notification.profile?.last_name ?? ''}`}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Read
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

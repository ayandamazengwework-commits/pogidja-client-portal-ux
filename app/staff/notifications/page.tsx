import { Bell } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

export default async function StaffNotificationsPage() {
  const supabase = await createClient()

  const { data: activity } = await supabase
    .from('activity_logs')
    .select(`
      *,
      user:profiles(
        first_name,
        last_name,
        company_name
      )
    `)
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
          Latest activity across your firm.
        </p>
      </div>

      <div className="space-y-4">
        {activity?.length ? (
          activity.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-6">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Bell className="h-5 w-5 text-blue-700" />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold">
                    {item.action}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {item.user?.company_name ||
                      `${item.user?.first_name ?? ''} ${item.user?.last_name ?? ''}`}

                    {' • '}

                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-slate-500">
              No activity yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

import { Bell, Search } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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
    .order('read', {
      ascending: true,
    })
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

      <div className="relative max-w-md">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search activity..."
          className="pl-11"
        />

      </div>

      {activity?.length ? (

        <div className="space-y-5">

          {activity.map((item) => (

            <Card
              key={item.id}
              className={`rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                item.read
                  ? ''
                  : 'border-l-4 border-l-blue-600 bg-blue-50'
              }`}
            >

              <CardContent className="flex flex-col gap-5 p-6 sm:flex-row">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                  <Bell className="h-6 w-6 text-blue-700" />

                </div>

                <div className="flex-1">

                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-2">

                      <h2 className="text-lg font-semibold">
                        {item.action}
                      </h2>

                      {!item.read && (
                        <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                          NEW
                        </span>
                      )}

                    </div>

                    <span className="text-sm text-slate-400">

                      {new Date(
                        item.created_at
                      ).toLocaleString()}

                    </span>

                  </div>

                  <p className="mt-3 leading-7 text-slate-600">

                    {item.description}

                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">

                    {item.user?.company_name ||

                      `${item.user?.first_name ?? ''} ${item.user?.last_name ?? ''}`}

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl">

          <CardContent className="py-20 text-center">

            <Bell className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">

              No Notifications

            </h2>

            <p className="mt-3 text-slate-500">

              Activity from clients and staff will appear here.

            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

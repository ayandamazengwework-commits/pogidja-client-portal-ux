import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'

export default async function MyRequestsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Find the logged in client
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          My Requests
        </h1>

        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            Your client profile could not be found.
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: requests } = await supabase
    .from('services')
    .select(`
      *,
      category:service_categories(
        name
      )
    `)
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            My Requests
          </h1>

          <p className="text-slate-500">
            Track the progress of your service requests.
          </p>
        </div>

        <Button asChild>
          <Link href="/portal/request-service">
            New Request
          </Link>
        </Button>

      </div>

      {!requests?.length ? (

        <Card>

          <CardContent className="flex flex-col items-center justify-center py-16">

            <h2 className="text-xl font-semibold">
              No requests yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first service request.
            </p>

            <Button
              className="mt-6"
              asChild
            >
              <Link href="/portal/request-service">
                Request a Service
              </Link>
            </Button>

          </CardContent>

        </Card>

      ) : (

        <div className="space-y-4">

          {requests.map((request) => (

            <Card
              key={request.id}
              className="transition hover:shadow-md"
            >

              <CardContent className="flex items-center justify-between p-6">

                <div>

                  <h3 className="text-lg font-semibold">
                    {request.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {request.category?.name}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Submitted{' '}
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <StatusBadge
                    label={request.status}
                    tone="bg-blue-100 text-blue-700"
                  />

                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href={`/portal/my-requests/${request.id}`}>
                      View
                    </Link>
                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>
  )
}

import Link from 'next/link'
import {
  ArrowRight,
  Clock3,
  FileText,
  FolderOpen,
  PlusCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'

export default async function ClientDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  /* ------------------------------------------
     Profile
  ------------------------------------------- */

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  /* ------------------------------------------
     Client Record
  ------------------------------------------- */

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  /* ------------------------------------------
     Services
  ------------------------------------------- */

  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        name
      )
    `)
    .eq('client_id', client?.id)
    .order('created_at', {
      ascending: false,
    })

  /* ------------------------------------------
     Documents
  ------------------------------------------- */

  const { count: documentCount } = await supabase
    .from('service_documents')
    .select('*', {
      count: 'exact',
      head: true,
    })

  /* ------------------------------------------
     Activity
  ------------------------------------------- */

  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })
    .limit(5)

  /* ------------------------------------------
     Dashboard Stats
  ------------------------------------------- */

  const activeRequests =
    services?.filter(
      (service) =>
        service.status !== 'Completed' &&
        service.status !== 'Cancelled'
    ).length ?? 0

  const awaitingResponse =
    services?.filter(
      (service) =>
        service.status === 'Awaiting Response' ||
        service.status === 'Awaiting Client' ||
        service.status === 'Awaiting Documents'
    ).length ?? 0

  const completedRequests =
    services?.filter(
      (service) => service.status === 'Completed'
    ).length ?? 0

  const recentRequests =
    services?.slice(0, 5) ?? []

  const greeting =
    new Date().getHours() < 12
      ? 'Good Morning'
      : new Date().getHours() < 18
      ? 'Good Afternoon'
      : 'Good Evening'
return (
  <div className="space-y-8">

    {/* Hero */}

    <section className="rounded-3xl border bg-white p-8 shadow-sm">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            POG Advisory Client Portal
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {greeting},{' '}
            {profile?.first_name ??
              profile?.company_name ??
              'Client'}
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
            Welcome back to your secure client workspace.
            Track your accounting, tax and advisory requests,
            securely exchange documents and stay updated on
            every stage of your work with POG Advisory.
          </p>

        </div>

        <Button
          asChild
          size="lg"
          className="h-12 px-8"
        >
          <Link href="/portal/request-service">
            <PlusCircle className="mr-2 h-5 w-5" />
            Request a Service
          </Link>
        </Button>

      </div>

    </section>

    {/* Statistics */}

    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      <Card>
        <CardContent className="p-6">

          <p className="text-sm text-muted-foreground">
            Active Requests
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {activeRequests}
          </h2>

        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">

          <p className="text-sm text-muted-foreground">
            Awaiting Response
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {awaitingResponse}
          </h2>

        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">

          <p className="text-sm text-muted-foreground">
            Completed
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {completedRequests}
          </h2>

        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">

          <p className="text-sm text-muted-foreground">
            Documents
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {documentCount ?? 0}
          </h2>

        </CardContent>
      </Card>

    </section>

    {/* Recent Requests */}

    <section>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-semibold">
            Recent Requests
          </h2>

          <p className="text-muted-foreground">
            Your latest service requests.
          </p>

        </div>

        <Button
          variant="ghost"
          asChild
        >
          <Link href="/portal/my-requests">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

      </div>

      {recentRequests.length > 0 ? (

        <div className="space-y-4">

          {recentRequests.map((service) => (

            <Link
              key={service.id}
              href={`/portal/my-requests/${service.id}`}
            >

              <Card className="transition hover:shadow-md">

                <CardContent className="flex items-center justify-between p-6">

                  <div>

                    <h3 className="font-semibold text-lg">
                      {service.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.service_categories?.name ??
                        service.service_type}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">

                      <Clock3 className="h-4 w-4" />

                      Submitted{' '}
                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}

                    </div>

                  </div>

                  <StatusBadge
                    status={service.status}
                  />

                </CardContent>

              </Card>

            </Link>

          ))}

        </div>

      ) : (

        <Card>

          <CardContent className="flex flex-col items-center py-20">

            <FolderOpen className="mb-6 h-12 w-12 text-slate-300" />

            <h3 className="text-2xl font-semibold">
              No Requests Yet
            </h3>

            <p className="mt-3 max-w-md text-center text-muted-foreground">
              When you submit your first service request it
              will appear here together with its status,
              documents and updates.
            </p>

            <Button
              asChild
              className="mt-8"
            >
              <Link href="/portal/request-service">
                <PlusCircle className="mr-2 h-4 w-4" />
                Request Your First Service
              </Link>
            </Button>

          </CardContent>

        </Card>

      )}

    </section>

    {/* Activity */}

    <section>

      <div className="mb-6">

        <h2 className="text-2xl font-semibold">
          Recent Activity
        </h2>

        <p className="text-muted-foreground">
          Latest updates from your account.
        </p>

      </div>

      <Card>

        <CardContent className="divide-y p-0">

          {activity && activity.length > 0 ? (

            activity.map((item) => (

              <div
                key={item.id}
                className="flex items-start justify-between p-6"
              >

                <div>

                  <h4 className="font-medium">
                    {item.action}
                  </h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                </div>

                <span className="text-sm text-muted-foreground">
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </span>

              </div>

            ))

          ) : (

            <div className="p-8 text-center text-muted-foreground">
              No recent activity.
            </div>

          )}

        </CardContent>

      </Card>

    </section>

  </div>
)
}

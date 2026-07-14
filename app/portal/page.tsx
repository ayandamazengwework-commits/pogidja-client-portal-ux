import Link from 'next/link'
import {
  ArrowRight,
  Clock3,
  FileText,
  FolderOpen,
  PlusCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/stat-card'
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

 let documentCount = 0

if (client) {
  const serviceIds =
    services?.map((service) => service.id) ?? []

  if (serviceIds.length > 0) {
    const { count } = await supabase
      .from('service_documents')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .in('service_id', serviceIds)

    documentCount = count ?? 0
  }
}

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

  <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10">

  <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
  <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />

  <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    <div className="max-w-3xl">

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
        POG ADVISORY CLIENT PORTAL
      </p>

     <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
        {greeting},{' '}
        {profile?.first_name ??
          profile?.company_name ??
          'Client'}
      </h1>

     <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
        Track every request, upload documents securely,
        communicate directly with your accountant and
        monitor progress in real time.
      </p>

    </div>

   <Button
  asChild
  size="lg"
  className="h-14 w-full rounded-xl bg-white px-8 text-slate-900 hover:bg-slate-100 sm:w-auto"

    >
      <Link href="/portal/request-service">
        <PlusCircle className="mr-2 h-5 w-5" />
        New Request
      </Link>
    </Button>

  </div>

</section>

   
    {/* Statistics */}

   <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

  <StatCard
    title="Active Requests"
    value={activeRequests}
    subtitle="Currently in progress"
    icon={FolderOpen}
    iconBg="bg-blue-100"
    iconColor="text-blue-700"
  />

  <StatCard
    title="Awaiting Response"
    value={awaitingResponse}
    subtitle="Needs your attention"
    icon={Clock3}
    iconBg="bg-amber-100"
    iconColor="text-amber-700"
  />

  <StatCard
    title="Completed"
    value={completedRequests}
    subtitle="Successfully delivered"
    icon={ArrowRight}
    iconBg="bg-green-100"
    iconColor="text-green-700"
  />

  <StatCard
    title="Documents"
    value={documentCount ?? 0}
    subtitle="Securely stored"
    icon={FileText}
    iconBg="bg-purple-100"
    iconColor="text-purple-700"
  />

</section>
  {/* Recent Requests */}

<section className="space-y-6">

  <div className="flex items-end justify-between">

    <div>
      <h2 className="text-3xl font-bold tracking-tight">
        Recent Requests
      </h2>

      <p className="mt-1 text-muted-foreground">
        Follow every service request from submission to completion.
      </p>
    </div>

    <Button
      variant="ghost"
      asChild
      className="rounded-xl"
    >
      <Link href="/portal/cases">
        View All
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>

  </div>

  {services && services.length > 0 ? (

   <div className="grid gap-5 lg:grid-cols-2">

   {recentRequests.map((service) => (

        <Link
          key={service.id}
          href={`/portal/cases/${service.id}`}
        >

          <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400" />

            <CardContent className="space-y-5 p-5 sm:p-7">

             <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {service.service_categories?.name ??
                      service.service_type}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                </div>

                <StatusBadge
                  status={service.status}
                />

              </div>

              <div className="space-y-3">

                <div>

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-slate-500">
                      Progress
                    </span>

                    <span className="font-semibold">
                      {service.progress ?? 0}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
                      style={{
                        width: `${service.progress ?? 0}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              <div className="flex items-center justify-between border-t pt-5">

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Submitted
                  </p>

                  <p className="font-medium">
                    {new Date(
                      service.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

                <span className="flex items-center gap-2 font-semibold text-blue-600 transition group-hover:gap-3">

                  Open Request

                  <ArrowRight className="h-4 w-4" />

                </span>

              </div>

            </CardContent>

          </Card>

        </Link>

      ))}

    </div>

  ) : (

    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

      <CardContent className="flex flex-col items-center py-24">

        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">

          <FolderOpen className="h-12 w-12 text-slate-400" />

        </div>

        <h3 className="text-3xl font-bold">
          Your workspace is ready
        </h3>

        <p className="mt-4 max-w-xl text-center text-lg leading-8 text-slate-500">
          Once you submit your first service request,
          you'll be able to track progress, upload
          additional documents, communicate with your
          accountant and receive updates in real time.
        </p>

        <Button
          asChild
          size="lg"
          className="mt-10 rounded-xl px-8"
        >
          <Link href="/portal/request-service">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Your First Request
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

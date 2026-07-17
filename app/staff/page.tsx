import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/dashboard/activity'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function StaffDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name,last_name')
    .eq('id', user?.id)
    .single()

  const activity = await getRecentActivity()

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', {
      count: 'exact',
      head: true,
    })

  const { count: totalServices } = await supabase
    .from('services')
    .select('*', {
      count: 'exact',
      head: true,
    })

  const { count: totalDocuments } = await supabase
    .from('service_documents')
    .select('*', {
      count: 'exact',
      head: true,
    })

  const { count: activeCases } = await supabase
    .from('services')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .neq('status', 'Completed')

  const { count: completedCases } = await supabase
    .from('services')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('status', 'Completed')

  const { data: recentClients } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', {
      ascending: false,
    })
    .limit(5)

  const { data: recentServices } = await supabase
    .from('services')
    .select('*')
    .order('created_at', {
      ascending: false,
    })
    .limit(5)

  const now = new Date()
  const hour = now.getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening'

  return (
    <div className="space-y-8">

      {/* Hero */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] px-6 py-8 text-white shadow-xl lg:px-10 lg:py-10">

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200 md:text-sm">
              POG ADVISORY & CHARTERED ACCOUNTANTS INC.
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">

              {greeting},

              <br />

              {profile?.first_name} {profile?.last_name}

            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Welcome back to your staff workspace.
              Manage clients, monitor services,
              upload documents and keep track of
              everything happening across the practice.
            </p>

          </div>

          <Button
            asChild
            size="lg"
            className="w-full bg-white text-slate-900 hover:bg-slate-100 lg:w-auto"
          >
            <Link href="/staff/clients">

              View Clients

              <ArrowRight className="ml-2 h-5 w-5" />

            </Link>
          </Button>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg">

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Clients
              </p>

              <p className="mt-2 text-4xl font-bold">
                {totalClients ?? 0}
              </p>

            </div>

            <div className="rounded-2xl bg-blue-100 p-4">

              <Users className="h-7 w-7 text-blue-700" />

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg">

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Active Cases
              </p>

              <p className="mt-2 text-4xl font-bold">
                {activeCases ?? 0}
              </p>

            </div>

            <div className="rounded-2xl bg-amber-100 p-4">

              <Clock3 className="h-7 w-7 text-amber-700" />

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg">

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-4xl font-bold">
                {completedCases ?? 0}
              </p>

            </div>

            <div className="rounded-2xl bg-green-100 p-4">

              <CheckCircle2 className="h-7 w-7 text-green-700" />

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg">

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Documents
              </p>

              <p className="mt-2 text-4xl font-bold">
                {totalDocuments ?? 0}
              </p>

            </div>

            <div className="rounded-2xl bg-purple-100 p-4">

              <FileText className="h-7 w-7 text-purple-700" />

            </div>

          </CardContent>

        </Card>

      </section>

             {/* Dashboard Panels */}

      <section className="grid gap-6 xl:grid-cols-3">

        {/* Recent Clients */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Recent Clients
              </h2>

              <Link
                href="/staff/clients"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="space-y-4">

              {recentClients && recentClients.length > 0 ? (

                recentClients.map((client) => (

                  <div
                    key={client.id}
                    className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <p className="font-semibold">

                          {client.company_name ||

                            `${client.first_name ?? ''} ${client.last_name ?? ''}`}

                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {client.email}
                        </p>

                      </div>

                    </div>

                  </div>

                ))

              ) : (

                <div className="rounded-xl border border-dashed p-8 text-center">

                  <p className="text-sm text-slate-500">
                    No clients yet.
                  </p>

                </div>

              )}

            </div>

          </CardContent>

        </Card>

        {/* Recent Requests */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Recent Requests
              </h2>

              <Link
                href="/staff/services"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="space-y-4">

              {recentServices && recentServices.length > 0 ? (

                recentServices.map((service) => (

                  <div
                    key={service.id}
                    className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <p className="font-semibold">
                        {service.title}
                      </p>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">

                        {service.status}

                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">

                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}

                    </p>

                  </div>

                ))

              ) : (

                <div className="rounded-xl border border-dashed p-8 text-center">

                  <p className="text-sm text-slate-500">
                    No service requests.
                  </p>

                </div>

              )}

            </div>

          </CardContent>

        </Card>

        {/* Activity */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Recent Activity
              </h2>

            </div>

            <div className="space-y-4">

              {activity.length > 0 ? (

                activity.map((item) => (

                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                  >

                    <p className="font-semibold">
                      {item.action}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.description}
                    </p>

                  </div>

                ))

              ) : (

                <div className="rounded-xl border border-dashed p-8 text-center">

                  <p className="text-sm text-slate-500">
                    No recent activity.
                  </p>

                </div>

              )}

            </div>

          </CardContent>

        </Card>

      </section>

    </div>
  )
}

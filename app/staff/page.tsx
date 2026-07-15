import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/dashboard/activity'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function StaffDashboard() {
  const supabase = await createClient()

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
return (
  <div className="space-y-8">

    {/* Hero */}

    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
            POG ADVISORY
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Staff Workspace
          </h1>

          <p className="mt-5 max-w-2xl text-slate-300">
            Monitor every client, manage service requests,
            upload documents and track business activity
            from one central workspace.
          </p>

        </div>

        <Button
          asChild
          size="lg"
          className="bg-white text-slate-900 hover:bg-slate-100"
        >
          <Link href="/staff/clients">
            View Clients

            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

      </div>

    </section>

    {/* Statistics */}

    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <Card className="rounded-3xl border-0 shadow-sm">

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

      <Card className="rounded-3xl border-0 shadow-sm">

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

      <Card className="rounded-3xl border-0 shadow-sm">

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

      <Card className="rounded-3xl border-0 shadow-sm">

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
              className="text-sm font-medium text-blue-600"
            >
              View All
            </Link>

          </div>

          <div className="space-y-4">

            {recentClients && recentClients.length > 0 ? (

              recentClients.map((client) => (

                <div
                  key={client.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div>

                    <p className="font-semibold">
                      {client.company_name ||
                        `${client.first_name ?? ''} ${client.last_name ?? ''}`}
                    </p>

                    <p className="text-sm text-slate-500">
                      {client.email}
                    </p>

                  </div>

                </div>

              ))

            ) : (

              <p className="text-sm text-slate-500">
                No clients yet.
              </p>

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
              href="/staff/cases"
              className="text-sm font-medium text-blue-600"
            >
              View All
            </Link>

          </div>

          <div className="space-y-4">

            {recentServices && recentServices.length > 0 ? (

              recentServices.map((service) => (

                <div
                  key={service.id}
                  className="rounded-xl border p-4"
                >

                  <div className="flex items-center justify-between">

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

              <p className="text-sm text-slate-500">
                No service requests.
              </p>

            )}

          </div>

        </CardContent>

      </Card>

      {/* Activity */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-6">

          <h2 className="mb-6 text-xl font-bold">
            Recent Activity
          </h2>

          <div className="space-y-4">

            {activity.length > 0 ? (

              activity.map((item) => (

                <div
                  key={item.id}
                  className="rounded-xl border p-4"
                >

                  <p className="font-medium">

                    {item.action}

                  </p>

                  <p className="mt-1 text-sm text-slate-500">

                    {item.description}

                  </p>

                </div>

              ))

            ) : (

              <p className="text-sm text-slate-500">

                No recent activity.

              </p>

            )}

          </div>

        </CardContent>

      </Card>

    </section>
}

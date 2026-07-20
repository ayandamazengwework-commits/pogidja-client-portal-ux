import Link from 'next/link'
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services = [] } = await supabase
    .from('services')
    .select(`
      *,
      client:clients(
        id,
        company:company_id(name),
        profile:profile_id(first_name,last_name)
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  const total = services.length

  const inProgress = services.filter(
    (s) => s.status === 'In Progress'
  ).length

  const awaiting = services.filter(
    (s) => s.status === 'Pending'
  ).length

  const completed = services.filter(
    (s) => s.status === 'Completed'
  ).length

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              SERVICE REQUESTS
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Manage Services
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Create, assign and monitor every client service request.
            </p>

          </div>

          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100"
          >
            <Link href="/staff/services/new">
              <Plus className="mr-2 h-5 w-5" />
              New Service Request
            </Link>
          </Button>

        </div>

      </section>

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          icon={<Briefcase className="h-10 w-10 text-[#1E88E5]" />}
          title="Total Services"
          value={total}
        />

        <StatCard
          icon={<Clock3 className="h-10 w-10 text-amber-500" />}
          title="In Progress"
          value={inProgress}
        />

        <StatCard
          icon={<AlertCircle className="h-10 w-10 text-red-500" />}
          title="Pending"
          value={awaiting}
        />

        <StatCard
          icon={<CheckCircle2 className="h-10 w-10 text-green-500" />}
          title="Completed"
          value={completed}
        />

      </div>

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-0">

          {services.length === 0 ? (

            <div className="p-12 text-center">

              <Briefcase className="mx-auto h-16 w-16 text-slate-300" />

              <h2 className="mt-6 text-2xl font-bold">
                No Service Requests Yet
              </h2>

              <Button asChild className="mt-8">

                <Link href="/staff/services/new">
                  Create First Service
                </Link>

              </Button>

            </div>

          ) : (

            <table className="w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-left">Progress</th>

                </tr>

              </thead>

              <tbody>

                {services.map((service) => (

                  <tr
                    key={service.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <Link
                        href={`/staff/services/${service.id}`}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        {service.title}
                      </Link>

                    </td>

                    <td className="p-4">

                      {service.client?.company?.name ??
                        `${service.client?.profile?.first_name ?? ''} ${service.client?.profile?.last_name ?? ''}`}

                    </td>

                    <td className="p-4">
                      {service.status}
                    </td>

                    <td className="p-4">
                      {service.priority}
                    </td>

                    <td className="p-4">
                      {service.progress ?? 0}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </CardContent>

      </Card>

    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: number
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        {icon}
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>
          <p className="text-3xl font-bold">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

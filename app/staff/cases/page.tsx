import Link from 'next/link'
import {
  Search,
  Plus,
  FolderOpen,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function CasesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      clients(
        id,
        client_code,
        profile:profiles(
          first_name,
          last_name,
          company_name
        )
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  const active =
    services?.filter(
      (s) =>
        s.status !== 'Completed' &&
        s.status !== 'Cancelled'
    ).length ?? 0

  const completed =
    services?.filter(
      (s) => s.status === 'Completed'
    ).length ?? 0

  const awaiting =
    services?.filter(
      (s) =>
        s.status === 'Awaiting Client' ||
        s.status === 'Awaiting Documents'
    ).length ?? 0

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Cases
          </h1>

          <p className="mt-2 text-slate-500">
            Manage every client service request.
          </p>

        </div>

        <Button>

          <Plus className="mr-2 h-4 w-4" />

          New Case

        </Button>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-3">

        <Card>

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Active Cases
              </p>

              <p className="mt-2 text-4xl font-bold">
                {active}
              </p>

            </div>

            <FolderOpen className="h-10 w-10 text-blue-600" />

          </CardContent>

        </Card>

        <Card>

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Awaiting Client
              </p>

              <p className="mt-2 text-4xl font-bold">
                {awaiting}
              </p>

            </div>

            <Clock3 className="h-10 w-10 text-amber-500" />

          </CardContent>

        </Card>

        <Card>

          <CardContent className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-4xl font-bold">
                {completed}
              </p>

            </div>

            <CheckCircle2 className="h-10 w-10 text-green-600" />

          </CardContent>

        </Card>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          className="pl-11"
          placeholder="Search cases..."
        />

      </div>

      {/* Cases */}

      <div className="grid gap-5">

        {services?.length ? (

          services.map((service) => (

            <Link
              key={service.id}
              href={`/staff/cases/${service.id}`}
            >

              <Card className="transition hover:-translate-y-1 hover:shadow-xl">

                <CardContent className="space-y-5 p-6">

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        {service.service_type}
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {service.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">

                        {service.clients?.profile?.company_name ||

                          `${service.clients?.profile?.first_name ?? ''} ${service.clients?.profile?.last_name ?? ''}`}

                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">

                        {service.priority}

                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          service.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : service.status === 'Awaiting Client'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >

                        {service.status}

                      </span>

                    </div>

                  </div>

                  <div>

                    <div className="mb-2 flex justify-between text-sm">

                      <span>Progress</span>

                      <span>{service.progress ?? 0}%</span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-[#1E88E5]"
                        style={{
                          width: `${service.progress ?? 0}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">

                    <span>

                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}

                    </span>

                    <span className="flex items-center gap-2 text-[#1E88E5]">

                      Open Case →

                    </span>

                  </div>

                </CardContent>

              </Card>

            </Link>

          ))

        ) : (

          <Card>

            <CardContent className="py-20 text-center">

              <AlertCircle className="mx-auto mb-5 h-12 w-12 text-slate-300" />

              <h2 className="text-2xl font-bold">

                No Cases Yet

              </h2>

              <p className="mt-3 text-slate-500">

                Client service requests will appear here.

              </p>

            </CardContent>

          </Card>

        )}

      </div>

    </div>
  )
}

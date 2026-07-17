import Link from 'next/link'
import { Search, Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      category:service_categories(
        name
      ),
      client:clients(
        id,
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

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Requests
          </h1>

          <p className="text-slate-500">
            Manage all client requests.
          </p>

        </div>

        <Link href="/staff/services/new">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            New Request

          </Button>

        </Link>

      </div>

      <div className="relative max-w-md">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search requests..."
          className="pl-11"
        />

      </div>

      {services?.length ? (

        <div className="space-y-5">

          {services.map((service) => (

            <Link
              key={service.id}
              href={`/staff/services/${service.id}`}
            >

              <Card className="rounded-2xl transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">

                <CardContent className="space-y-6 p-6">

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-2">

                      <h2 className="text-xl font-semibold">
                        {service.title}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {service.category?.name}
                      </p>

                      <p className="font-medium">

                        {service.client?.profile?.company_name ||

                          `${service.client?.profile?.first_name ?? ''} ${service.client?.profile?.last_name ?? ''}`}

                      </p>

                    </div>

                    <div className="space-y-3 text-left lg:text-right">

                      <StatusBadge
                        label={service.status}
                        tone={
                          service.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : service.status === 'Working On It'
                            ? 'bg-orange-100 text-orange-700'
                            : service.status === 'In Review'
                            ? 'bg-purple-100 text-purple-700'
                            : service.status === 'Awaiting Documents'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }
                      />

                      <p className="text-sm text-slate-500">
                        Priority: {service.priority}
                      </p>

                      <p className="text-sm text-slate-500">
                        Progress: {service.progress ?? 0}%
                      </p>

                    </div>

                  </div>

                  <div>

                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">

                      <span>
                        Progress
                      </span>

                      <span>
                        {service.progress ?? 0}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className="h-full rounded-full bg-[#1E88E5]"
                        style={{
                          width: `${service.progress ?? 0}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:justify-between">

                    <span>
                      Request ID: {service.id.slice(0, 8)}
                    </span>

                    <span>
                      Created{' '}
                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}
                    </span>

                  </div>

                </CardContent>

              </Card>

            </Link>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl">

          <CardContent className="py-20 text-center">

            <h2 className="text-2xl font-bold">
              No Requests Yet
            </h2>

            <p className="mt-3 text-slate-500">
              Client requests will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

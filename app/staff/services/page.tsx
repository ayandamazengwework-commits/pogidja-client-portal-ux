import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      client:profiles!services_client_id_fkey (
        id,
        first_name,
        last_name,
        company_name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Services
          </h1>

          <p className="text-slate-500">
            Manage all client services.
          </p>
        </div>

        <Button>
          New Service
        </Button>

      </div>

      <Input placeholder="Search services..." />

      <div className="space-y-4">

        {services?.length ? (
          services.map((service) => (
            <Link
              key={service.id}
              href={`/staff/services/${service.id}`}
            >
              <Card className="transition hover:shadow-md">
                <CardContent className="p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <h2 className="text-xl font-semibold">
                        {service.title}
                      </h2>

                      <p className="text-slate-500">
                        {service.service_type}
                      </p>

                      <p className="mt-2 text-sm">
                        {service.client?.company_name ||
                          `${service.client?.first_name} ${service.client?.last_name}`}
                      </p>

                    </div>

                    <div className="text-right">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {service.status}
                      </span>

                      <p className="mt-3 text-sm">
                        Priority: {service.priority}
                      </p>

                      <p className="text-sm">
                        Progress: {service.progress}%
                      </p>

                    </div>

                  </div>

                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-slate-500">
              No services found.
            </CardContent>
          </Card>
        )}

      </div>

    </div>
  )
}

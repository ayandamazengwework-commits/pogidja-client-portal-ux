import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Requests
        </h1>

        <p className="text-slate-500">
          Manage all client requests.
        </p>

      </div>

      <Input placeholder="Search requests..." />

      <div className="space-y-4">

        {services?.length ? (
          services.map((service) => (
            <Link
              key={service.id}
              href={`/staff/services/${service.id}`}
            >
              <Card className="transition hover:shadow-md hover:border-primary">
                <CardContent className="p-6">

                  <div className="flex items-start justify-between">

                    <div className="space-y-2">

                      <h2 className="text-xl font-semibold">
                        {service.title}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {service.category?.name}
                      </p>

                      <p className="text-sm">

                        {service.client?.profile?.company_name ||

                          `${service.client?.profile?.first_name ?? ''} ${service.client?.profile?.last_name ?? ''}`}

                      </p>

                    </div>

                    <div className="text-right space-y-2">

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

                    </div>

                  </div>

                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              No requests found.
            </CardContent>
          </Card>
        )}

      </div>

    </div>
  )
}

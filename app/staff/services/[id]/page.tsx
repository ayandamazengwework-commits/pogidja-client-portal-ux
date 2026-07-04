import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ServicePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      client:profiles!services_client_id_fkey(
        id,
        first_name,
        last_name,
        company_name,
        email,
        phone
      ),
      assigned:profiles!services_assigned_to_fkey(
        first_name,
        last_name
      )
    `)
    .eq('id', id)
    .single()

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <Card>
        <CardContent className="p-8">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                {service.title}
              </h1>

              <p className="mt-2 text-slate-500">
                {service.service_type}
              </p>

            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {service.status}
            </span>

          </div>

        </CardContent>
      </Card>

      {/* Details */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card>
          <CardContent className="space-y-5 p-6">

            <h2 className="text-xl font-semibold">
              Service Details
            </h2>

            <div>

              <p className="text-sm text-slate-500">
                Priority
              </p>

              <p>{service.priority}</p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Progress
              </p>

              <p>{service.progress}%</p>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#1E88E5]"
                  style={{
                    width: `${service.progress}%`,
                  }}
                />
              </div>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Due Date
              </p>

              <p>{service.due_date ?? '-'}</p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Description
              </p>

              <p>
                {service.description || 'No description'}
              </p>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">

            <h2 className="text-xl font-semibold">
              Client
            </h2>

            <div>

              <p className="font-semibold">
                {service.client.company_name ||
                  `${service.client.first_name} ${service.client.last_name}`}
              </p>

              <p className="text-slate-500">
                {service.client.email}
              </p>

              <p className="text-slate-500">
                {service.client.phone}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Assigned Staff
              </p>

              <p>
                {service.assigned
                  ? `${service.assigned.first_name} ${service.assigned.last_name}`
                  : 'Unassigned'}
              </p>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* Documents */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Documents
          </h2>

          <p className="text-slate-500">
            Documents linked to this service will appear here.
          </p>

        </CardContent>
      </Card>

      {/* Messages */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Messages
          </h2>

          <p className="text-slate-500">
            Service conversation will appear here.
          </p>

        </CardContent>
      </Card>

      {/* Activity */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Activity
          </h2>

          <p className="text-slate-500">
            Activity timeline coming next.
          </p>

        </CardContent>
      </Card>

    </div>
  )
}

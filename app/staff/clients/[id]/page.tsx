import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ClientProfilePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(
        *
      ),
      company:companies(
        *
      )
    `)
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', client.profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      {/* Header */}

      <Card>
        <CardContent className="p-8">

          <div className="flex items-start gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E88E5] text-2xl font-bold text-white">
              {client.profile.first_name.charAt(0)}
              {client.profile.last_name.charAt(0)}
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                {client.profile.first_name} {client.profile.last_name}
              </h1>

              <p className="text-slate-500">
                {client.company?.name}
              </p>

              <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {client.status}
              </div>

            </div>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p>{client.profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p>{client.profile.phone || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Company</p>
              <p>{client.company?.name || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Client Code</p>
              <p>{client.client_code || '-'}</p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* Quick Stats */}

      <div className="grid gap-6 md:grid-cols-2">

        <Card>
          <CardContent className="p-6">

            <p className="text-sm text-slate-500">
              Services
            </p>

            <p className="mt-2 text-4xl font-bold">
              {services?.length ?? 0}
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <p className="text-sm text-slate-500">
              Activity
            </p>

            <p className="mt-2 text-4xl font-bold">
              {activity?.length ?? 0}
            </p>

          </CardContent>
        </Card>

      </div>

      {/* Services */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Services
          </h2>

          {services?.length ? (
            <div className="space-y-4">

              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border p-4"
                >
                  <h3 className="font-semibold">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {service.service_type}
                  </p>

                  <div className="mt-3 flex gap-4 text-sm">

                    <span>Status: {service.status}</span>

                    <span>Priority: {service.priority}</span>

                    <span>{service.progress}%</span>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <p className="text-slate-500">
              No services found.
            </p>
          )}

        </CardContent>
      </Card>

    </div>
  )
}

import Link from 'next/link'
import { Search, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      client_code,
      status,
      profile:profiles(
        first_name,
        last_name,
        email,
        phone
      ),
      company:companies(
        name
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      {/* Header */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              CLIENT MANAGEMENT
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Clients
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Manage all registered clients,
              monitor their services and open
              their profiles.
            </p>

          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <Users className="mx-auto mb-3 h-10 w-10 text-blue-200" />

              <p className="text-sm text-slate-300">
                Total Clients
              </p>

              <p className="mt-2 text-4xl font-bold">
                {clients?.length ?? 0}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* Search */}

      <div className="relative max-w-xl">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search clients..."
          className="pl-11"
        />

      </div>

      {/* Clients */}

      {clients && clients.length > 0 ? (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {clients.map((client) => {

            const initials = `${client.profile?.first_name?.[0] ?? ''}${client.profile?.last_name?.[0] ?? ''}`

            return (

              <Link
                key={client.id}
                href={`/staff/clients/${client.id}`}
              >

                <Card className="rounded-3xl border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">

                  <CardContent className="p-6">

                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">

                        {initials || '?'}

                      </div>

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate text-lg font-bold">

                          {client.company?.name ||

                            `${client.profile?.first_name ?? ''} ${client.profile?.last_name ?? ''}`}

                        </h2>

                        <p className="truncate text-sm text-slate-500">

                          {client.profile?.email}

                        </p>

                        <p className="mt-1 text-sm text-slate-400">

                          {client.profile?.phone || 'No phone number'}

                        </p>

                      </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          client.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : client.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {client.status}
                      </span>

                      <span className="text-xs text-slate-400">

                        {client.client_code || '-'}

                      </span>

                    </div>

                  </CardContent>

                </Card>

              </Link>

            )
          })}

        </div>

      ) : (

        <Card className="rounded-3xl">

          <CardContent className="py-20 text-center">

            <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">

              No Clients Yet

            </h2>

            <p className="mt-3 text-slate-500">

              Clients will appear here once they
              register and submit a service request.

            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}

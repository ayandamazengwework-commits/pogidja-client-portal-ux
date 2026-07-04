import Link from 'next/link'
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
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Clients
        </h1>

        <p className="text-slate-500">
          Manage all registered clients.
        </p>
      </div>

      <Input
        placeholder="Search clients..."
        className="max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {clients?.map((client) => (

          <Link
            key={client.id}
            href={`/staff/clients/${client.id}`}
          >

            <Card className="transition hover:shadow-lg">

              <CardContent className="space-y-3 p-5">

                <div>

                  <h2 className="text-lg font-semibold">

                    {client.company?.name ||

                      `${client.profile?.first_name ?? ''} ${client.profile?.last_name ?? ''}`}

                  </h2>

                  <p className="text-sm text-slate-500">
                    {client.profile?.email}
                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">

                    {client.status}

                  </span>

                  <span className="text-xs text-slate-400">

                    {client.client_code}

                  </span>

                </div>

              </CardContent>

            </Card>

          </Link>

        ))}

      </div>

    </div>
  )
}

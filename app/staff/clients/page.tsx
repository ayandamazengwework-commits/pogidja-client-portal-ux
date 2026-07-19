import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientSearch } from '@/components/staff/client-search'

import {
  Users,
  Plus,
} from 'lucide-react'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      id,
      profile_id,
      client_code,
      status,
      profile:profile_id (
        id,
        first_name,
        last_name,
        email,
        phone
      ),
      company:company_id (
        id,
        name
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  console.log('================ CLIENT QUERY ================')
  console.log('ERROR:', error)
  console.log(JSON.stringify(clients, null, 2))
  console.log('==============================================')

  return (
    <div className="space-y-8">

      {/* ================= HERO ================= */}

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
              Manage all registered clients, monitor their services,
              documents, invoices and communication from one place.
            </p>

          </div>

          <div className="flex flex-col gap-4">

            <Link href="/staff/clients/new">

              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Client
              </Button>

            </Link>

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

        </div>

      </section>

      {/* ================= CLIENT LIST ================= */}

      <ClientSearch clients={clients ?? []} />

    </div>
  )
}

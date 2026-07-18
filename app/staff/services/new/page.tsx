import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NewServiceForm } from '@/components/services/new-service-form'

export default async function NewServicePage() {
  const supabase = await createClient()

  // --------------------------------------------------
  // Load clients
  // --------------------------------------------------

  const { data: clientRows } = await supabase
    .from('clients')
    .select(`
      id,
      profile_id,
      client_code,
      status
    `)
    .order('created_at')

  const profileIds =
    clientRows?.map((c) => c.profile_id).filter(Boolean) ?? []

  const { data: profiles } =
    profileIds.length > 0
      ? await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            company_name,
            email,
            phone
          `)
          .in('id', profileIds)
      : { data: [] }

  const clients =
    clientRows?.map((client) => ({
      ...client,
      profile:
        profiles?.find(
          (p) => p.id === client.profile_id
        ) ?? null,
    })) ?? []

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('name')

  // --------------------------------------------------
  // Staff
  // --------------------------------------------------

  const { data: staff } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      role
    `)
    .in('role', [
      'staff',
      'manager',
      'admin',
    ])

  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              SERVICE MANAGEMENT
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Create New Service
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Create a new service request,
              assign staff members and begin
              tracking progress immediately.
            </p>

          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <Briefcase className="mx-auto mb-3 h-10 w-10 text-blue-200" />

              <p className="text-sm text-slate-300">
                Available Categories
              </p>

              <p className="mt-2 text-4xl font-bold">
                {categories?.length ?? 0}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* BACK BUTTON */}

      <div>

        <Button
          asChild
          variant="outline"
        >
          <Link href="/staff/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>

      </div>

      {/* FORM */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-8">

          <NewServiceForm
            clients={clients}
            categories={categories ?? []}
            staff={staff ?? []}
          />

        </CardContent>

      </Card>

    </div>
  )
}

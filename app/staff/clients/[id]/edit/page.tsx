import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { EditClientForm } from '@/components/staff/edit-client-form'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditClientPage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', client.profile_id)
    .single()

  if (!profile) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <Link
          href={`/staff/clients/${client.id}`}
          className="inline-flex items-center text-sm text-blue-200 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Client
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
          CLIENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Client
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Update the client's information, company details,
          contact details and status.
        </p>

      </section>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-8">

          <EditClientForm
            client={client}
            profile={profile}
          />

        </CardContent>
      </Card>
    </div>
  )
}

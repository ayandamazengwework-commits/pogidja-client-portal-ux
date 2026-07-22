import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { EditClientForm } from '@/components/staff/edit-client-form'

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <Link
          href={`/staff/clients/${id}`}
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
          Update client information, company details, address and status.
        </p>

      </section>

      <EditClientForm client={client} />

    </div>
  )
}

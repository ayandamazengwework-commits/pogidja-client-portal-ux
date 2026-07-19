import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { NewInvoiceForm } from '@/components/staff/new-invoice-form'

export default async function NewInvoicePage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      profile:profiles(
        first_name,
        last_name,
        company_name
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  if (!clients) {
    redirect('/staff/invoices')
  }

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white">

        <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
          BILLING
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Create Invoice
        </h1>

      </section>

      <NewInvoiceForm clients={clients} />

    </div>
  )
}

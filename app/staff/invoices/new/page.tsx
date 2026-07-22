import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  Receipt,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { NewInvoiceForm } from '@/components/staff/new-invoice-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function NewInvoicePage() {
  const supabase = await createClient()

  const { data: clients = [] } = await supabase
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

  if (!clients.length) {
    redirect('/staff/invoices')
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <Link
          href="/staff/invoices"
          className="inline-flex items-center text-sm text-blue-200 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Link>

        <div className="mt-8 flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10">

            <Receipt className="h-10 w-10 text-blue-200" />

          </div>

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
              BILLING
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Create Invoice
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Generate a professional invoice, assign it to a
              client and automatically notify them through the
              client portal.
            </p>

          </div>

        </div>

      </section>

      {/* INFO */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Invoice Details
            </h2>

            <p className="text-sm text-slate-500">
              Complete the information below to issue a new invoice.
            </p>

          </div>

          <Button
            asChild
            variant="outline"
          >
            <Link href="/staff/invoices">
              Cancel
            </Link>
          </Button>

        </CardContent>

      </Card>

      {/* FORM */}

      <NewInvoiceForm clients={clients} />

    </div>
  )
}

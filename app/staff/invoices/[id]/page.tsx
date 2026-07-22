import { notFound } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowLeft,
  Receipt,
  User,
  Calendar,
  CheckCircle2,
  Download,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { UploadInvoice } from '@/components/staff/upload-invoice'
import { UploadProofOfPayment } from '@/components/staff/upload-proof-of-payment'
import { InvoiceStatusPanel } from '@/components/staff/invoice-status-panel'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(
        id,
        profile:profiles(*),
        company:companies(*)
      )
    `)
    .eq('id', id)
    .single()

  if (!invoice) {
    notFound()
  }

  const profile = invoice.client.profile

  return (
    <div className="space-y-8">

      <Button
        asChild
        variant="ghost"
      >
        <Link href="/staff/invoices">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Link>
      </Button>

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
              INVOICE
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {invoice.invoice_number}
            </h1>

            <p className="mt-3 text-slate-300">
              {profile.company_name ??
                `${profile.first_name} ${profile.last_name}`}
            </p>

          </div>

          <UploadInvoice invoiceId={invoice.id} />

        </div>

      </section>

      <InvoiceStatusPanel invoice={invoice} />

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="rounded-3xl">

          <CardContent className="space-y-6 p-8">

            <h2 className="text-2xl font-bold">
              Invoice Information
            </h2>

            <div className="space-y-5">

              <Info
                icon={<Receipt className="h-5 w-5" />}
                title="Amount"
                value={`R${invoice.amount}`}
              />

              <Info
                icon={<Calendar className="h-5 w-5" />}
                title="Due Date"
                value={
                  invoice.due_date
                    ? new Date(
                        invoice.due_date
                      ).toLocaleDateString()
                    : 'None'
                }
              />

              <Info
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Status"
                value={invoice.status}
              />

            </div>

            {invoice.invoice_url && (

              <Button
                asChild
                variant="outline"
              >

                <Link
                  href={invoice.invoice_url}
                  target="_blank"
                >

                  <Download className="mr-2 h-4 w-4" />

                  Download Invoice

                </Link>

              </Button>

            )}

          </CardContent>

        </Card>

        <Card className="rounded-3xl">

          <CardContent className="space-y-6 p-8">

            <h2 className="text-2xl font-bold">
              Proof of Payment
            </h2>

            <UploadProofOfPayment
              invoiceId={invoice.id}
            />

            {invoice.proof_of_payment_url ? (

              <Button
                asChild
                variant="outline"
              >

                <Link
                  href={invoice.proof_of_payment_url}
                  target="_blank"
                >

                  <Download className="mr-2 h-4 w-4" />

                  Download POP

                </Link>

              </Button>

            ) : (

              <p className="text-slate-500">
                Waiting for proof of payment...
              </p>

            )}

          </CardContent>

        </Card>

      </div>

    </div>
  )
}

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4">

      {icon}

      <div>

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <p className="font-semibold">
          {value}
        </p>

      </div>

    </div>
  )
}

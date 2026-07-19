import Link from 'next/link'
import { Plus, Receipt } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function StaffInvoicesPage() {
  const supabase = await createClient()

  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(
        id,
        profile:profiles(
          first_name,
          last_name,
          company_name
        )
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
              BILLING
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Invoices
            </h1>

          </div>

          <Link href="/staff/invoices/new">

            <Button>

              <Plus className="mr-2 h-4 w-4" />

              Create Invoice

            </Button>

          </Link>

        </div>

      </section>

      <div className="space-y-5">

        {invoices?.map((invoice) => (

          <Card
            key={invoice.id}
            className="rounded-3xl"
          >

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <h2 className="text-xl font-bold">

                  {invoice.invoice_number}

                </h2>

                <p className="text-slate-500">

                  {invoice.client?.profile?.company_name ||

                    `${invoice.client?.profile?.first_name} ${invoice.client?.profile?.last_name}`}

                </p>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold">

                  R{invoice.amount}

                </p>

                <p className="text-sm text-slate-500">

                  {invoice.status}

                </p>

              </div>

            </CardContent>

          </Card>

        ))}

        {!invoices?.length && (

          <Card>

            <CardContent className="py-20 text-center">

              <Receipt className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <h2 className="text-2xl font-bold">

                No invoices yet

              </h2>

            </CardContent>

          </Card>

        )}

      </div>

    </div>
  )
}

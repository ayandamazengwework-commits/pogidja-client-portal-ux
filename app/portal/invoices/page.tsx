import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { Receipt } from 'lucide-react'

export default async function ClientInvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user!.id)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', client!.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white">

        <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
          BILLING
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          My Invoices
        </h1>

      </section>

      <div className="space-y-5">

        {invoices?.map((invoice) => (

          <Card
            key={invoice.id}
            className="rounded-3xl"
          >

            <CardContent className="space-y-6 p-8">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold">

                    {invoice.invoice_number}

                  </h2>

                  <p className="text-slate-500">

                    Status: {invoice.status}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-3xl font-bold">

                    R{invoice.amount}

                  </p>

                </div>

              </div>

              <div className="flex flex-wrap gap-4">

                {invoice.invoice_url && (

                  <Button asChild>

                    <Link
                      href={invoice.invoice_url}
                      target="_blank"
                    >
                      Download Invoice
                    </Link>

                  </Button>

                )}

                <Button asChild variant="outline">

                  <Link
                    href={`/portal/invoices/${invoice.id}`}
                  >
                    Upload Proof of Payment
                  </Link>

                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

        {!invoices?.length && (

          <Card>

            <CardContent className="py-20 text-center">

              <Receipt className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <h2 className="text-2xl font-bold">
                No invoices
              </h2>

            </CardContent>

          </Card>

        )}

      </div>

    </div>
  )
}

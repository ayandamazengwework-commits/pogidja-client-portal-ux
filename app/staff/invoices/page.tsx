import Link from 'next/link'
import {
  Plus,
  Receipt,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function StaffInvoicesPage() {
  const supabase = await createClient()

  const { data: invoices = [] } = await supabase
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

  const totalInvoices = invoices.length

  const paidInvoices = invoices.filter(
    (i) => i.status === 'Paid'
  ).length

  const pendingInvoices = invoices.filter(
    (i) =>
      i.status === 'Pending' ||
      i.status === 'Awaiting Payment'
  ).length

  const proofSubmitted = invoices.filter(
    (i) =>
      i.status === 'Payment Submitted'
  ).length

  const totalValue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount ?? 0),
    0
  )

  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
              BILLING
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Invoice Management
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Create, monitor and manage client invoices,
              payments and proof of payment submissions.
            </p>

          </div>

          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100"
          >
            <Link href="/staff/invoices/new">
              <Plus className="mr-2 h-5 w-5" />
              Create Invoice
            </Link>
          </Button>

        </div>

      </section>

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          icon={<Receipt className="h-9 w-9 text-blue-600" />}
          title="Invoices"
          value={totalInvoices.toString()}
        />

        <StatCard
          icon={<CheckCircle2 className="h-9 w-9 text-green-600" />}
          title="Paid"
          value={paidInvoices.toString()}
        />

        <StatCard
          icon={<Clock3 className="h-9 w-9 text-amber-500" />}
          title="Pending"
          value={pendingInvoices.toString()}
        />

        <StatCard
          icon={<AlertTriangle className="h-9 w-9 text-red-500" />}
          title="Awaiting Review"
          value={proofSubmitted.toString()}
        />

        <StatCard
          icon={<Receipt className="h-9 w-9 text-indigo-600" />}
          title="Invoice Value"
          value={`R${totalValue.toLocaleString()}`}
        />

      </div>

      {/* SEARCH */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-6">

          <div className="relative max-w-xl">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              disabled
              placeholder="Search coming in next update..."
              className="pl-11"
            />

          </div>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

        <CardContent className="p-0">

          {invoices.length === 0 ? (

            <div className="py-24 text-center">

              <Receipt className="mx-auto mb-5 h-14 w-14 text-slate-300" />

              <h2 className="text-2xl font-bold">
                No invoices yet
              </h2>

              <p className="mt-2 text-slate-500">
                Create your first invoice to begin billing clients.
              </p>

            </div>

          ) : (

            <table className="w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="p-5 text-left">
                    Invoice
                  </th>

                  <th className="p-5 text-left">
                    Client
                  </th>

                  <th className="p-5 text-left">
                    Amount
                  </th>

                  <th className="p-5 text-left">
                    Due Date
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                  <th className="p-5 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {invoices.map((invoice) => {

                  const clientName =
                    invoice.client?.profile?.company_name ||
                    `${invoice.client?.profile?.first_name ?? ''} ${invoice.client?.profile?.last_name ?? ''}`

                  const badge =
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : invoice.status === 'Payment Submitted'
                      ? 'bg-blue-100 text-blue-700'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-700'

                  return (

                    <tr
                      key={invoice.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-5 font-semibold">

                        {invoice.invoice_number}

                      </td>

                      <td className="p-5">

                        {clientName}

                      </td>

                      <td className="p-5 font-semibold">

                        R{Number(invoice.amount).toLocaleString()}

                      </td>

                      <td className="p-5">

                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : '-'}

                      </td>

                      <td className="p-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
                        >
                          {invoice.status}
                        </span>

                      </td>

                      <td className="p-5 text-right">

                        <Button
                          asChild
                          variant="outline"
                        >
                          <Link href={`/staff/invoices/${invoice.id}`}>
                            View
                          </Link>
                        </Button>

                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          )}

        </CardContent>

      </Card>

    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        {icon}
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>
          <p className="text-3xl font-bold">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'

import { createInvoice } from '@/app/staff/invoices/new/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Client {
  id: string
  profile: {
    first_name: string | null
    last_name: string | null
    company_name: string | null
  }
}

export function NewInvoiceForm({
  clients,
}: {
  clients: Client[]
}) {
  const [loading, setLoading] = useState(false)

  return (
    <Card className="rounded-3xl border-0 shadow-sm">

      <CardContent className="p-8">

        <form
          action={async (formData) => {
            setLoading(true)
            await createInvoice(formData)
          }}
          className="space-y-10"
        >

          {/* CLIENT */}

          <section className="space-y-6">

            <div>

              <h2 className="text-xl font-bold">
                Client
              </h2>

              <p className="text-sm text-slate-500">
                Select the client that will receive this invoice.
              </p>

            </div>

            <div>

              <Label>Client *</Label>

              <select
                required
                name="client_id"
                className="mt-2 w-full rounded-xl border p-3"
              >

                <option value="">
                  Select Client
                </option>

                {clients.map((client) => (

                  <option
                    key={client.id}
                    value={client.id}
                  >

                    {client.profile.company_name ||

                      `${client.profile.first_name ?? ''} ${client.profile.last_name ?? ''}`}

                  </option>

                ))}

              </select>

            </div>

          </section>

          {/* DETAILS */}

          <section className="space-y-6">

            <div>

              <h2 className="text-xl font-bold">
                Invoice Details
              </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <Label>Invoice Number *</Label>

                <Input
                  required
                  name="invoice_number"
                  placeholder="INV-2026-001"
                />

              </div>

              <div>

                <Label>Amount (ZAR) *</Label>

                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="amount"
                />

              </div>

              <div>

                <Label>Issue Date</Label>

                <Input
                  type="date"
                  name="issue_date"
                />

              </div>

              <div>

                <Label>Due Date</Label>

                <Input
                  type="date"
                  name="due_date"
                />

              </div>

            </div>

          </section>

          {/* DESCRIPTION */}

          <section className="space-y-6">

            <div>

              <h2 className="text-xl font-bold">
                Description
              </h2>

            </div>

            <Textarea
              rows={5}
              name="description"
              placeholder="Example:
Annual Financial Statements
VAT Submission
Payroll Services
Company Registration..."
            />

          </section>

          {/* PDF */}

          <section className="space-y-6">

            <div>

              <h2 className="text-xl font-bold">
                Invoice PDF
              </h2>

              <p className="text-sm text-slate-500">
                Optional. Leave blank if it will be uploaded later.
              </p>

            </div>

            <Input
              name="invoice_url"
              placeholder="https://..."
            />

          </section>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full text-base"
          >
            {loading
              ? 'Creating Invoice...'
              : 'Create Invoice'}
          </Button>

        </form>

      </CardContent>

    </Card>
  )
}

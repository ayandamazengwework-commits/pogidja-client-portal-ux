'use client'

import { createInvoice } from '@/app/staff/invoices/new/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function NewInvoiceForm({
  clients,
}: {
  clients: any[]
}) {
  return (
    <Card className="rounded-3xl">

      <CardContent className="p-8">

        <form
          action={createInvoice}
          className="space-y-6"
        >

          <div>

            <Label>Client</Label>

            <select
              name="client_id"
              required
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

                    `${client.profile.first_name} ${client.profile.last_name}`}

                </option>

              ))}

            </select>

          </div>

          <div>

            <Label>Invoice Number</Label>

            <Input
              name="invoice_number"
              required
            />

          </div>

          <div>

            <Label>Amount</Label>

            <Input
              type="number"
              step="0.01"
              name="amount"
              required
            />

          </div>

          <div>

            <Label>Due Date</Label>

            <Input
              type="date"
              name="due_date"
            />

          </div>

          <div>

            <Label>Invoice PDF URL</Label>

            <Input
              name="invoice_url"
              placeholder="https://..."
            />

          </div>

          <Button className="w-full">

            Create Invoice

          </Button>

        </form>

      </CardContent>

    </Card>
  )
}

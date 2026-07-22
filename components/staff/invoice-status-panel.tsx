'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'

import { updateInvoiceStatus } from '@/app/staff/invoices/actions'

export function InvoiceStatusPanel({
  invoiceId,
  status,
}: {
  invoiceId: string
  status: string
}) {
  const [pending, startTransition] = useTransition()

  function update(newStatus: string) {
    startTransition(async () => {
      await updateInvoiceStatus(invoiceId, newStatus)
    })
  }

  return (
    <div className="flex gap-3">

      <Button
        variant={
          status === 'Paid'
            ? 'default'
            : 'outline'
        }
        disabled={pending}
        onClick={() => update('Paid')}
      >
        Mark Paid
      </Button>

      <Button
        variant={
          status === 'Unpaid'
            ? 'default'
            : 'outline'
        }
        disabled={pending}
        onClick={() => update('Unpaid')}
      >
        Mark Unpaid
      </Button>

      <Button
        variant={
          status === 'Overdue'
            ? 'default'
            : 'outline'
        }
        disabled={pending}
        onClick={() => update('Overdue')}
      >
        Mark Overdue
      </Button>

    </div>
  )
}

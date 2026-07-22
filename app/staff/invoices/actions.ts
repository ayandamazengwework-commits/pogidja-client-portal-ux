'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function updateInvoiceStatus(
  invoiceId: string,
  status: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invoices')
    .update({
      status,
      paid:
        status === 'Paid',
      paid_at:
        status === 'Paid'
          ? new Date().toISOString()
          : null,
    })
    .eq('id', invoiceId)

  if (error) {
    throw error
  }

  revalidatePath('/staff/invoices')
  revalidatePath(`/staff/invoices/${invoiceId}`)
}

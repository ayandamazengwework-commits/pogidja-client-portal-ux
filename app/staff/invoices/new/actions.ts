'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function createInvoice(
  formData: FormData
) {
  const supabase = await createClient()

  const clientId = String(formData.get('client_id'))

  await supabase
    .from('invoices')
    .insert({

      client_id: clientId,

      invoice_number: String(
        formData.get('invoice_number')
      ),

      amount: Number(
        formData.get('amount')
      ),

      due_date: formData.get('due_date'),

      invoice_url: formData.get(
        'invoice_url'
      ),

      status: 'Unpaid',

    })

  revalidatePath('/staff/invoices')

  redirect('/staff/invoices')
}

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function uploadProofOfPayment(
  formData: FormData
) {
  const supabase = await createClient()

  const invoiceId = String(
    formData.get('invoice_id')
  )

  await supabase
    .from('invoices')
    .update({
      proof_of_payment: String(
        formData.get('proof_url')
      ),
      status: 'Payment Submitted',
    })
    .eq('id', invoiceId)

  revalidatePath('/portal/invoices')

  redirect('/portal/invoices')
}

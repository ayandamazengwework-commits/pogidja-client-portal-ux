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
      paid: status === 'Paid',
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

export async function uploadProofOfPayment(
  formData: FormData
) {
  const supabase = await createClient()

  const invoiceId = formData.get('invoiceId') as string
  const file = formData.get('file') as File

  if (!invoiceId) {
    throw new Error('Missing invoice ID')
  }

  if (!file || file.size === 0) {
    throw new Error('Please select a proof of payment.')
  }

  const extension =
    file.name.split('.').pop() || 'pdf'

  const fileName = `${invoiceId}/${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('proof-of-payments')
    .upload(fileName, file, {
      upsert: true,
    })

  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('proof-of-payments')
    .getPublicUrl(fileName)

  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      proof_of_payment_url: publicUrl,
      proof_uploaded_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)

  if (updateError) {
    throw updateError
  }

  revalidatePath('/staff/invoices')
  revalidatePath(`/staff/invoices/${invoiceId}`)
}

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function uploadProofOfPayment(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated.')
  }

  const invoiceId = String(formData.get('invoice_id'))
  const proofUrl = String(formData.get('proof_url'))

  // Update invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .update({
      proof_of_payment: proofUrl,
      status: 'Payment Submitted',
    })
    .eq('id', invoiceId)
    .select('service_id')
    .single()

  if (error) {
    throw error
  }

  // Activity Log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'client',
    action: 'Proof Of Payment Uploaded',
    description: 'Client uploaded proof of payment.',
    entity_type: 'invoice',
    entity_id: invoiceId,
  })

  // Notification for staff
  await supabase.from('notifications').insert({
    title: 'Proof of Payment Uploaded',
    message: 'A client has uploaded proof of payment.',
    type: 'payment',
    entity_type: 'invoice',
    entity_id: invoiceId,
    is_read: false,
  })

  revalidatePath('/portal/invoices')
  revalidatePath('/staff/invoices')

  if (invoice?.service_id) {
    revalidatePath(`/staff/services/${invoice.service_id}`)
  }

  redirect('/portal/invoices')
}

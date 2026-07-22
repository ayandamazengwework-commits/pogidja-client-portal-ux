'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

import { sendEmail } from '@/lib/email/send-email'

export async function createInvoice(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const clientId = String(formData.get('client_id'))
  const invoiceNumber = String(formData.get('invoice_number'))
  const amount = Number(formData.get('amount'))
  const issueDate = formData.get('issue_date')
  const dueDate = formData.get('due_date')
  const description = String(formData.get('description') ?? '')
  const invoiceUrl = String(formData.get('invoice_url') ?? '')

  // ----------------------------------------------------
  // CREATE INVOICE
  // ----------------------------------------------------

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      client_id: clientId,
      invoice_number: invoiceNumber,
      amount,
      issue_date: issueDate || null,
      due_date: dueDate || null,
      description,
      invoice_url: invoiceUrl || null,
      status: 'Unpaid',
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  // ----------------------------------------------------
  // CLIENT
  // ----------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select(`
      profile_id,
      profile:profiles(
        email,
        first_name
      )
    `)
    .eq('id', clientId)
    .single()

  // ----------------------------------------------------
  // NOTIFICATION
  // ----------------------------------------------------

  if (client?.profile_id) {
    await supabase.from('notifications').insert({
      user_id: client.profile_id,
      title: 'New Invoice',
      message: `Invoice ${invoiceNumber} has been issued.`,
      type: 'invoice',
      link: `/portal/invoices/${invoice.id}`,
      read: false,
    })
  }

  // ----------------------------------------------------
  // EMAIL
  // ----------------------------------------------------

  if (client?.profile?.email) {
    try {
      await sendEmail({
        to: client.profile.email,
        subject: `Invoice ${invoiceNumber}`,
        html: `
          <h2>Hello ${client.profile.first_name ?? 'Client'},</h2>

          <p>A new invoice has been created for your account.</p>

          <table style="border-collapse:collapse">
            <tr>
              <td><strong>Invoice:</strong></td>
              <td>${invoiceNumber}</td>
            </tr>
            <tr>
              <td><strong>Amount:</strong></td>
              <td>R${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Due Date:</strong></td>
              <td>${dueDate || 'Not specified'}</td>
            </tr>
          </table>

          ${
            description
              ? `<p><strong>Description</strong><br>${description}</p>`
              : ''
          }

          <p>Please log into your portal to view and pay the invoice.</p>
        `,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // ----------------------------------------------------
  // ACTIVITY LOG
  // ----------------------------------------------------

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    client_id: clientId,
    entity_type: 'invoice',
    entity_id: invoice.id,
    action: 'Invoice Created',
    description: invoiceNumber,
    role: 'staff',
  })

  revalidatePath('/staff/invoices')
  revalidatePath('/portal/invoices')

  redirect('/staff/invoices')
}

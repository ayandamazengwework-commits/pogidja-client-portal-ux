'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { sendClientWelcomeEmail } from '@/lib/email/send-client-welcome'
import { createClient } from '@/lib/supabase/server'

export async function createClientProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // =====================================================
  // FORM
  // =====================================================

  const firstName = String(formData.get('first_name') ?? '')
  const lastName = String(formData.get('last_name') ?? '')
  const email = String(formData.get('email') ?? '')
  const phone = String(formData.get('phone') ?? '')

  const companyName = String(formData.get('company_name') ?? '')
  const idNumber = String(formData.get('id_number') ?? '')
  const companyRegistration = String(
    formData.get('company_registration') ?? ''
  )
  const vatNumber = String(formData.get('vat_number') ?? '')
  const taxNumber = String(formData.get('tax_number') ?? '')

  const address = String(formData.get('address') ?? '')
  const city = String(formData.get('city') ?? '')
  const province = String(formData.get('province') ?? '')
  const postalCode = String(formData.get('postal_code') ?? '')
  const notes = String(formData.get('notes') ?? '')

  // =====================================================
  // PASSWORD
  // =====================================================

  const temporaryPassword =
    randomBytes(5).toString('hex') + '!'

  // =====================================================
  // CREATE AUTH USER
  // =====================================================

  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    })

  if (authError) {
    throw new Error(authError.message)
  }

  // =====================================================
  // PROFILE
  // =====================================================

  const { data: profile, error: profileError } =
    await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,

        first_name: firstName,
        last_name: lastName,
        email,
        phone,

        role: 'client',

        company_name: companyName,
        id_number: idNumber,
        company_registration: companyRegistration,
        vat_number: vatNumber,
        tax_number: taxNumber,

        address,
        city,
        province,
        postal_code: postalCode,

        active: true,
        client_status: 'Pending',

        notes,
      })
      .select()
      .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  // =====================================================
  // CLIENT
  // =====================================================

  const clientCode = `POG-${Date.now()}`

  const { data: client, error: clientError } =
    await supabase
      .from('clients')
      .insert({
        profile_id: profile.id,
        client_code: clientCode,
        status: 'Pending',
      })
      .select()
      .single()

  if (clientError) {
    throw new Error(clientError.message)
  }

  // =====================================================
  // DEFAULT SERVICE
  // =====================================================

  const { data: service } = await supabase
    .from('services')
    .insert({
      client_id: client.id,
      title: 'Client Onboarding',
      service_type: 'Onboarding',
      description:
        'Waiting for required client documents.',
      status: 'Waiting For Documents',
      priority: 'Normal',
      progress: 5,
      assigned_to: user.id,
    })
    .select()
    .single()

  // =====================================================
  // FIRST MESSAGE
  // =====================================================

  await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: profile.id,
      service_id: service?.id,

      subject: 'Welcome to POG Advisory',

      body: `Welcome ${firstName}.

Your client profile has been created.

Please log into your portal and upload the requested documents so we can begin processing your application.

Username:
${email}

Temporary Password:
${temporaryPassword}

Once logged in you can:

• Upload documents
• View your application progress
• View invoices
• Upload proof of payment
• Chat directly with us

Thank you.`,
    })

  // =====================================================
  // ACTIVITY
  // =====================================================

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      role: 'staff',
      client_id: client.id,
      entity_type: 'client',
      entity_id: client.id,
      action: 'Client Created',
      description: `${firstName} ${lastName} onboarded`,
    })

  // =====================================================
  // EMAIL
  // =====================================================

await sendClientWelcomeEmail({
  email,
  firstName,
  temporaryPassword,
})

  revalidatePath('/staff/clients')

  redirect(`/staff/services/${service?.id}`)
}

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
  // INVITE USER
  // =====================================================

  const { data: invite, error: inviteError } =
    await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'client',
        first_name: firstName,
        last_name: lastName,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    })

  if (inviteError) {
    throw new Error(inviteError.message)
  }

  const authUser = invite.user

  if (!authUser) {
    throw new Error('Failed to create client account.')
  }

  // =====================================================
  // PROFILE
  // =====================================================

  const { data: profile, error: profileError } =
    await supabase
      .from('profiles')
      .insert({
        id: authUser.id,

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

  await supabase.from('messages').insert({
    sender_id: user.id,
    recipient_id: profile.id,
    service_id: service?.id,

    subject: 'Welcome to POG Advisory',

    body: `Welcome ${firstName}.

Your client portal has been created.

Please check your email.

You will receive a secure invitation link from POG Advisory.

Click the link to:

• Create your password
• Sign in securely
• Upload your required documents
• Complete your onboarding
• Track your services
• Message your consultant

We look forward to working with you.`,
  })

  // =====================================================
  // NOTIFICATION
  // =====================================================

  await supabase.from('notifications').insert({
    user_id: profile.id,
    title: 'Welcome to POG Advisory',
    message:
      'Please check your email to activate your client portal.',
    type: 'onboarding',
    link: '/portal',
    read: false,
  })

  // =====================================================
  // ACTIVITY
  // =====================================================

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    client_id: client.id,
    entity_type: 'client',
    entity_id: client.id,
    action: 'Client Created',
    description: `${firstName} ${lastName} onboarded`,
  })

  revalidatePath('/staff/clients')

  redirect(`/staff/services/${service?.id}`)
}

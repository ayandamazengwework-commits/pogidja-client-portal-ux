'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

import { createClient } from '@/lib/supabase/server'
import { sendClientInvite } from '@/lib/email/send-client-invite'

export async function createClientProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

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

  //
  // Generate temporary password
  //

  const temporaryPassword =
    randomBytes(5).toString('hex') + '!'

  //
  // Create Auth User
  //

  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    })

  if (authError) {
    throw new Error(authError.message)
  }

  //
  // Create Profile
  //

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

  //
  // Create Client
  //

  const clientCode = `POG-${Date.now()}`

  const { data: client, error: clientError } =
    await supabase
      .from('clients')
      .insert({
        profile_id: profile.id,
        client_code: clientCode,
        status: 'pending',
      })
      .select()
      .single()

  if (clientError) {
    throw new Error(clientError.message)
  }

  //
  // Activity
  //

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    client_id: client.id,
    action: 'Client Created',
    description: `${firstName} ${lastName} created`,
    entity_type: 'client',
    entity_id: client.id,
  })

  //
  // Send Welcome Email
  //

  try {
    await sendClientInvite({
      email,
      firstName,
      temporaryPassword,
    })
  } catch (err) {
    console.error('Failed to send invite email', err)
  }

  revalidatePath('/staff/clients')
  revalidatePath(`/staff/clients/${client.id}`)

  redirect(`/staff/clients/${client.id}`)
}

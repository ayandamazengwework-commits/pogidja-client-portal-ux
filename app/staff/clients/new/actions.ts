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

  // Create profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
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
      notes,
      active: true,
      client_status: 'Pending',
    })
    .select()
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  // Create client record
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      profile_id: profile.id,
      status: 'pending',
    })
    .select()
    .single()

  if (clientError) {
    throw new Error(clientError.message)
  }

  // Activity Log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    client_id: client.id,
    role: 'staff',
    action: 'Client Created',
    description: `Created client ${firstName} ${lastName}`,
    entity_type: 'client',
    entity_id: client.id,
  })

  revalidatePath('/staff/clients')

  redirect(`/staff/clients/${client.id}`)
}

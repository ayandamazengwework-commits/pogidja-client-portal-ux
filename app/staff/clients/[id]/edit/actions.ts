'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function updateClientProfile(
  formData: FormData
) {
  const supabase = await createClient()

  const clientId = String(formData.get('client_id'))
  const profileId = String(formData.get('profile_id'))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // ==========================
  // UPDATE PROFILE
  // ==========================

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: String(formData.get('first_name') ?? ''),
      last_name: String(formData.get('last_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      company_name: String(formData.get('company_name') ?? ''),
      id_number: String(formData.get('id_number') ?? ''),
      company_registration: String(
        formData.get('company_registration') ?? ''
      ),
      vat_number: String(formData.get('vat_number') ?? ''),
      tax_number: String(formData.get('tax_number') ?? ''),
      address: String(formData.get('address') ?? ''),
      city: String(formData.get('city') ?? ''),
      province: String(formData.get('province') ?? ''),
      postal_code: String(formData.get('postal_code') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    })
    .eq('id', profileId)

  if (profileError) {
    throw new Error(profileError.message)
  }

  // ==========================
  // UPDATE CLIENT STATUS
  // ==========================

  const { error: clientError } = await supabase
    .from('clients')
    .update({
      status: String(formData.get('status')),
    })
    .eq('id', clientId)

  if (clientError) {
    throw new Error(clientError.message)
  }

  // ==========================
  // ACTIVITY LOG
  // ==========================

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      role: 'staff',
      client_id: clientId,
      entity_type: 'client',
      entity_id: clientId,
      action: 'Client Updated',
      description: 'Client profile edited',
    })

  revalidatePath(`/staff/clients`)
  revalidatePath(`/staff/clients/${clientId}`)

  redirect(`/staff/clients/${clientId}`)
}

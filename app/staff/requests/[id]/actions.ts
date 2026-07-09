'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function updateRequestStatus(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('services')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw error
  }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    action: 'Status Updated',
    description: status,
    entity_type: 'service',
    entity_id: id,
  })

  revalidatePath(`/staff/requests/${id}`)
  revalidatePath('/staff/requests')
  revalidatePath('/portal/my-requests')
}

'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function createDocumentRequest(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const serviceId = String(formData.get('service_id'))
  const clientId = String(formData.get('client_id'))

  const title = String(formData.get('title'))
  const description = String(
    formData.get('description') ?? ''
  )

  await supabase
    .from('document_requests')
    .insert({
      service_id: serviceId,
      client_id: clientId,
      title,
      description,
      created_by: user.id,
    })

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    client_id: clientId,
    role: 'staff',
    action: 'Requested Document',
    description: title,
    entity_type: 'service',
    entity_id: serviceId,
  })

  revalidatePath(`/staff/services/${serviceId}`)
}

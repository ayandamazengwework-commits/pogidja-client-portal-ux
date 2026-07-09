'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function createRequest(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string

  // Find the client's record
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (clientError || !client) {
    throw new Error('Client profile not found.')
  }

  // Create the request
  const { data: service, error } = await supabase
    .from('services')
    .insert({
      client_id: client.id,
      title,
      description,
      service_category_id: categoryId,
      service_type: 'General',
      status: 'Submitted',
      priority: 'Normal',
      progress: 0,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Activity log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'client',
    action: 'Service Request Submitted',
    description: title,
    entity_type: 'service',
    entity_id: service.id,
  })

  redirect('/portal/my-requests')
}

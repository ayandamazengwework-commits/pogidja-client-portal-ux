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

  const { error } = await supabase
    .from('services')
    .insert({
      client_id: user.id,
      title,
      description,
      service_category_id: categoryId,
      service_type: 'General',
      status: 'Submitted',
      progress: 0,
    })

  if (error) {
    throw new Error(error.message)
  }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'client',
    action: 'Service Request Submitted',
    description: title,
    entity_type: 'service',
  })

  redirect('/portal')
}

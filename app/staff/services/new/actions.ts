'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function createService(formData: FormData) {
  const supabase = await createClient()

  // Logged in staff member
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const clientId = formData.get('client_id') as string
  const title = formData.get('title') as string
  const categoryId = formData.get('service_category_id') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const dueDate = formData.get('due_date') as string
  const progress = Number(formData.get('progress') || 0)
  const assignedTo =
    (formData.get('assigned_to') as string) || null

  // Lookup category name
  const { data: category } = await supabase
    .from('service_categories')
    .select('name')
    .eq('id', categoryId)
    .single()

  const serviceType = category?.name ?? 'General'

  const { data: service, error } = await supabase
    .from('services')
    .insert({
      client_id: clientId,
      assigned_to: assignedTo,
      title,
      service_type: serviceType,
      service_category_id: categoryId,
      description,
      priority,
      due_date: dueDate || null,
      progress,
      status: 'Pending',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Activity Log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Created Service',
    description: `${title} created`,
    entity_type: 'service',
    entity_id: service.id,
  })

  revalidatePath('/staff/services')
  revalidatePath(`/staff/clients/${clientId}`)

  redirect('/staff/services')
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function createService(formData: FormData) {
  const supabase = await createClient()

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
    role: 'staff',
    client_id: clientId,
    action: 'service_created',
    description: `Created service "${title}"`,
    entity_type: 'service',
    entity_id: service.id,
  })

  revalidatePath('/staff/services')
  revalidatePath(`/staff/services/${service.id}`)
  revalidatePath(`/staff/clients/${clientId}`)

  redirect('/staff/services')
}

export async function updateService(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const serviceId = formData.get('serviceId') as string
  const status = formData.get('status') as string
  const priority = formData.get('priority') as string
  const progress = Number(formData.get('progress'))
  const dueDate = formData.get('due_date') as string

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (!service) {
    throw new Error('Service not found')
  }

  const { error } = await supabase
    .from('services')
    .update({
      status,
      priority,
      progress,
      due_date: dueDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', serviceId)

  if (error) {
    throw error
  }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    client_id: service.client_id,
    action: 'service_updated',
    description: `Updated "${service.title}" to ${status} (${progress}%)`,
    entity_type: 'service',
    entity_id: serviceId,
  })

 revalidatePath('/staff/services')
revalidatePath(`/staff/services/${service.id}`)
revalidatePath(`/staff/clients/${clientId}`)

return {
  success: true,
  id: service.id,
}


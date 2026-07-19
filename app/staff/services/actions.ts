'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function toggleChecklistItem(
  serviceId: string,
  checklistId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: item, error } = await supabase
    .from('service_checklist')
    .select('completed,title')
    .eq('id', checklistId)
    .single()

  if (error) throw new Error(error.message)

  const completed = !item.completed

  const { error: updateError } = await supabase
    .from('service_checklist')
    .update({
      completed,
      completed_at: completed
        ? new Date().toISOString()
        : null,
      completed_by: completed
        ? user.id
        : null,
    })
    .eq('id', checklistId)

  if (updateError) throw new Error(updateError.message)

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    entity_type: 'service',
    entity_id: serviceId,
    action: completed
      ? 'Checklist Completed'
      : 'Checklist Reopened',
    description: item.title,
    read: false,
  })

  revalidatePath(`/staff/services/${serviceId}`)
}

export async function createChecklistItem(
  serviceId: string,
  title: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('service_checklist')
    .insert({
      service_id: serviceId,
      title,
      completed: false,
    })

  if (error) throw new Error(error.message)

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    entity_type: 'service',
    entity_id: serviceId,
    action: 'Checklist Item Added',
    description: title,
    read: false,
  })

  revalidatePath(`/staff/services/${serviceId}`)
}

export async function saveInternalNotes(
  serviceId: string,
  notes: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('services')
    .update({
      internal_notes: notes,
    })
    .eq('id', serviceId)

  if (error) throw new Error(error.message)

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    entity_type: 'service',
    entity_id: serviceId,
    action: 'Updated Internal Notes',
    description: 'Internal notes updated',
    read: false,
  })

  revalidatePath(`/staff/services/${serviceId}`)
}

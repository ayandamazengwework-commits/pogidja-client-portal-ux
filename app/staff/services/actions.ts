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

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get current value

  const { data: item, error } = await supabase
    .from('service_checklist')
    .select('completed')
    .eq('id', checklistId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Toggle

  const { error: updateError } = await supabase
    .from('service_checklist')
    .update({
      completed: !item.completed,
      completed_at: !item.completed
        ? new Date().toISOString()
        : null,
      completed_by: !item.completed
        ? user.id
        : null,
    })
    .eq('id', checklistId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  // Activity Log

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    entity_type: 'service',
    entity_id: serviceId,
    action: !item.completed
      ? 'Checklist Completed'
      : 'Checklist Reopened',
    description: `Checklist item updated`,
  })

  revalidatePath(`/staff/services/${serviceId}`)
}

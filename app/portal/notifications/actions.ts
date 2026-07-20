'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function markNotificationAsRead(
  notificationId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await supabase
    .from('notifications')
    .update({
      read: true,
    })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  revalidatePath('/portal')
  revalidatePath('/portal/notifications')
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await supabase
    .from('notifications')
    .update({
      read: true,
    })
    .eq('user_id', user.id)
    .eq('read', false)

  revalidatePath('/portal')
  revalidatePath('/portal/notifications')
}

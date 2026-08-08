'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'


export async function markNotificationAsRead(
  notificationId: string
) {

  const supabase =
    await createClient()


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser()


  if (!user) {
    throw new Error(
      'Not authenticated'
    )
  }


  const {
    error,
  } =
    await supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq(
        'id',
        notificationId
      )
      .eq(
        'user_id',
        user.id
      )


  if (error) {

    console.error(
      'Failed to mark notification as read:',
      error
    )

    throw new Error(
      error.message
    )
  }


  revalidatePath(
    '/portal/notifications'
  )

  revalidatePath(
    '/portal'
  )
}



export async function markAllNotificationsAsRead() {

  const supabase =
    await createClient()


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser()


  if (!user) {
    throw new Error(
      'Not authenticated'
    )
  }


  const {
    error,
  } =
    await supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq(
        'user_id',
        user.id
      )
      .eq(
        'read',
        false
      )


  if (error) {

    console.error(
      'Failed to mark all notifications as read:',
      error
    )

    throw new Error(
      error.message
    )
  }


  revalidatePath(
    '/portal/notifications'
  )

  revalidatePath(
    '/portal'
  )
}

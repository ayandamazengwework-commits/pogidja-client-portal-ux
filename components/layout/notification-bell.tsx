import Link from 'next/link'
import { Bell } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export async function NotificationBell() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { count, error } = await supabase
    .from('notifications')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) {
    console.error(
      'Failed to load notification count:',
      error
    )
  }

  const unreadCount = count ?? 0

  return (
    <Link
      href="/portal/notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : 'Notifications'
      }
    >
      <Bell className="h-5 w-5 text-slate-700" />

      {unreadCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white"
          aria-label={`${unreadCount} unread notifications`}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}

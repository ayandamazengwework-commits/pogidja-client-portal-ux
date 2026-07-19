import Link from 'next/link'
import { Bell } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export async function NotificationBell() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { count } = await supabase
    .from('activity_logs')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('read', false)

  return (
    <Link
      href="/staff/notifications"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-slate-50"
    >
      <Bell className="h-5 w-5 text-slate-700" />

      {(count ?? 0) > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

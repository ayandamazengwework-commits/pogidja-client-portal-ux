'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StaffTopbarProps {
  profile: {
    first_name?: string | null
    last_name?: string | null
    role?: string | null
  } | null
}

export function StaffTopbar({
  profile,
}: StaffTopbarProps) {
  const [today, setToday] = useState('')
  const [greeting, setGreeting] = useState('Welcome')

  // Temporary notification count
  // We'll replace this with Supabase realtime later.
  const unreadNotifications = 5

  useEffect(() => {
    const now = new Date()

    const hour = now.getHours()

    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }

    setToday(
      now.toLocaleDateString('en-ZA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    )
  }, [])

  const firstName = profile?.first_name ?? 'Staff'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">

      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        <div>

          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {firstName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {today}
          </p>

        </div>

        <div className="flex w-full items-center gap-3 lg:w-auto">

          <div className="relative flex-1 lg:w-80 lg:flex-none">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search clients, services..."
              className="pl-10"
            />

          </div>

          <Link href="/staff/notifications">

            <Button
              variant="outline"
              size="icon"
              className="relative shrink-0"
            >

              <Bell className="h-5 w-5" />

              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}

            </Button>

          </Link>

        </div>

      </div>

    </header>
  )
}

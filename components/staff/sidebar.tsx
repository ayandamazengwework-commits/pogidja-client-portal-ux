'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'

export const staffNavigation = [
  {
    name: 'Dashboard',
    href: '/staff',
    icon: LayoutDashboard,
  },
  {
    name: 'Clients',
    href: '/staff/clients',
    icon: Users,
  },
  {
    name: 'Services',
    href: '/staff/services',
    icon: Briefcase,
  },
  {
    name: 'Documents',
    href: '/staff/documents',
    icon: FileText,
  },
  {
    name: 'Messages',
    href: '/staff/messages',
    icon: MessageSquare,
  },
  {
    name: 'Notifications',
    href: '/staff/notifications',
    icon: Bell,
  },
  {
    name: 'Settings',
    href: '/staff/settings',
    icon: Settings,
  },
]

interface StaffSidebarProps {
  profile: {
    first_name: string
    last_name: string
    role: string
  } | null
}

export function StaffSidebar({
  profile,
}: StaffSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [loggingOut, setLoggingOut] = useState(false)

  const initials = profile
    ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : '??'

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : 'Unknown User'

  const role = profile
    ? profile.role.charAt(0).toUpperCase() +
      profile.role.slice(1)
    : 'Staff'

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)

    const supabase = createClient()

    await supabase.auth.signOut()

    router.replace('/auth/staff-login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* ====================================================== */}
      {/* LOGO                                                   */}
      {/* ====================================================== */}

      <div className="flex h-[92px] items-center border-b border-slate-200 px-6">
        <Link
          href="/staff"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365D] text-lg font-bold text-white shadow-sm">
            P
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-slate-900">
              POG ADVISORY
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              & Chartered Accountants Inc.
            </p>
          </div>
        </Link>
      </div>

      {/* ====================================================== */}
      {/* NAVIGATION                                              */}
      {/* ====================================================== */}

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {staffNavigation.map((item) => {
            const Icon = item.icon

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#1E88E5] text-white shadow-md shadow-blue-100'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ====================================================== */}
      {/* LOGGED-IN USER                                          */}
      {/* ====================================================== */}

      <div className="border-t border-slate-200 p-5">
        <div className="rounded-2xl bg-slate-50 p-4">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E88E5] text-sm font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {fullName}
              </p>

              <p className="text-sm text-slate-500">
                {role}
              </p>
            </div>

          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>

        </div>
      </div>

    </aside>
  )
}

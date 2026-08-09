'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { staffNavigation } from '@/components/staff/sidebar'

interface StaffTopbarProps {
  profile: {
    id?: string
    first_name?: string | null
    last_name?: string | null
    role?: string | null
  } | null
}

export function StaffTopbar({
  profile,
}: StaffTopbarProps) {
  const supabase = createClient()

  const [today, setToday] = useState('')
  const [greeting, setGreeting] = useState('Welcome')
  const [notificationCount, setNotificationCount] =
    useState(0)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [loggingOut, setLoggingOut] =
    useState(false)

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

  useEffect(() => {
    async function loadNotifications() {
      const { count } = await supabase
        .from('notifications')
        .select('*', {
          head: true,
          count: 'exact',
        })
        .eq('read', false)

      setNotificationCount(count ?? 0)
    }

    loadNotifications()
  }, [supabase])

  const firstName =
    profile?.first_name ?? 'Staff'

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)

    await supabase.auth.signOut()

    window.location.href = '/auth/staff-login'
  }

  return (
    <header className="border-b border-slate-200 bg-white">

      {/* ====================================================== */}
      {/* DESKTOP / MOBILE TOPBAR                               */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        {/* Greeting */}

        <div className="flex items-start gap-3">

          {/* MOBILE MENU */}

          <div className="lg:hidden">

            <Sheet
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >

              <SheetTrigger asChild>

                <Button
                  variant="outline"
                  size="icon"
                  className="mt-0.5 shrink-0 border-slate-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>

              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[290px] border-slate-200 bg-white p-0"
              >

                <SheetTitle className="sr-only">
                  Staff Navigation
                </SheetTitle>

                {/* MOBILE LOGO */}

                <div className="flex h-[92px] items-center border-b border-slate-200 px-6">

                  <Link
                    href="/staff"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
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

                {/* MOBILE NAVIGATION */}

                <div className="flex h-[calc(100vh-92px)] flex-col">

                  <nav className="flex-1 overflow-y-auto p-4">

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Staff Workspace
                    </p>

                    <div className="space-y-1">

                      {staffNavigation.map((item) => {

                        const Icon = item.icon

                        const active =
                          window.location.pathname ===
                            item.href ||
                          window.location.pathname.startsWith(
                            item.href + '/'
                          )

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() =>
                              setMobileMenuOpen(false)
                            }
                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
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

                  {/* MOBILE USER */}

                  <div className="border-t border-slate-200 p-4">

                    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E88E5] text-sm font-bold text-white">
                        {`${profile?.first_name?.[0] ?? ''}${profile?.last_name?.[0] ?? ''}`.toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-900">
                          {profile?.first_name}{' '}
                          {profile?.last_name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {profile?.role
                            ? profile.role
                                .charAt(0)
                                .toUpperCase() +
                              profile.role.slice(1)
                            : 'Staff'}
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

              </SheetContent>

            </Sheet>

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {greeting}, {firstName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {today}
            </p>

          </div>

        </div>

        {/* ================================================== */}
        {/* SEARCH + NOTIFICATIONS                             */}
        {/* ================================================== */}

        <div className="flex w-full items-center gap-3 lg:w-auto">

          <div className="relative flex-1 lg:w-80 lg:flex-none">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search clients, services..."
              className="h-11 border-slate-200 bg-white pl-10 shadow-sm"
            />

          </div>

          <Button
            asChild
            variant="outline"
            size="icon"
            className="relative h-11 w-11 shrink-0 border-slate-200 bg-white"
          >

            <Link href="/staff/notifications">

              <Bell className="h-5 w-5" />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}

            </Link>

          </Button>

        </div>

      </div>

    </header>
  )
}

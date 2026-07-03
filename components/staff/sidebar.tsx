'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const navigation = [
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
    name: 'Calendar',
    href: '/staff/calendar',
    icon: Calendar,
  },
  {
    name: 'Notifications',
    href: '/staff/notifications',
    icon: Bell,
  },
  {
    name: 'Reports',
    href: '/staff/reports',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/staff/settings',
    icon: Settings,
  },
]

export function StaffSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}

      <div className="border-b border-slate-200 p-8">

        <h1 className="text-2xl font-bold tracking-tight">
          POG
          <span className="text-[#1E88E5]"> Advisory</span>
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Staff Workspace
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 p-4">

        {navigation.map((item) => {

          const Icon = item.icon

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? 'bg-[#1E88E5] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />

              <span className="font-medium">
                {item.name}
              </span>

            </Link>
          )
        })}

      </nav>

      {/* User */}

      <div className="border-t border-slate-200 p-5">

        <div className="rounded-2xl bg-slate-50 p-4">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E88E5] font-bold text-white">

              T

            </div>

            <div>

              <p className="font-semibold">
                Thandiwe
              </p>

              <p className="text-sm text-slate-500">
                Administrator
              </p>

            </div>

          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />

            Logout

          </Button>

        </div>

      </div>

    </aside>
  )
}

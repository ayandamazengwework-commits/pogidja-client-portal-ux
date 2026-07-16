'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Logo } from '@/components/brand/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

interface AppShellProps {
  nav: NavItem[]
  user: {
    name: string
    email: string
    role: string
  }
  notifications: number
  notificationsHref: string
  profileHref: string
  searchPlaceholder?: string
  children: React.ReactNode
}

function SidebarNav({
  nav,
  pathname,
  onNavigate,
}: {
  nav: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {nav.map((item) => {
        const active =
          item.href === pathname ||
          (item.href !== '/portal' &&
            item.href !== '/staff' &&
            pathname.startsWith(item.href))

        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
            )}
          >
            <Icon
              className="h-[18px] w-[18px] shrink-0"
            />

            <span className="flex-1">
              {item.label}
            </span>

            {item.badge ? (
              <Badge className="h-5 min-w-5 justify-center rounded-full bg-sidebar-primary px-1.5 text-[11px] text-sidebar-primary-foreground">
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell({
  nav,
  user,
  notifications,
  notificationsHref,
  profileHref,
  searchPlaceholder = 'Search...',
  children,
}: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()

    router.replace('/auth/login')

    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop Sidebar */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">

        <div className="flex h-16 items-center border-b border-sidebar-border px-5">

          <Link href={nav[0]?.href ?? '/'}>
            <Logo variant="light" />
          </Link>

        </div>

        <ScrollArea className="flex-1">
          <SidebarNav
            nav={nav}
            pathname={pathname}
          />
        </ScrollArea>

        <div className="border-t border-sidebar-border p-3">

          <div className="flex items-center gap-3 rounded-lg px-2 py-2">

            <Avatar className="h-9 w-9">

              <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                {initials(user.name)}
              </AvatarFallback>

            </Avatar>

            <div className="min-w-0 flex-1 leading-tight">

              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>

              <p className="truncate text-xs text-sidebar-foreground/60">
                {user.role}
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* Main */}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">

        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">

          <Sheet
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          >

            <SheetTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-64 border-sidebar-border bg-sidebar p-0"
            >

              <SheetTitle className="sr-only">
                Navigation
              </SheetTitle>

              <div className="flex h-16 items-center border-b border-sidebar-border px-5">
                <Logo variant="light" />
              </div>

              <SidebarNav
                nav={nav}
                pathname={pathname}
                onNavigate={() =>
                  setMobileOpen(false)
                }
              />

            </SheetContent>

          </Sheet>

          <div className="relative hidden max-w-md flex-1 sm:block">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
            />

          </div>

          <div className="ml-auto flex items-center gap-1">

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() =>
                router.push(notificationsHref)
              }
            >

              <Bell className="h-5 w-5" />

              {notifications > 0 && (

                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">

                  {notifications}

                </span>

              )}

            </Button>

            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="ghost"
                  className="gap-2 pl-1.5 pr-2"
                >

                  <Avatar className="h-8 w-8">

                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {initials(user.name)}
                    </AvatarFallback>

                  </Avatar>

                  <span className="hidden text-sm font-medium sm:inline">
                    {user.name}
                  </span>

                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56"
              >

                <DropdownMenuLabel>

                  <div className="leading-tight">

                    <p className="font-medium">
                      {user.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>

                  </div>

                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    router.push(profileHref)
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    router.push(profileHref)
                  }
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  )
}

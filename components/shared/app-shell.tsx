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
  isPortal,
}: {
  nav: NavItem[]
  pathname: string
  onNavigate?: () => void
  isPortal: boolean
}) {
  return (
    <nav className="space-y-1 px-3 py-4">
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
              'group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
              isPortal
                ? active
                  ? 'bg-[#1E88E5] text-white shadow-sm shadow-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#17365D]'
                : active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
            )}
          >
            <Icon
              className={cn(
                'h-[18px] w-[18px] shrink-0 transition-transform duration-200',
                isPortal && !active && 'group-hover:scale-105'
              )}
            />

            <span className="flex-1">
              {item.label}
            </span>

            {item.badge ? (
              <Badge
                className={cn(
                  'h-5 min-w-5 justify-center rounded-full px-1.5 text-[11px]',
                  isPortal
                    ? 'border-0 bg-[#E7B84B] text-[#17365D]'
                    : 'bg-sidebar-primary text-sidebar-primary-foreground'
                )}
              >
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

  const [mobileOpen, setMobileOpen] = useState(false)

  /*
   * The portal gets the new client-facing design.
   *
   * Staff pages keep their existing styling.
   */
  const isPortal = pathname.startsWith('/portal')

  async function handleLogout() {
    await supabase.auth.signOut()

    router.replace('/auth/login')
    router.refresh()
  }

  return (
    <div
      className={cn(
        'flex min-h-screen',
        isPortal ? 'bg-[#F5F7FA]' : 'bg-background'
      )}
    >
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR                                           */}
      {/* ========================================================= */}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden w-64 flex-col lg:flex',
          isPortal
            ? 'border-r border-slate-200 bg-white'
            : 'border-r border-sidebar-border bg-sidebar'
        )}
      >
        {/* Logo Area */}

        <div
          className={cn(
            'flex h-[76px] items-center px-5',
            isPortal
              ? 'border-b border-slate-200'
              : 'border-b border-sidebar-border'
          )}
        >
          <Link
            href={nav[0]?.href ?? '/'}
            className="transition-opacity hover:opacity-90"
          >
            <Logo variant={isPortal ? 'default' : 'light'} />
          </Link>
        </div>

        {/* Navigation */}

        <ScrollArea className="flex-1">
          <div className="px-3 pt-5">
            {isPortal && (
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Client Portal
              </p>
            )}

            <SidebarNav
              nav={nav}
              pathname={pathname}
              isPortal={isPortal}
            />
          </div>
        </ScrollArea>

        {/* User Area */}

        <div
          className={cn(
            'p-3',
            isPortal
              ? 'border-t border-slate-200'
              : 'border-t border-sidebar-border'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl px-2.5 py-2.5',
              isPortal
                ? 'bg-slate-50'
                : 'bg-transparent'
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback
                className={cn(
                  'text-xs font-semibold',
                  isPortal
                    ? 'bg-[#E7B84B] text-[#17365D]'
                    : 'bg-sidebar-primary text-sidebar-primary-foreground'
                )}
              >
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 leading-tight">
              <p
                className={cn(
                  'truncate text-sm font-semibold',
                  isPortal
                    ? 'text-slate-800'
                    : 'text-sidebar-foreground'
                )}
              >
                {user.name}
              </p>

              <p
                className={cn(
                  'truncate text-xs',
                  isPortal
                    ? 'text-slate-500'
                    : 'text-sidebar-foreground/60'
                )}
              >
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN AREA                                                 */}
      {/* ========================================================= */}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* ======================================================= */}
        {/* HEADER                                                   */}
        {/* ======================================================= */}

        <header
          className={cn(
            'sticky top-0 z-20 flex h-[76px] items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6',
            isPortal
              ? 'border-slate-200 bg-white/95'
              : 'border-border bg-background/80'
          )}
        >
          {/* Mobile Menu */}

          <Sheet
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'lg:hidden',
                  isPortal && 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className={cn(
                'w-72 p-0',
                isPortal
                  ? 'border-slate-200 bg-white'
                  : 'border-sidebar-border bg-sidebar'
              )}
            >
              <SheetTitle className="sr-only">
                Navigation
              </SheetTitle>

              {/* Mobile Logo */}

              <div
                className={cn(
                  'flex h-[76px] items-center px-5',
                  isPortal
                    ? 'border-b border-slate-200'
                    : 'border-b border-sidebar-border'
                )}
              >
                <Logo
                  variant={isPortal ? 'default' : 'light'}
                />
              </div>

              <ScrollArea className="h-[calc(100vh-76px)]">
                <div className="pt-5">
                  {isPortal && (
                    <p className="mb-3 px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      Client Portal
                    </p>
                  )}

                  <SidebarNav
                    nav={nav}
                    pathname={pathname}
                    isPortal={isPortal}
                    onNavigate={() =>
                      setMobileOpen(false)
                    }
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Search */}

          <div
            className={cn(
              'relative hidden max-w-[430px] flex-1 sm:block',
              isPortal && 'max-w-[460px]'
            )}
          >
            <Search
              className={cn(
                'absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2',
                isPortal
                  ? 'text-slate-400'
                  : 'text-muted-foreground'
              )}
            />

            <Input
              placeholder={searchPlaceholder}
              className={cn(
                'h-10 pl-10',
                isPortal &&
                  'border-slate-200 bg-slate-50/70 text-slate-700 placeholder:text-slate-400 focus-visible:border-[#1E88E5] focus-visible:ring-[#1E88E5]/20'
              )}
            />
          </div>

          {/* Right Controls */}

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            {/* Notifications */}

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'relative',
                isPortal &&
                  'text-slate-600 hover:bg-slate-100 hover:text-[#17365D]'
              )}
              onClick={() =>
                router.push(notificationsHref)
              }
            >
              <Bell className="h-5 w-5" />

              {notifications > 0 && (
                <span
                  className={cn(
                    'absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                    isPortal
                      ? 'bg-[#E7B84B] text-[#17365D]'
                      : 'bg-destructive text-white'
                  )}
                >
                  {notifications}
                </span>
              )}
            </Button>

            {/* User Menu */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-2 pl-1.5 pr-2',
                    isPortal &&
                      'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={cn(
                        'text-xs font-semibold',
                        isPortal
                          ? 'bg-[#17365D] text-white'
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
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

        {/* ======================================================= */}
        {/* PAGE CONTENT                                             */}
        {/* ======================================================= */}

        <main
          className={cn(
            'flex-1',
            isPortal
              ? 'p-4 sm:p-6 lg:p-8'
              : 'p-4 sm:p-6 lg:p-8'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

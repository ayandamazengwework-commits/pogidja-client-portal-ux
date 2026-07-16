import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AppShell, type NavItem } from '@/components/shared/app-shell'

export default async function PortalLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not logged in
  if (!user) {
    redirect('/auth/login')
  }

  // Get logged in profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Invalid profile
  if (error || !profile) {
    console.error(error)
    redirect('/auth/login')
  }

  // Only clients may access the client portal
  if (profile.role !== 'client') {
    redirect('/staff')
  }

  const { count: unreadNotifications = 0 } =
    await supabase
      .from('activity_logs')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', user.id)

  const { count: unreadMessages = 0 } =
    await supabase
      .from('messages')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('recipient_id', user.id)
      .eq('read', false)

  const nav: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/portal',
      icon: 'dashboard',
    },
    {
      label: 'My Cases',
      href: '/portal/cases',
      icon: 'folder',
    },
    {
      label: 'Request Service',
      href: '/portal/request-service',
      icon: 'plus',
    },
    {
      label: 'Messages',
      href: '/portal/messages',
      icon: 'message',
      badge: unreadMessages,
    },
    {
      label: 'Documents',
      href: '/portal/documents',
      icon: 'file',
    },
    {
      label: 'Notifications',
      href: '/portal/notifications',
      icon: 'bell',
      badge: unreadNotifications,
    },
    {
      label: 'Profile',
      href: '/portal/profile',
      icon: 'user',
    },
  ]

  return (
    <AppShell
      nav={nav}
      user={{
        name:
          `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() ||
          profile.company_name ||
          user.email?.split('@')[0] ||
          'Client',

        email: user.email ?? '',

        role: profile.company_name ?? 'Client',
      }}
      notifications={unreadNotifications}
      notificationsHref="/portal/notifications"
      profileHref="/portal/profile"
      searchPlaceholder="Search requests..."
    >
      {children}
    </AppShell>
  )
}

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

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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

  const fullName = [
    profile?.first_name,
    profile?.last_name,
  ]
    .filter(Boolean)
    .join(' ')

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
    `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim() ||
    profile?.company_name ||
    (user.email?.split('@')[0] ?? 'User'),

  email: user.email ?? '',

  role:
    profile?.company_name
      ? profile.company_name
      : 'Client',
}}tions={unreadNotifications}
      notificationsHref="/portal/notifications"
      profileHref="/portal/profile"
      searchPlaceholder="Search requests..."
    >
      {children}
    </AppShell>
  )
}

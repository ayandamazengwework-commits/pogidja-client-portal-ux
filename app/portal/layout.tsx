import type { ReactNode } from 'react'
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

  if (!user) return children

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: unreadNotifications } = await supabase
    .from('activity_logs')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('user_id', user.id)

  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('recipient_id', user.id)
    .eq('is_read', false)

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
      badge: unreadMessages ?? 0,
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
      badge: unreadNotifications ?? 0,
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
          'Client',
        email: user.email ?? '',
        role: 'Client',
      }}
      notifications={unreadNotifications ?? 0}
      notificationsHref="/portal/notifications"
      profileHref="/portal/profile"
      searchPlaceholder="Search requests..."
    >
      {children}
    </AppShell>
  )
}

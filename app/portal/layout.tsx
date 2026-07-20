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

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !profile) {
    console.error(error)
    redirect('/auth/login')
  }

  if (profile.role !== 'client') {
    redirect('/staff')
  }

  // --------------------------------------------------
  // Onboarding Check
  // --------------------------------------------------

  const { data: requests } = await supabase
    .from('document_requests')
    .select('id, completed')
    .eq('user_id', user.id)

  const hasPendingRequests =
    (requests ?? []).some(
      (request) => !request.completed
    )

  // Current path
  const pathname =
    (await import('next/headers')).headers
      ? ''
      : ''

  // If onboarding is incomplete,
  // only allow access to onboarding
  if (
    hasPendingRequests &&
    !String(process.env.NEXT_PUBLIC_VERCEL_URL).includes(
      '/portal/onboarding'
    )
  ) {
    redirect('/portal/onboarding')
  }

  // --------------------------------------------------
  // Notification Counts
  // --------------------------------------------------

  const { count: unreadNotifications = 0 } =
    await supabase
      .from('notifications')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', user.id)
      .eq('read', false)

  const { count: unreadMessages = 0 } =
    await supabase
      .from('messages')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('recipient_id', user.id)
      .eq('read', false)

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

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

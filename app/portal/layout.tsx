import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import {
  AppShell,
  type NavItem,
} from '@/components/shared/app-shell'

export default async function PortalLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // --------------------------------------------------
  // Profile
  // --------------------------------------------------

  const { data: profile, error: profileError } =
    await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

  if (profileError || !profile) {
    console.error(
      'Portal profile error:',
      profileError
    )

    redirect('/auth/login')
  }

  // Only clients may access the client portal
  if (profile.role !== 'client') {
    redirect('/staff')
  }

  // --------------------------------------------------
  // Client
  // --------------------------------------------------

  const { data: client, error: clientError } =
    await supabase
      .from('clients')
      .select('id, profile_id')
      .eq('profile_id', user.id)
      .maybeSingle()

  if (clientError || !client) {
    console.error(
      'Portal client error:',
      clientError
    )

    redirect('/auth/login')
  }

  // --------------------------------------------------
  // Pending Document Requests
  //
  // document_requests uses:
  // client_id
  // uploaded
  //
  // NOT user_id / completed
  // --------------------------------------------------

  const { data: documentRequests } =
    await supabase
      .from('document_requests')
      .select('id, uploaded, required')
      .eq('client_id', client.id)

  const hasPendingRequests =
    (documentRequests ?? []).some(
      (request) =>
        request.required !== false &&
        request.uploaded !== true
    )

  // --------------------------------------------------
  // Notification Counts
  // --------------------------------------------------

  const { count: unreadNotifications } =
    await supabase
      .from('notifications')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', user.id)
      .eq('read', false)

  const { count: unreadMessages } =
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

  // --------------------------------------------------
  // Client Display Name
  // --------------------------------------------------

  const fullName =
    `${profile.first_name ?? ''} ${
      profile.last_name ?? ''
    }`.trim()

  const displayName =
    fullName ||
    profile.company_name ||
    user.email?.split('@')[0] ||
    'Client'

  // --------------------------------------------------
  // Client Role / Company
  // --------------------------------------------------

  const displayRole =
    profile.company_name ||
    'Client'

  // --------------------------------------------------
  // Portal
  // --------------------------------------------------

  return (
    <AppShell
      nav={nav}
      user={{
        name: displayName,
        email: user.email ?? '',
        role: displayRole,
      }}
      notifications={unreadNotifications ?? 0}
      notificationsHref="/portal/notifications"
      profileHref="/portal/profile"
      searchPlaceholder="Search your services..."
    >
      {children}
    </AppShell>
  )
}

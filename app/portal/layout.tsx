import type { ReactNode } from 'react'
import { AppShell, type NavItem } from '@/components/shared/app-shell'
import { currentClient, notifications } from '@/lib/demo-data'

const nav: NavItem[] = [
  { label: 'Dashboard', href: '/portal', icon: 'dashboard' },
  { label: 'My Cases', href: '/portal/cases', icon: 'folder' },
  { label: 'Request Service', href: '/portal/request-service', icon: 'plus' },
  { label: 'Messages', href: '/portal/messages', icon: 'message', badge: 2 },
  { label: 'Documents', href: '/portal/documents', icon: 'file' },
  {
    label: 'Notifications',
    href: '/portal/notifications',
    icon: 'bell',
    badge: notifications.filter((n) => !n.read).length,
  },
  { label: 'Profile', href: '/portal/profile', icon: 'user' },
]

export default function PortalLayout({ children }: { children: ReactNode }) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <AppShell
      nav={nav}
      user={{
        name: currentClient.fullName,
        email: currentClient.email,
        role: 'Client',
      }}
      notifications={unread}
      notificationsHref="/portal/notifications"
      profileHref="/portal/profile"
      searchPlaceholder="Search cases, documents…"
    >
      {children}
    </AppShell>
  )
}

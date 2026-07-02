import type { ReactNode } from 'react'
import {
  Bell,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  User,
} from 'lucide-react'
import { AppShell, type NavItem } from '@/components/shared/app-shell'
import { currentClient, notifications } from '@/lib/demo-data'

const nav: NavItem[] = [
  { label: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { label: 'My Cases', href: '/portal/cases', icon: FolderOpen },
  { label: 'Request Service', href: '/portal/request-service', icon: PlusCircle },
  { label: 'Messages', href: '/portal/messages', icon: MessageSquare, badge: 2 },
  { label: 'Documents', href: '/portal/documents', icon: FileText },
  {
    label: 'Notifications',
    href: '/portal/notifications',
    icon: Bell,
    badge: notifications.filter((n) => !n.read).length,
  },
  { label: 'Profile', href: '/portal/profile', icon: User },
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

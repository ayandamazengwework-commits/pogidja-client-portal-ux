import Link from 'next/link'
import {
  ArrowRight,
  FolderOpen,
  PlusCircle,
  Bell,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/status-badge'

import {
  clientActiveCases,
  currentClient,
  notifications,
  STATUS_META,
} from '@/lib/demo-data'

import {
  formatDate,
} from '@/lib/format'

const quickActions = [
  {
    title: 'New Service',
    href: '/portal/request-service',
    icon: PlusCircle,
  },
  {
    title: 'My Cases',
    href: '/portal/cases',
    icon: FolderOpen,
  },
  {
    title: 'Documents',
    href: '/portal/documents',
    icon: FileText,
  },
  {
    title: 'Notifications',
    href: '/portal/notifications',
    icon: Bell,
  },
]

export default function ClientDashboard() {
  const recentDocs = documents.slice(0, 4)
  const recentNotifications = notifications.slice(0, 4)
  const recentThreads = threads.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-primary-foreground/70">
            {formatDate(new Date().toISOString())}
          </p>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
            Welcome back, {currentClient.firstName}
          </h1>
          <p className="text-sm text-primary-foreground/80">
            {currentClient.company}
          </p>
        </div>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/portal/request-service">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request a Service
          </Link>
        </Button>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.label} href={action.href}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{action.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active services */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
              Active Services
              <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {clientActiveCases.length}
              </span>
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portal/cases">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientActiveCases.map((c) => (
              <Link
                key={c.id}
                href={`/portal/cases/${c.id}`}
                className="block rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {c.reference}
                    </p>
                  </div>
                  <StatusBadge {...STATUS_META[c.status]} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {c.progress}%
                    </span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Assigned to {c.assignedName}</span>
                  <span>Due {formatDate(c.dueDate)}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Outstanding invoice */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                Outstanding Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-serif text-3xl font-bold tracking-tight">
                  {formatCurrency(clientOutstandingInvoice.amount)}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {clientOutstandingInvoice.number}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due date</span>
                <span className="font-medium">
                  {formatDate(clientOutstandingInvoice.dueDate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge {...INVOICE_META[clientOutstandingInvoice.status]} />
              </div>
              <Button className="w-full">Pay now</Button>
            </CardContent>
          </Card>

          {/* Latest notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                Latest Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/60"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-border' : 'bg-accent'}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {n.body}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
              Recent Messages
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portal/messages">
                Open inbox
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentThreads.map((t) => (
              <Link
                key={t.id}
                href="/portal/messages"
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary/60"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-secondary text-xs text-foreground">
                    {initials(t.counterpart)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {t.counterpart}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {relativeTime(t.lastTime)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.lastMessage}
                  </p>
                </div>
                {t.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {t.unread}
                  </span>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
              Recent Documents
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portal/documents">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentDocs.map((d) => (
              <Link
                key={d.id}
                href="/portal/documents"
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.category} · {d.size}
                  </p>
                </div>
                <StatusBadge
                  {...{
                    label:
                      d.status === 'approved'
                        ? 'Approved'
                        : d.status === 'pending'
                          ? 'Pending'
                          : d.status === 'rejected'
                            ? 'Rejected'
                            : 'Received',
                    tone:
                      d.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : d.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : d.status === 'rejected'
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
                  }}
                />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

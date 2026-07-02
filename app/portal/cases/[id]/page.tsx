import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  ListChecks,
  Receipt,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  activityLog,
  cases,
  caseTimeline,
  documents,
  DOC_META,
  invoices,
  INVOICE_META,
  PRIORITY_META,
  STATUS_META,
  tasks,
} from '@/lib/demo-data'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  initials,
  relativeTime,
} from '@/lib/format'

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const record = cases.find((c) => c.id === id)
  if (!record) notFound()

  const caseDocs = documents.filter((d) => d.caseRef === record.reference)
  const caseInvoices = invoices.filter((i) => i.caseRef === record.reference)
  const caseTasks = tasks.filter((t) => t.caseRef === record.reference)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/portal/cases">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cases
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge {...STATUS_META[record.status]} />
            <StatusBadge {...PRIORITY_META[record.priority]} />
            <span className="font-mono text-xs text-muted-foreground">
              {record.reference}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {record.title}
          </h1>
          <p className="text-sm text-muted-foreground">{record.service}</p>
        </div>
        <div className="w-full max-w-xs space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-semibold">{record.progress}%</span>
          </div>
          <Progress value={record.progress} className="h-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">
                Documents ({caseDocs.length})
              </TabsTrigger>
              <TabsTrigger value="invoices">
                Invoices ({caseInvoices.length})
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview: timeline + tasks */}
            <TabsContent value="overview" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="relative space-y-6 border-l border-border pl-6">
                    {caseTimeline.map((e) => (
                      <li key={e.id} className="relative">
                        <span
                          className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ${e.done ? 'bg-primary text-primary-foreground' : 'border-2 border-border bg-background text-muted-foreground'}`}
                        >
                          {e.done ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Circle className="h-2.5 w-2.5" />
                          )}
                        </span>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">{e.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(e.time)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {e.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                    Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {caseTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tasks recorded for this case.
                    </p>
                  )}
                  {caseTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      {t.status === 'done' ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" style={{ width: 18, height: 18 }} />
                      ) : (
                        <Circle className="h-4.5 w-4.5 text-muted-foreground" style={{ width: 18, height: 18 }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                        >
                          {t.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDate(t.due)} · {t.assignee}
                        </p>
                      </div>
                      <StatusBadge {...PRIORITY_META[t.priority]} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="space-y-2 p-4">
                  {caseDocs.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No documents linked to this case yet.
                    </p>
                  )}
                  {caseDocs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
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
                      <StatusBadge {...DOC_META[d.status]} />
                      <Button variant="ghost" size="icon" aria-label="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices */}
            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardContent className="space-y-2 p-4">
                  {caseInvoices.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No invoices for this case.
                    </p>
                  )}
                  {caseInvoices.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Receipt className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {i.number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDate(i.dueDate)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatCurrency(i.amount)}
                      </span>
                      <StatusBadge {...INVOICE_META[i.status]} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ol className="space-y-4">
                    {activityLog.slice(0, 5).map((a) => (
                      <li key={a.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-[11px] text-foreground">
                            {initials(a.actor)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="text-sm">
                            <span className="font-medium">{a.actor}</span>{' '}
                            {a.action}{' '}
                            <span className="font-medium">{a.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {relativeTime(a.time)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: details sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Accountant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials(record.assignedName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{record.assignedName}</p>
                  <p className="text-xs text-muted-foreground">
                    Pogidja Tax Practice
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/portal/messages">Message accountant</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                Key Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Opened</span>
                <span className="font-medium">{formatDate(record.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Due date</span>
                <span className="font-medium">{formatDate(record.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Est. completion</span>
                <span className="font-medium">
                  {formatDate(record.estimatedCompletion)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="font-serif text-xl font-bold">{caseDocs.length}</p>
                <p className="text-xs text-muted-foreground">Docs</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="font-serif text-xl font-bold">
                  {caseTasks.length}
                </p>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="font-serif text-xl font-bold">
                  {caseInvoices.length}
                </p>
                <p className="text-xs text-muted-foreground">Invoices</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

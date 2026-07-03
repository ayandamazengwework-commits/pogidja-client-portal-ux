import Link from 'next/link'
import { ArrowRight, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { cases, PRIORITY_META, STATUS_META } from '@/lib/demo-data'
import { formatDate } from '@/lib/format'

function getAccent(status: string) {
  switch (status) {
    case 'completed':
      return 'border-l-emerald-500'
    case 'in_progress':
      return 'border-l-amber-500'
    case 'awaiting_client':
      return 'border-l-purple-500'
    case 'awaiting_sars':
      return 'border-l-orange-500'
    case 'review':
      return 'border-l-cyan-500'
    case 'on_hold':
      return 'border-l-slate-400'
    default:
      return 'border-l-blue-500'
  }
}

export default function ClientCasesPage() {
  const myCases = cases.filter((c) => c.clientId === 'client-001')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/5 via-background to-accent/10 p-6">
        <PageHeader
          title="My Cases"
          description="Track your tax, bookkeeping and compliance work in real time."
          actions={
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href="/portal/request-service">
                <PlusCircle className="mr-2 h-4 w-4" />
                New request
              </Link>
            </Button>
          }
        />
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {myCases.map((c) => (
          <Link key={c.id} href={`/portal/cases/${c.id}`}>
            <Card
              className={[
                'group relative border-l-4 transition-all duration-200',
                'hover:-translate-y-0.5 hover:shadow-lg',
                getAccent(c.status),
              ].join(' ')}
            >
              <CardContent className="space-y-4 p-5">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium leading-snug group-hover:text-primary transition-colors">
                      {c.title}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {c.reference}
                    </p>
                  </div>

                  <StatusBadge {...STATUS_META[c.status]} />
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <StatusBadge {...PRIORITY_META[c.priority]} />
                    <span className="text-muted-foreground">
                      Due {formatDate(c.dueDate)}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 font-medium text-primary opacity-80 group-hover:opacity-100">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

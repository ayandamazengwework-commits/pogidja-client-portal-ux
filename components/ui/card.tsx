import Link from 'next/link'
import { ArrowRight, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { cases, PRIORITY_META, STATUS_META } from '@/lib/demo-data'
import { formatDate } from '@/lib/format'

export default function ClientCasesPage() {
  const myCases = cases.filter((c) => c.clientId === 'client-001')

  return (
    <div className="space-y-8">

      {/* Header (clean, no gradient noise) */}
      <div className="border-b pb-5">
        <PageHeader
          title="My Cases"
          description="Track all active engagements, submissions, and compliance work in one place."
          actions={
            <Button asChild>
              <Link href="/portal/request-service">
                <PlusCircle className="mr-2 h-4 w-4" />
                New request
              </Link>
            </Button>
          }
        />
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">

        {myCases.map((c) => (
          <Link key={c.id} href={`/portal/cases/${c.id}`}>
            <Card className="group border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30">

              <CardContent className="space-y-5 p-6">

                {/* Title row */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                      {c.title}
                    </p>
                    <StatusBadge {...STATUS_META[c.status]} />
                  </div>

                  <p className="font-mono text-xs text-muted-foreground">
                    {c.reference}
                  </p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {c.progress}%
                    </span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 text-xs">

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

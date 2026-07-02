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
    <div className="space-y-6">
      <PageHeader
        title="My Cases"
        description="Track the progress of every engagement with Pogidja."
        actions={
          <Button asChild>
            <Link href="/portal/request-service">
              <PlusCircle className="mr-2 h-4 w-4" />
              New request
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {myCases.map((c) => (
          <Link key={c.id} href={`/portal/cases/${c.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {c.reference}
                    </p>
                  </div>
                  <StatusBadge {...STATUS_META[c.status]} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {c.progress}%
                    </span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <StatusBadge {...PRIORITY_META[c.priority]} />
                    <span className="text-muted-foreground">
                      Due {formatDate(c.dueDate)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 font-medium text-primary">
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
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

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
      
      {/* HEADER */}
      <div className="border-b border-border pb-5">
        <PageHeader
          title="My Cases"
          description="Track progress, documents, and outstanding actions across all engagements."
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

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {myCases.map((c) => (
          <Link key={c.id} href={`/portal/cases/${c.id}`} className="group">
            
            <Card
              className="
                relative overflow-hidden
                border border-border/60
                bg-card
                transition-all duration-200
                hover:shadow-md hover:border-primary/20
              "
            >
              {/* subtle left accent */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />

              <CardContent className="space-y-5 p-6">

                {/* TITLE */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug text-foreground">
                      {c.title}
                    </h3>
                    <StatusBadge {...STATUS_META[c.status]} />
                  </div>

                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                    {c.reference}
                  </p>
                </div>

                {/* PROGRESS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {c.progress}%
                    </span>
                  </div>

                  <Progress value={c.progress} className="h-1.5" />
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs">

                  <div className="flex items-center gap-2">
                    <StatusBadge {...PRIORITY_META[c.priority]} />

                    <span className="text-muted-foreground">
                      Due {formatDate(c.dueDate)}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    Open
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

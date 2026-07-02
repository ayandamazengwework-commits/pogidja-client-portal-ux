import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  hint,
  accent = 'text-primary',
}: {
  label: string
  value: string | number
  icon: LucideIcon
  change?: number
  hint?: string
  accent?: string
}) {
  const positive = (change ?? 0) >= 0
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-serif text-2xl font-bold tracking-tight">
              {value}
            </p>
          </div>
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg bg-secondary',
              accent,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
        {(change !== undefined || hint) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium',
                  positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(change)}%
              </span>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

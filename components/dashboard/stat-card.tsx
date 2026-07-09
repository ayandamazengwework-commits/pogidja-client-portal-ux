import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      <CardContent className="flex items-center justify-between p-6">

        <div>

          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl',
            iconBg
          )}
        >
          <Icon className={cn('h-7 w-7', iconColor)} />
        </div>

      </CardContent>
    </Card>
  )
}

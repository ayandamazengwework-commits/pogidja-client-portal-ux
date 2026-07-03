import { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  subtitle?: string
}

export function StatCard({
  title,
  value,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="shadow-sm transition hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

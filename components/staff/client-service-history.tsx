'use client'

import Link from 'next/link'
import {
  Calendar,
  ArrowRight,
  Briefcase,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  title: string
  service_type: string
  status: string
  priority: string
  progress: number
  due_date: string | null
}

interface Props {
  services: Service[]
}

export function ClientServiceHistory({
  services,
}: Props) {
  if (!services.length) {
    return (
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">

          <Briefcase className="mb-4 h-10 w-10 text-slate-300" />

          <h3 className="text-lg font-semibold">
            No Services
          </h3>

          <p className="mt-2 text-slate-500">
            This client doesn't have any services yet.
          </p>

        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">

      {services.map((service) => (
        <Card
          key={service.id}
          className="rounded-3xl border-0 shadow-sm"
        >
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h3 className="text-xl font-semibold">
                {service.title}
              </h3>

              <p className="mt-1 text-slate-500">
                {service.service_type}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {service.status}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {service.priority}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {service.progress}% Complete
                </span>

              </div>

            </div>

            <div className="flex flex-col items-end gap-4">

              {service.due_date && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(service.due_date).toLocaleDateString()}
                </div>
              )}

              <Button asChild>

                <Link href={`/staff/services/${service.id}`}>
                  Open Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

              </Button>

            </div>

          </CardContent>
        </Card>
      ))}

    </div>
  )
}

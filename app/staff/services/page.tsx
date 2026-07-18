import Link from 'next/link'
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ServicesPage() {
  return (
    <div className="space-y-8">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              SERVICE REQUESTS
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Manage Services
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Create, assign and monitor all client
              service requests from one place.
            </p>

          </div>

          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100"
          >
            <Link href="/staff/services/new">
              <Plus className="mr-2 h-5 w-5" />
              New Service Request
            </Link>
          </Button>

        </div>

      </section>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-4">

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <Briefcase className="h-10 w-10 text-[#1E88E5]" />

            <div>
              <p className="text-sm text-slate-500">
                Total Services
              </p>

              <p className="text-3xl font-bold">
                0
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <Clock3 className="h-10 w-10 text-amber-500" />

            <div>
              <p className="text-sm text-slate-500">
                In Progress
              </p>

              <p className="text-3xl font-bold">
                0
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-10 w-10 text-red-500" />

            <div>
              <p className="text-sm text-slate-500">
                Awaiting Client
              </p>

              <p className="text-3xl font-bold">
                0
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="text-3xl font-bold">
                0
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Table */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-12 text-center">

          <Briefcase className="mx-auto h-16 w-16 text-slate-300" />

          <h2 className="mt-6 text-2xl font-bold">
            No Service Requests Yet
          </h2>

          <p className="mt-3 text-slate-500">
            Create your first client service request to begin
            managing work.
          </p>

          <Button
            asChild
            className="mt-8"
          >
            <Link href="/staff/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Create First Service
            </Link>
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}

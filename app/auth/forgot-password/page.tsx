import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  ArrowRight,
  PlusCircle,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/staff/stat-card'

export default function StaffDashboard() {
  return (
    <div className="space-y-8">

      {/* Welcome */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Good morning 👋
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Welcome back, Thandiwe
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Here's an overview of your practice today.
            </p>

          </div>

          <Button asChild size="lg">

            <Link href="/staff/services/new">

              <PlusCircle className="mr-2 h-5 w-5" />

              New Service

            </Link>

          </Button>

        </div>

      </section>

      {/* Stats */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Clients"
          value={124}
          subtitle="Registered clients"
          icon={<Users className="h-8 w-8 text-blue-600" />}
        />

        <StatCard
          title="Active Services"
          value={36}
          subtitle="Currently in progress"
          icon={<Briefcase className="h-8 w-8 text-blue-600" />}
        />

        <StatCard
          title="Documents"
          value={89}
          subtitle="Awaiting review"
          icon={<FileText className="h-8 w-8 text-blue-600" />}
        />

        <StatCard
          title="Messages"
          value={12}
          subtitle="Unread conversations"
          icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
        />

      </section>

      {/* Lower Section */}

      <section className="grid gap-6 lg:grid-cols-2">

        {/* Recent Activity */}

        <Card>

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Recent Activity
              </h2>

              <Button variant="ghost" size="sm">

                View All

                <ArrowRight className="ml-2 h-4 w-4" />

              </Button>

            </div>

            <div className="space-y-4">

              <div className="rounded-xl border p-4">
                John Smith uploaded Company Registration.pdf
              </div>

              <div className="rounded-xl border p-4">
                Payroll service completed
              </div>

              <div className="rounded-xl border p-4">
                New VAT Registration request received
              </div>

              <div className="rounded-xl border p-4">
                Sarah Williams sent a new message
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Upcoming */}

        <Card>

          <CardContent className="p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Upcoming Deadlines
            </h2>

            <div className="space-y-4">

              <div className="rounded-xl border p-4">

                <p className="font-semibold">
                  VAT Returns
                </p>

                <p className="text-sm text-slate-500">
                  Due in 3 days
                </p>

              </div>

              <div className="rounded-xl border p-4">

                <p className="font-semibold">
                  Payroll Submission
                </p>

                <p className="text-sm text-slate-500">
                  Due tomorrow
                </p>

              </div>

              <div className="rounded-xl border p-4">

                <p className="font-semibold">
                  Annual Returns
                </p>

                <p className="text-sm text-slate-500">
                  Due next week
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </section>

    </div>
  )
}

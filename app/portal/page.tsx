import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  FileText,
  FolderOpen,
  PlusCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/status-badge'

import {
  clientActiveCases,
  currentClient,
  notifications,
  STATUS_META,
} from '@/lib/demo-data'

export default function ClientDashboard() {
  return (
    <div className="space-y-8">

      {/* Welcome */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Welcome back
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {currentClient.firstName}
            </h1>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              View your active services, upload documents and stay informed
              about your tax and accounting matters.
            </p>

          </div>

          <Button asChild size="lg">

            <Link href="/portal/request-service">

              <PlusCircle className="mr-2 h-5 w-5" />

              Request Service

            </Link>

          </Button>

        </div>

      </section>

      {/* Quick actions */}

      <section className="grid gap-4 md:grid-cols-4">

        <Link href="/portal/request-service">

          <Card className="transition hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-6">

              <PlusCircle className="h-6 w-6 text-primary" />

              <div>

                <h3 className="font-semibold">New Service</h3>

                <p className="text-sm text-muted-foreground">
                  Submit a request
                </p>

              </div>

            </CardContent>

          </Card>

        </Link>

        <Link href="/portal/cases">

          <Card className="transition hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-6">

              <FolderOpen className="h-6 w-6 text-primary" />

              <div>

                <h3 className="font-semibold">My Cases</h3>

                <p className="text-sm text-muted-foreground">
                  Track progress
                </p>

              </div>

            </CardContent>

          </Card>

        </Link>

        <Link href="/portal/documents">

          <Card className="transition hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-6">

              <FileText className="h-6 w-6 text-primary" />

              <div>

                <h3 className="font-semibold">Documents</h3>

                <p className="text-sm text-muted-foreground">
                  View files
                </p>

              </div>

            </CardContent>

          </Card>

        </Link>

        <Link href="/portal/notifications">

          <Card className="transition hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-6">

              <Bell className="h-6 w-6 text-primary" />

              <div>

                <h3 className="font-semibold">

                  Notifications

                  {notifications.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-white">
                      {notifications.length}
                    </span>
                  )}

                </h3>

                <p className="text-sm text-muted-foreground">
                  Latest updates
                </p>

              </div>

            </CardContent>

          </Card>

        </Link>

      </section>

      {/* Active Cases */}

      <section>

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Active Services
          </h2>

          <Button variant="ghost" asChild>

            <Link href="/portal/cases">

              View all

              <ArrowRight className="ml-2 h-4 w-4" />

            </Link>

          </Button>

        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {clientActiveCases.map((c) => (

            <Link key={c.id} href={`/portal/cases/${c.id}`}>

              <Card className="transition hover:border-primary hover:shadow-lg">

                <CardContent className="space-y-5 p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="font-semibold">

                        {c.title}

                      </h3>

                      <p className="text-sm text-muted-foreground">

                        {c.reference}

                      </p>

                    </div>

                    <StatusBadge {...STATUS_META[c.status]} />

                  </div>

                  <div>

                    <div className="mb-2 flex justify-between text-sm">

                      <span>Progress</span>

                      <span>{c.progress}%</span>

                    </div>

                    <Progress value={c.progress} />

                  </div>

                </CardContent>

              </Card>

            </Link>

          ))}

        </div>

      </section>

    </div>
  )
}

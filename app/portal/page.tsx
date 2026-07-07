import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  FileText,
  FolderOpen,
  PlusCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'

export default async function ClientDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        name
      )
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-sm text-muted-foreground">
              Welcome back,
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {profile?.first_name}
            </h1>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              Request accounting, tax and advisory services,
              upload documents securely and track every request
              from submission through to completion.
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

      {/* Quick Actions */}

      <section className="grid gap-4 md:grid-cols-4">

        <Link href="/portal/request-service">
          <Card className="transition hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">

              <PlusCircle className="h-6 w-6 text-primary" />

              <div>
                <h3 className="font-semibold">
                  Request Service
                </h3>

                <p className="text-sm text-muted-foreground">
                  Submit a new request
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
                <h3 className="font-semibold">
                  My Requests
                </h3>

                <p className="text-sm text-muted-foreground">
                  Track your requests
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
                <h3 className="font-semibold">
                  Documents
                </h3>

                <p className="text-sm text-muted-foreground">
                  View uploaded files
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
                </h3>

                <p className="text-sm text-muted-foreground">
                  Latest updates
                </p>
              </div>

            </CardContent>
          </Card>
        </Link>

      </section>

      {/* My Requests */}

      <section>

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            My Requests
          </h2>

          <Button variant="ghost" asChild>
            <Link href="/portal/cases">
              View All

              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

        </div>

        {services && services.length > 0 ? (

          <div className="grid gap-5 lg:grid-cols-2">

            {services.map((service) => (

              <Link
                key={service.id}
                href={`/portal/cases/${service.id}`}
              >

                <Card className="transition hover:border-primary hover:shadow-lg">

                  <CardContent className="space-y-4 p-6">

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="font-semibold">
                          {service.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {service.service_categories?.name ??
                            service.service_type}
                        </p>

                      </div>

                      <StatusBadge
                        status={service.status}
                      />

                    </div>

                    <div className="text-sm text-muted-foreground">
                      Submitted{' '}
                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}
                    </div>

                  </CardContent>

                </Card>

              </Link>

            ))}

          </div>

        ) : (

          <Card>

            <CardContent className="flex flex-col items-center justify-center py-16">

              <FolderOpen className="mb-4 h-12 w-12 text-slate-300" />

              <h3 className="text-xl font-semibold">
                No Requests Yet
              </h3>

              <p className="mt-2 text-center text-muted-foreground">
                Submit your first request and we'll begin
                working on it as soon as possible.
              </p>

              <Button asChild className="mt-6">
                <Link href="/portal/request-service">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Request a Service
                </Link>
              </Button>

            </CardContent>

          </Card>

        )}

      </section>

    </div>
  )
}

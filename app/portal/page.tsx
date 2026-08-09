import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import Link from 'next/link'

import {
  Clock3,
  FileText,
  MessageSquare,
  Receipt,
  Upload,
  ArrowRight,
} from 'lucide-react'

export default async function PortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    redirect('/auth/login')
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D9B95B]">
          CLIENT PORTAL
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome {profile?.first_name}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          POG ADVISORY AND CHARTERED ACCOUNTANTS INC. manages your
          accounting services. You can track progress, upload
          requested documents and communicate with your advisor
          through the portal.
        </p>

      </section>

      {/* QUICK STATS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* ACTIVE SERVICES */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

              <Clock3 className="h-6 w-6 text-primary" />

            </div>

            <p className="text-sm text-muted-foreground">
              Active Services
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {services?.length ?? 0}
            </h2>

          </CardContent>

        </Card>

        {/* DOCUMENTS */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

              <Upload className="h-6 w-6 text-primary" />

            </div>

            <p className="text-sm text-muted-foreground">
              Upload Documents
            </p>

            <Link href="/portal/documents">

              <Button className="mt-4 w-full">
                Open Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>

          </CardContent>

        </Card>

        {/* MESSAGES */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

              <MessageSquare className="h-6 w-6 text-primary" />

            </div>

            <p className="text-sm text-muted-foreground">
              Messages
            </p>

            <Link href="/portal/messages">

              <Button className="mt-4 w-full">
                View Messages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>

          </CardContent>

        </Card>

        {/* INVOICES */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

              <Receipt className="h-6 w-6 text-primary" />

            </div>

            <p className="text-sm text-muted-foreground">
              Invoices
            </p>

            <Link href="/portal/invoices">

              <Button className="mt-4 w-full">
                View Invoices
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>

          </CardContent>

        </Card>

      </div>

      {/* SERVICES */}

      <section className="space-y-5">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Your Services
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Current Services
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track the progress of your accounting services.
          </p>

        </div>

        {services && services.length > 0 ? (

          services.map((service) => (

            <Card
              key={service.id}
              className="rounded-3xl border-0 shadow-sm"
            >

              <CardContent className="space-y-6 p-8">

                {/* SERVICE HEADER */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {service.title}
                    </h2>

                    <p className="mt-1 text-muted-foreground">
                      {service.service_type}
                    </p>

                  </div>

                  <div className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {service.status}
                  </div>

                </div>

                {/* PROGRESS */}

                <div className="space-y-3">

                  <div className="flex items-center justify-between text-sm">

                    <span className="font-medium">
                      Service Progress
                    </span>

                    <span className="font-semibold text-primary">
                      {service.progress ?? 0}%
                    </span>

                  </div>

                  <Progress
                    value={service.progress ?? 0}
                    className="h-3"
                  />

                </div>

                {/* SERVICE META */}

                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">

                  <span>
                    {service.progress ?? 0}% Complete
                  </span>

                  <span>
                    Due:{' '}
                    {service.due_date
                      ? new Date(
                          service.due_date
                        ).toLocaleDateString()
                      : 'Not Set'}
                  </span>

                </div>

                {/* ACTION */}

                <div className="flex justify-end border-t pt-5">

                  <Link
                    href={`/portal/cases/${service.id}`}
                  >

                    <Button>

                      <FileText className="mr-2 h-4 w-4" />

                      View Service

                      <ArrowRight className="ml-2 h-4 w-4" />

                    </Button>

                  </Link>

                </div>

              </CardContent>

            </Card>

          ))

        ) : (

          <Card className="rounded-3xl border-0 shadow-sm">

            <CardContent className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">

                <FileText className="h-8 w-8 text-primary" />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Services Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                You currently don't have any active services.
                When POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
                creates a service for you, it will appear here.
              </p>

              <Link href="/portal/request-service">

                <Button className="mt-6">
                  Request a Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

              </Link>

            </CardContent>

          </Card>

        )}

      </section>

    </div>
  )
}

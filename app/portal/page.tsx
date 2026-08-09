import { redirect } from 'next/navigation'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import {
  ArrowRight,
  Clock3,
  FileText,
  MessageSquare,
  Receipt,
  Upload,
  BriefcaseBusiness,
  ChevronRight,
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

  const activeServices = services?.length ?? 0

  const firstName =
    profile?.first_name ||
    profile?.company_name ||
    'Client'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172554] via-[#1e3a8a] to-[#2563eb] px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10 lg:px-10">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">

              <BriefcaseBusiness className="h-5 w-5 text-white" />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Client Portal
              </p>

              <p className="mt-0.5 text-xs text-blue-200">
                POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
              </p>

            </div>

          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Welcome, {firstName}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Everything you need to manage your accounting services —
            track progress, submit documents and communicate securely
            with your advisory team.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <Link href="/portal/cases">

              <Button
                className="h-11 rounded-xl bg-white px-5 font-semibold text-[#17365D] shadow-sm hover:bg-blue-50"
              >
                View My Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>

            <Link href="/portal/documents">

              <Button
                variant="outline"
                className="h-11 rounded-xl border-white/30 bg-white/10 px-5 font-semibold text-white hover:bg-white/20 hover:text-white"
              >
                Upload Documents
                <Upload className="ml-2 h-4 w-4" />
              </Button>

            </Link>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* QUICK ACCESS */}
      {/* ========================================================= */}

      <section>

        <div className="mb-5">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Quick Access
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Your Portal
          </h2>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* ACTIVE SERVICES */}

          <Card className="group rounded-2xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">

                  <Clock3 className="h-5 w-5 text-primary" />

                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  Current
                </span>

              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Active Services
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight">
                {activeServices}
              </p>

              <Link
                href="/portal/cases"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View services
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>

            </CardContent>

          </Card>

          {/* DOCUMENTS */}

          <Card className="group rounded-2xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">

                  <Upload className="h-5 w-5 text-primary" />

                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  Secure
                </span>

              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Documents
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight">
                Upload &amp; manage
              </p>

              <Link
                href="/portal/documents"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Open documents
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>

            </CardContent>

          </Card>

          {/* MESSAGES */}

          <Card className="group rounded-2xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">

                  <MessageSquare className="h-5 w-5 text-primary" />

                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  Support
                </span>

              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Messages
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight">
                Stay connected
              </p>

              <Link
                href="/portal/messages"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View messages
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>

            </CardContent>

          </Card>

          {/* INVOICES */}

          <Card className="group rounded-2xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">

                  <Receipt className="h-5 w-5 text-primary" />

                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  Billing
                </span>

              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Invoices
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight">
                View billing
              </p>

              <Link
                href="/portal/invoices"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View invoices
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* ========================================================= */}
      {/* SERVICES */}
      {/* ========================================================= */}

      <section>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your Services
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Current Services
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor the progress of your accounting and advisory work.
            </p>

          </div>

          {services && services.length > 0 && (

            <Link href="/portal/cases">

              <Button
                variant="outline"
                className="rounded-xl"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </Link>

          )}

        </div>

        {services && services.length > 0 ? (

          <div className="space-y-5">

            {services.map((service) => {

              const progress = service.progress ?? 0

              return (

                <Card
                  key={service.id}
                  className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md"
                >

                  <CardContent className="p-6 sm:p-8">

                    {/* HEADER */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex gap-4">

                        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:flex">

                          <FileText className="h-5 w-5 text-primary" />

                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {service.service_type}
                          </p>

                          <h3 className="mt-1 text-xl font-bold tracking-tight">
                            {service.title}
                          </h3>

                        </div>

                      </div>

                      <div className="w-fit rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                        {service.status}
                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-7">

                      <div className="mb-3 flex items-center justify-between">

                        <span className="text-sm font-medium">
                          Progress
                        </span>

                        <span className="text-sm font-bold text-primary">
                          {progress}%
                        </span>

                      </div>

                      <Progress
                        value={progress}
                        className="h-2.5"
                      />

                    </div>

                    {/* FOOTER */}

                    <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">

                        <span>
                          <span className="font-medium text-foreground">
                            {progress}%
                          </span>{' '}
                          complete
                        </span>

                        <span>
                          Due:{' '}
                          <span className="font-medium text-foreground">
                            {service.due_date
                              ? new Date(
                                  service.due_date
                                ).toLocaleDateString()
                              : 'Not set'}
                          </span>
                        </span>

                      </div>

                      <Link
                        href={`/portal/cases/${service.id}`}
                      >

                        <Button className="w-full rounded-xl sm:w-auto">

                          View Service

                          <ArrowRight className="ml-2 h-4 w-4" />

                        </Button>

                      </Link>

                    </div>

                  </CardContent>

                </Card>

              )
            })}

          </div>

        ) : (

          <Card className="rounded-2xl border-border/60 shadow-sm">

            <CardContent className="px-6 py-14 text-center sm:px-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">

                <FileText className="h-7 w-7 text-primary" />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Services Yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Your accounting and advisory services will appear here
                once they have been created by your advisory team.
              </p>

              <Link href="/portal/request-service">

                <Button className="mt-6 rounded-xl">

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

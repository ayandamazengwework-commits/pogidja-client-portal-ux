import { redirect } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Receipt,
  Upload,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export default async function PortalPage() {
  const supabase = await createClient()

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // --------------------------------------------------
  // Profile
  // --------------------------------------------------

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // --------------------------------------------------
  // Client
  // --------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    redirect('/auth/login')
  }

  // --------------------------------------------------
  // Services
  // --------------------------------------------------

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  const serviceList = services ?? []

  // --------------------------------------------------
  // Document Requests
  // --------------------------------------------------

  const { data: documentRequests } = await supabase
    .from('document_requests')
    .select(
      'id, title, description, required, uploaded'
    )
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  const pendingDocuments =
    (documentRequests ?? []).filter(
      (document) =>
        document.required !== false &&
        document.uploaded !== true
    )

  // --------------------------------------------------
  // Notifications
  // --------------------------------------------------

  const { count: unreadNotifications } =
    await supabase
      .from('notifications')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', user.id)
      .eq('read', false)

  // --------------------------------------------------
  // Messages
  // --------------------------------------------------

  const { count: unreadMessages } =
    await supabase
      .from('messages')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('recipient_id', user.id)
      .eq('read', false)

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const activeServices = serviceList.filter(
    (service) =>
      service.status !== 'Completed'
  )

  const completedServices = serviceList.filter(
    (service) =>
      service.status === 'Completed'
  )

  const firstName =
    profile?.first_name ||
    profile?.company_name ||
    'Client'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* ================================================== */}
      {/* WELCOME HEADER                                      */}
      {/* ================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-[#17365D] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10">

        {/* Decorative elements */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#D9B95B]/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8D48A]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#D9B95B]" />

                Client Portal

              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

                Welcome, {firstName}

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">

                Manage your accounting services, monitor
                progress, submit documents and stay connected
                with POG ADVISORY AND CHARTERED ACCOUNTANTS INC.

              </p>

            </div>

            <div className="hidden lg:block">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur">

                <span className="font-serif text-4xl font-bold text-[#D9B95B]">
                  P
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* OVERVIEW                                            */}
      {/* ================================================== */}

      <section>

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6D20]">
            Overview
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold text-[#17365D]">
            Your Account
          </h2>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Active Services */}

          <Card className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365D]/8">

                  <Clock3 className="h-5 w-5 text-[#17365D]" />

                </div>

                <span className="text-xs font-medium text-slate-400">
                  Services
                </span>

              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                Active Services
              </p>

              <div className="mt-1 flex items-end gap-2">

                <span className="font-serif text-3xl font-bold text-[#17365D]">
                  {activeServices.length}
                </span>

              </div>

            </CardContent>

          </Card>

          {/* Documents */}

          <Card className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9B95B]/15">

                  <Upload className="h-5 w-5 text-[#8A6D20]" />

                </div>

                {pendingDocuments.length > 0 && (

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">

                    {pendingDocuments.length} pending

                  </span>

                )}

              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                Documents
              </p>

              <p className="mt-1 font-serif text-3xl font-bold text-[#17365D]">
                {pendingDocuments.length}
              </p>

              <Link
                href="/portal/documents"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#17365D] hover:text-[#8A6D20]"
              >
                {pendingDocuments.length > 0
                  ? 'Upload required documents'
                  : 'View documents'}

                <ArrowRight className="ml-1.5 h-4 w-4" />

              </Link>

            </CardContent>

          </Card>

          {/* Messages */}

          <Card className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365D]/8">

                  <MessageSquare className="h-5 w-5 text-[#17365D]" />

                </div>

                {(unreadMessages ?? 0) > 0 && (

                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#17365D] px-2 text-xs font-bold text-white">

                    {unreadMessages}

                  </span>

                )}

              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                Messages
              </p>

              <p className="mt-1 font-serif text-3xl font-bold text-[#17365D]">
                {unreadMessages ?? 0}
              </p>

              <Link
                href="/portal/messages"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#17365D] hover:text-[#8A6D20]"
              >
                Open messages
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>

            </CardContent>

          </Card>

          {/* Completed */}

          <Card className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">

                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                </div>

                <span className="text-xs font-medium text-slate-400">
                  Completed
                </span>

              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                Completed Services
              </p>

              <p className="mt-1 font-serif text-3xl font-bold text-[#17365D]">
                {completedServices.length}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* ================================================== */}
      {/* ACTION BANNER                                       */}
      {/* ================================================== */}

      {pendingDocuments.length > 0 && (

        <section className="rounded-2xl border border-[#D9B95B]/30 bg-[#D9B95B]/8 p-5 sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9B95B]/20">

                <FileText className="h-5 w-5 text-[#8A6D20]" />

              </div>

              <div>

                <h3 className="font-semibold text-[#17365D]">
                  Documents require your attention
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">

                  You have {pendingDocuments.length}{' '}
                  {pendingDocuments.length === 1
                    ? 'document'
                    : 'documents'}{' '}
                  requested by your accountant.

                </p>

              </div>

            </div>

            <Link href="/portal/documents">

              <Button className="w-full bg-[#17365D] text-white hover:bg-[#102945] sm:w-auto">

                Review Documents

                <ArrowRight className="ml-2 h-4 w-4" />

              </Button>

            </Link>

          </div>

        </section>

      )}

      {/* ================================================== */}
      {/* SERVICES                                            */}
      {/* ================================================== */}

      <section>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6D20]">
              Services
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-[#17365D]">
              Your Current Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the progress of your accounting work.
            </p>

          </div>

          <Link href="/portal/request-service">

            <Button
              variant="outline"
              className="border-[#17365D]/20 text-[#17365D] hover:bg-[#17365D]/5"
            >
              Request a Service
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </Link>

        </div>

        {serviceList.length > 0 ? (

          <div className="grid gap-5">

            {serviceList.map((service) => {

              const progress =
                service.progress ?? 0

              const isCompleted =
                service.status === 'Completed'

              return (

                <Card
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                >

                  <CardContent className="p-0">

                    {/* Top */}

                    <div className="p-6 sm:p-7">

                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17365D]/8">

                              {isCompleted ? (

                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                              ) : (

                                <FileText className="h-5 w-5 text-[#17365D]" />

                              )}

                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate font-serif text-xl font-bold text-[#17365D]">

                                {service.title}

                              </h3>

                              <p className="mt-0.5 text-sm text-slate-500">
                                {service.service_type}
                              </p>

                            </div>

                          </div>

                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-full border border-[#17365D]/10 bg-[#17365D]/5 px-3.5 py-1.5 text-xs font-semibold text-[#17365D]">

                          <span className="h-1.5 w-1.5 rounded-full bg-[#D9B95B]" />

                          {service.status}

                        </div>

                      </div>

                      {/* Progress */}

                      <div className="mt-7">

                        <div className="mb-2.5 flex items-center justify-between">

                          <span className="text-sm font-medium text-slate-600">
                            Progress
                          </span>

                          <span className="text-sm font-bold text-[#17365D]">
                            {progress}%
                          </span>

                        </div>

                        <Progress
                          value={progress}
                          className="h-2.5"
                        />

                      </div>

                      {/* Meta */}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              Due Date
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">

                              {service.due_date
                                ? new Date(
                                    service.due_date
                                  ).toLocaleDateString()
                                : 'Not set'}

                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                          <Clock3 className="h-4 w-4 text-slate-400" />

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              Status
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {isCompleted
                                ? 'Completed'
                                : 'In progress'}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Footer */}

                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                      <p className="text-xs text-slate-500">
                        Need assistance with this service?
                      </p>

                      <Link
                        href={`/portal/cases/${service.id}`}
                      >

                        <Button
                          size="sm"
                          className="w-full bg-[#17365D] text-white hover:bg-[#102945] sm:w-auto"
                        >

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

          <Card className="rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">

            <CardContent className="px-6 py-14 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17365D]/8">

                <Receipt className="h-7 w-7 text-[#17365D]" />

              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-[#17365D]">
                No Services Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                You don't currently have any accounting
                services. Once POG ADVISORY AND CHARTERED
                ACCOUNTANTS INC. creates a service for you,
                it will appear here.

              </p>

              <Link href="/portal/request-service">

                <Button className="mt-6 bg-[#17365D] text-white hover:bg-[#102945]">

                  Request a Service

                  <ArrowRight className="ml-2 h-4 w-4" />

                </Button>

              </Link>

            </CardContent>

          </Card>

        )}

      </section>

      {/* ================================================== */}
      {/* QUICK LINKS                                         */}
      {/* ================================================== */}

      <section className="grid gap-4 md:grid-cols-3">

        <Link href="/portal/documents">

          <Card className="h-full rounded-2xl border border-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17365D]/8">

                <Upload className="h-5 w-5 text-[#17365D]" />

              </div>

              <div className="flex-1">

                <p className="font-semibold text-[#17365D]">
                  Documents
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Upload and manage files
                </p>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </CardContent>

          </Card>

        </Link>

        <Link href="/portal/messages">

          <Card className="h-full rounded-2xl border border-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17365D]/8">

                <MessageSquare className="h-5 w-5 text-[#17365D]" />

              </div>

              <div className="flex-1">

                <p className="font-semibold text-[#17365D]">
                  Messages
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Contact your advisor
                </p>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </CardContent>

          </Card>

        </Link>

        <Link href="/portal/notifications">

          <Card className="h-full rounded-2xl border border-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-md">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9B95B]/15">

                <Bell className="h-5 w-5 text-[#8A6D20]" />

              </div>

              <div className="flex-1">

                <p className="font-semibold text-[#17365D]">
                  Notifications
                </p>

                <p className="mt-0.5 text-xs text-slate-500">

                  {unreadNotifications ?? 0} unread notification
                  {(unreadNotifications ?? 0) === 1
                    ? ''
                    : 's'}

                </p>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </CardContent>

          </Card>

        </Link>

      </section>

    </div>
  )
}

import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
} from 'lucide-react'

import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { UploadDocument } from '@/components/portal/upload-document'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function RequestDetailsPage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    notFound()
  }

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        name
      )
    `)
    .eq('id', id)
    .eq('client_id', client.id)
    .single()

  if (!service) {
    notFound()
  }

  const { data: documents } = await supabase
    .from('service_documents')
    .select('*')
    .eq('service_id', id)
    .order('created_at', {
      ascending: false,
    })

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('service_id', id)
    .order('created_at', {
      ascending: false,
    })

  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('entity_id', id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <Button
        variant="ghost"
        asChild
      >
        <Link href="/portal/cases">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Requests
        </Link>
      </Button>

      <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

        <div className="h-2 bg-gradient-to-r from-[#17365D] to-[#1E88E5]" />

        <CardContent className="space-y-8 p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">

                {service.service_categories?.name ??
                  service.service_type}

              </p>

              <h1 className="mt-2 text-4xl font-bold">

                {service.title}

              </h1>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">

                {service.description}

              </p>

            </div>

            <StatusBadge
              status={service.status}
            />

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <Card>

              <CardContent className="flex items-center gap-4 p-5">

                <Calendar className="h-8 w-8 text-blue-600" />

                <div>

                  <p className="text-xs uppercase text-slate-400">
                    Submitted
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      service.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

              </CardContent>

            </Card>

            <Card>

              <CardContent className="flex items-center gap-4 p-5">

                <Clock className="h-8 w-8 text-amber-600" />

                <div>

                  <p className="text-xs uppercase text-slate-400">
                    Last Updated
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      service.updated_at
                    ).toLocaleDateString()}
                  </p>

                </div>

              </CardContent>

            </Card>

            <Card>

              <CardContent className="flex items-center gap-4 p-5">

                <FileText className="h-8 w-8 text-green-600" />

                <div>

                  <p className="text-xs uppercase text-slate-400">
                    Documents
                  </p>

                  <p className="font-semibold">
                    {documents?.length ?? 0}
                  </p>

                </div>

              </CardContent>

            </Card>

          </div>
                    {/* Documents & Messages */}

          <div className="grid gap-8 xl:grid-cols-2">

            {/* Documents */}

            <Card className="rounded-3xl border-0 shadow-sm">

              <CardContent className="space-y-6 p-7">

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold">
                    Documents
                  </h2>

                 <UploadDocument
  serviceId={service.id}
/>

                </div>

                {documents && documents.length > 0 ? (

                  <div className="space-y-4">

                    {documents.map((document) => (

                      <div
                        key={document.id}
                        className="flex items-center justify-between rounded-2xl border p-4"
                      >

                        <div>

                          <h3 className="font-semibold">

                            {document.file_name}

                          </h3>

                          <p className="text-sm text-slate-500">

                            {document.document_type ?? 'Document'}

                          </p>

                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="rounded-2xl border border-dashed py-12 text-center">

                    <FileText className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                    <p className="text-slate-500">

                      No documents uploaded.

                    </p>

                  </div>

                )}

              </CardContent>

            </Card>

            {/* Messages */}

            <Card className="rounded-3xl border-0 shadow-sm">

              <CardContent className="space-y-6 p-7">

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold">
                    Messages
                  </h2>

                  <MessageSquare className="h-6 w-6 text-slate-400" />

                </div>

                {messages && messages.length > 0 ? (

                  <div className="space-y-5">

                    {messages.map((message) => (

                      <div
                        key={message.id}
                        className="rounded-2xl bg-slate-50 p-5"
                      >

                        <h3 className="font-semibold">

                          {message.subject || 'Message'}

                        </h3>

                        <p className="mt-3 whitespace-pre-wrap text-slate-600">

                          {message.body}

                        </p>

                        <p className="mt-4 text-xs text-slate-400">

                          {new Date(
                            message.created_at
                          ).toLocaleString()}

                        </p>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="rounded-2xl border border-dashed py-12 text-center">

                    <MessageSquare className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                    <p className="text-slate-500">

                      No messages yet.

                    </p>

                  </div>

                )}

              </CardContent>

            </Card>

          </div>
                    {/* Activity */}

          <Card className="rounded-3xl border-0 shadow-sm">

            <CardContent className="space-y-6 p-7">

              <h2 className="text-2xl font-bold">
                Activity Timeline
              </h2>

              {activity && activity.length > 0 ? (

                <div className="space-y-6">

                  {activity.map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-4"
                    >

                      <div className="mt-2 h-3 w-3 rounded-full bg-[#1E88E5]" />

                      <div className="flex-1 border-b pb-5 last:border-none">

                        <h3 className="font-semibold">

                          {item.action}

                        </h3>

                        {item.description && (

                          <p className="mt-2 text-slate-600">

                            {item.description}

                          </p>

                        )}

                        <p className="mt-3 text-xs text-slate-400">

                          {new Date(
                            item.created_at
                          ).toLocaleString()}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="rounded-2xl border border-dashed py-12 text-center">

                  <Clock className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                  <p className="text-slate-500">

                    No activity has been recorded yet.

                  </p>

                </div>

              )}

            </CardContent>

          </Card>

        </CardContent>

      </Card>

    </div>
  )
}

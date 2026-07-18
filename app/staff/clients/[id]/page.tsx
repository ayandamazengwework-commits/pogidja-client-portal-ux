import { notFound } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  FolderOpen,
  FileText,
  MessageSquare,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadDocument } from '@/components/portal/upload-document'
import { ClientActivity } from '@/components/staff/client-activity'
import { sendMessage } from '@/app/staff/messages/actions'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ClientProfilePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  // Load client

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', id)
    .single()

  if (clientError || !client) {
    console.error(clientError)
    notFound()
  }

  // Load profile separately

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', client.profile_id)
    .single()

  if (profileError || !profile) {
    console.error(profileError)
    notFound()
  }

  // Services

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  const latestService =
    services && services.length > 0
      ? services[0]
      : null

  const serviceIds =
    services?.map((service) => service.id) ?? []

  // Documents

  const { data: documents } =
    serviceIds.length > 0
      ? await supabase
          .from('service_documents')
          .select('*')
          .in('service_id', serviceIds)
          .order('created_at', {
            ascending: false,
          })
      : {
          data: [],
        }

  // Messages

  const { data: messages } =
    await supabase
      .from('messages')
      .select('*')
      .or(
        `sender_id.eq.${client.profile_id},recipient_id.eq.${client.profile_id}`
      )
      .order('created_at', {
        ascending: false,
      })

  return (
    <div className="space-y-8">

      <Button
        asChild
        variant="ghost"
      >
        <Link href="/staff/clients">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>
      </Button>

      <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

        <div className="h-2 bg-gradient-to-r from-[#17365D] to-[#1E88E5]" />

        <CardContent className="space-y-8 p-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row">

            <div className="flex gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E88E5] text-2xl font-bold text-white">

                {(profile.first_name?.[0] ?? '?').toUpperCase()}
                {(profile.last_name?.[0] ?? '').toUpperCase()}

              </div>

              <div>

                <h1 className="text-3xl font-bold">

                  {profile.company_name?.trim()
                    ? profile.company_name
                    : `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()}

                </h1>

                <p className="mt-2 text-slate-500">
                  {profile.email}
                </p>

                <div className="mt-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {client.status}
                </div>

              </div>

            </div>

            {latestService && (
              <UploadDocument
                serviceId={latestService.id}
              />
            )}

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
              <CardContent className="p-5">

                <Building2 className="mb-3 h-6 w-6 text-blue-600" />

                <p className="text-sm text-slate-500">
                  Company
                </p>

                <p className="mt-2 font-semibold">
                  {client.company?.name ??
                    profile.company_name ??
                    '-'}
                </p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <Mail className="mb-3 h-6 w-6 text-blue-600" />

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-2 font-semibold">
                  {profile.email}
                </p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <Phone className="mb-3 h-6 w-6 text-blue-600" />

                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-2 font-semibold">
                  {profile.phone || '-'}
                </p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">

                <FolderOpen className="mb-3 h-6 w-6 text-blue-600" />

                <p className="text-sm text-slate-500">
                  Active Services
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {services?.length ?? 0}
                </p>

              </CardContent>
            </Card>

          </div>

          {/* SERVICES */}

          <Card className="rounded-3xl border">

            <CardContent className="p-6">

              <h2 className="mb-6 text-2xl font-bold">
                Services
              </h2>

              {services && services.length > 0 ? (

                <div className="space-y-4">

                  {services.map((service) => (

                    <Card
                      key={service.id}
                      className="border shadow-none"
                    >

                      <CardContent className="flex items-center justify-between p-5">

                        <div>

                          <h3 className="font-semibold">
                            {service.title}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {service.service_type}
                          </p>

                          <div className="mt-3 flex gap-6 text-sm text-slate-400">

                            <span>{service.status}</span>

                            <span>{service.priority}</span>

                            <span>{service.progress ?? 0}%</span>

                          </div>

                        </div>

                        <Button
                          asChild
                          variant="outline"
                        >
                          <Link href={`/staff/services/${service.id}`}>
                            Open
                          </Link>
                        </Button>

                      </CardContent>

                    </Card>

                  ))}

                </div>

              ) : (

                <p className="text-slate-500">
                  No services found.
                </p>

              )}

            </CardContent>

          </Card>

          {/* DOCUMENTS */}

          <Card className="rounded-3xl border">

            <CardContent className="space-y-6 p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  Documents
                </h2>

                {latestService && (
                  <UploadDocument
                    serviceId={latestService.id}
                  />
                )}

              </div>

              {documents && documents.length > 0 ? (

                <div className="space-y-4">

                  {documents.map((document) => (

                    <div
                      key={document.id}
                      className="flex items-center justify-between rounded-2xl border p-5"
                    >

                      <div>

                        <h3 className="font-semibold">
                          {document.file_name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {document.document_type ?? 'Document'}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(document.created_at).toLocaleString()}
                        </p>

                      </div>

                      <Button
                        asChild
                        variant="outline"
                      >

                        <Link
                          href={`/api/documents/${document.id}`}
                          target="_blank"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Download
                        </Link>

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

          {/* MESSAGES */}

          <Card className="rounded-3xl border">

            <CardContent className="space-y-6 p-6">

              <div className="flex items-center gap-3">

                <MessageSquare className="h-6 w-6 text-[#1E88E5]" />

                <h2 className="text-2xl font-bold">
                  Conversation
                </h2>

              </div>

              <form
                action={sendMessage}
                className="space-y-4 rounded-2xl border p-5"
              >

                <input
                  type="hidden"
                  name="recipientId"
                  value={client.profile_id}
                />

                <input
                  type="hidden"
                  name="serviceId"
                  value={latestService?.id ?? ''}
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full rounded-xl border p-3"
                />

                <textarea
                  rows={4}
                  required
                  name="body"
                  placeholder="Type your message..."
                  className="w-full rounded-xl border p-3"
                />

                <div className="flex justify-end">

                  <Button type="submit">
                    Send Message
                  </Button>

                </div>

              </form>
                            {messages && messages.length > 0 ? (

                <div className="space-y-4">

                  {messages.map((message) => (

                    <div
                      key={message.id}
                      className={`rounded-2xl p-5 ${
                        message.sender_id === client.profile_id
                          ? 'bg-slate-100'
                          : 'bg-blue-50'
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <h3 className="font-semibold">
                          {message.subject || 'Message'}
                        </h3>

                        <span className="text-xs text-slate-400">
                          {new Date(message.created_at).toLocaleString()}
                        </span>

                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-slate-600">
                        {message.body}
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

          {/* ACTIVITY */}

          <Card className="rounded-3xl border">

            <CardContent className="p-6">

              <ClientActivity
                clientId={client.id}
              />

            </CardContent>

          </Card>

        </CardContent>

      </Card>

    </div>
  )
}

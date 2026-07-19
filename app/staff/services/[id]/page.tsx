import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock3,
  CheckCircle2,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { ServiceStatusPanel } from '@/components/staff/service-status-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UploadDocument } from '@/components/portal/upload-document'
import { sendMessage } from '@/app/staff/messages/actions'
import { ClientActivity } from '@/components/staff/client-activity'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ServicePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  // --------------------------------------------------
  // SERVICE
  // --------------------------------------------------

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (!service) {
    notFound()
  }

  // --------------------------------------------------
  // CLIENT
  // --------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(*),
      company:companies(*)
    `)
    .eq('id', service.client_id)
    .single()

  if (!client) {
    notFound()
  }

  const profile = client.profile

  // --------------------------------------------------
  // ASSIGNED STAFF
  // --------------------------------------------------

  let assignedStaff = null

  if (service.assigned_to) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name,last_name')
      .eq('id', service.assigned_to)
      .single()

    assignedStaff = data
  }

  // --------------------------------------------------
  // DOCUMENTS
  // --------------------------------------------------

  const { data: documents } = await supabase
    .from('service_documents')
    .select('*')
    .eq('service_id', service.id)
    .order('created_at', {
      ascending: false,
    })

  // --------------------------------------------------
  // MESSAGES
  // --------------------------------------------------

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('service_id', service.id)
    .order('created_at', {
      ascending: false,
    })

  const progress = service.progress ?? 0

  const statusColour =
    service.status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : service.status === 'In Progress'
      ? 'bg-blue-100 text-blue-700'
      : service.status === 'Pending'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-slate-100 text-slate-700'

  const priorityColour =
    service.priority === 'High'
      ? 'bg-red-100 text-red-700'
      : service.priority === 'Medium'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-green-100 text-green-700'

  return (
    <div className="space-y-8">
            {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <Link
              href="/staff/clients"
              className="mb-5 inline-flex items-center text-sm text-blue-200 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
              SERVICE
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {service.title}
            </h1>

            <p className="mt-3 text-lg text-slate-300">
              {service.service_type}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColour}`}
              >
                {service.status}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${priorityColour}`}
              >
                {service.priority} Priority
              </span>

            </div>

          </div>

          <UploadDocument serviceId={service.id} />

        </div>

      </section>
<ServiceStatusPanel
  service={service}
/>
      {/* OVERVIEW */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <Clock3 className="h-6 w-6 text-blue-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Progress
                </p>

                <p className="text-3xl font-bold">
                  {progress}%
                </p>

              </div>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-[#1E88E5] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <Calendar className="h-6 w-6 text-blue-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Due Date
                </p>

                <p className="text-lg font-semibold">

                  {service.due_date
                    ? new Date(service.due_date).toLocaleDateString()
                    : 'No due date'}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Assigned Staff
                </p>

                <p className="text-lg font-semibold">

                  {assignedStaff
                    ? `${assignedStaff.first_name} ${assignedStaff.last_name}`
                    : 'Unassigned'}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <Building2 className="h-6 w-6 text-blue-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Client
                </p>

                <p className="font-semibold">

                  {profile.company_name ||
                    `${profile.first_name} ${profile.last_name}`}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>
            {/* DETAILS */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Service Information */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="space-y-6 p-8">

            <h2 className="text-2xl font-bold">
              Service Information
            </h2>

            <div>

              <p className="text-sm text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-slate-700">

                {service.description ||
                  'No description has been provided.'}

              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Service Type
                </p>

                <p className="mt-2 font-semibold">
                  {service.service_type}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Priority
                </p>

                <p className="mt-2 font-semibold">
                  {service.priority}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="mt-2 font-semibold">
                  {service.status}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Progress
                </p>

                <p className="mt-2 font-semibold">
                  {progress}%
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* Client Information */}

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="space-y-6 p-8">

            <h2 className="text-2xl font-bold">
              Client Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <User className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Client
                  </p>

                  <p className="font-semibold">

                    {profile.company_name ||
                      `${profile.first_name} ${profile.last_name}`}

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Building2 className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Company
                  </p>

                  <p>

                    {client.company?.name ||
                      profile.company_name ||
                      '-'}

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Mail className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p>{profile.email}</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Phone className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p>{profile.phone || '-'}</p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>
            {/* DOCUMENTS */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-8">

          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <FileText className="h-6 w-6 text-[#1E88E5]" />
            Documents
          </h2>

          {documents && documents.length > 0 ? (

            <div className="space-y-4">

              {documents.map((doc) => (

                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-2xl border p-5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {doc.file_name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {doc.document_type || 'Document'}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(doc.created_at).toLocaleString()}
                    </p>

                  </div>

                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link
                      href={`/api/documents/${doc.id}`}
                      target="_blank"
                    >
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
                No documents uploaded yet.
              </p>

            </div>

          )}

        </CardContent>

      </Card>

      {/* MESSAGES */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="space-y-6 p-8">

          <h2 className="flex items-center gap-3 text-2xl font-bold">

            <MessageSquare className="h-6 w-6 text-[#1E88E5]" />

            Conversation

          </h2>

          <form
            action={sendMessage}
            className="space-y-4 rounded-2xl border p-5"
          >

            <input
              type="hidden"
              name="recipientId"
              value={profile.id}
            />

            <input
              type="hidden"
              name="serviceId"
              value={service.id}
            />

            <input
              name="subject"
              type="text"
              placeholder="Subject"
              className="w-full rounded-xl border p-3"
            />

            <textarea
              rows={4}
              required
              name="body"
              placeholder="Write your message..."
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
                    message.sender_id === profile.id
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

                  <p className="mt-3 whitespace-pre-wrap text-slate-700">

                    {message.body}

                  </p>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed py-12 text-center">

              <MessageSquare className="mx-auto mb-4 h-10 w-10 text-slate-300" />

              <p className="text-slate-500">

                No conversation yet.

              </p>

            </div>

          )}

        </CardContent>

      </Card>

      {/* ACTIVITY */}

      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-8">

          <ClientActivity
            clientId={client.id}
          />

        </CardContent>

      </Card>

    </div>
  )
}

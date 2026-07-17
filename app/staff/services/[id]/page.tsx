import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  User,
  Building2,
  Mail,
  Phone,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      client:profiles!services_client_id_fkey(
        id,
        first_name,
        last_name,
        company_name,
        email,
        phone
      ),
      assigned:profiles!services_assigned_to_fkey(
        first_name,
        last_name
      )
    `)
    .eq('id', id)
    .single()

  if (!service) {
    notFound()
  }

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

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              SERVICE DETAILS
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              {service.title}
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
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

          <Button
            asChild
            variant="secondary"
          >

            <Link href="/staff/services">

              <ArrowLeft className="mr-2 h-4 w-4" />

              Back to Services

            </Link>

          </Button>

        </div>

      </section>

      {/* Overview */}

      <div className="grid gap-6 md:grid-cols-3">

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
                className="h-full rounded-full bg-[#1E88E5]"
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
                    ? new Date(
                        service.due_date
                      ).toLocaleDateString()
                    : 'Not Set'}

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

                  {service.assigned
                    ? `${service.assigned.first_name} ${service.assigned.last_name}`
                    : 'Unassigned'}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* Details */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="space-y-6 p-8">

            <h2 className="text-2xl font-bold">
              Service Information
            </h2>

            <div>

              <p className="text-sm text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7">
                {service.description ||
                  'No description has been provided for this service.'}
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2">

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
                  Service Type
                </p>

                <p className="mt-2 font-semibold">
                  {service.service_type}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

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

                    {service.client.company_name ||
                      `${service.client.first_name} ${service.client.last_name}`}

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
                    {service.client.company_name || '-'}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Mail className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p>{service.client.email}</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Phone className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p>{service.client.phone || '-'}</p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>
            {/* Documents */}

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Documents
          </h2>

          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {doc.file_name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {doc.document_type || 'Document'}
                    </p>
                  </div>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No documents uploaded.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Activity */}

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Activity Timeline
          </h2>

          {activity.length > 0 ? (
            <div className="space-y-5">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="border-l-2 border-blue-500 pl-4"
                >
                  <p className="font-medium">
                    {item.action}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No activity recorded.
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

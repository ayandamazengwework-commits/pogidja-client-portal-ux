import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MessageSquare,
  Upload,
  User,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function CaseDetailsPage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      client:clients(
        *,
        profile:profiles(*),
        company:companies(*)
      )
    `)
    .eq('id', id)
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
    .eq('service_id', id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/staff/cases"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>

          <h1 className="text-4xl font-bold">
            {service.title}
          </h1>

          <p className="mt-2 text-slate-500">
            {service.service_type}
          </p>

        </div>

        <Button>
          Update Case
        </Button>

      </div>

      {/* Top Cards */}

      <div className="grid gap-6 lg:grid-cols-3">

        <Card>

          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <User className="h-5 w-5 text-[#1E88E5]" />

              <h2 className="font-semibold">
                Client
              </h2>

            </div>

            <div>

              <p className="font-semibold text-lg">
                {service.client.company?.name ||

                  `${service.client.profile.first_name} ${service.client.profile.last_name}`}
              </p>

              <p className="text-sm text-slate-500">
                {service.client.profile.email}
              </p>

              <p className="text-sm text-slate-500">
                {service.client.profile.phone || '-'}
              </p>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <Clock3 className="h-5 w-5 text-amber-600" />

              <h2 className="font-semibold">
                Progress
              </h2>

            </div>

            <Progress
              value={service.progress ?? 0}
            />

            <div className="flex items-center justify-between text-sm">

              <span>
                {service.progress ?? 0}%
              </span>

              <span>
                {service.status}
              </span>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <Calendar className="h-5 w-5 text-green-600" />

              <h2 className="font-semibold">
                Information
              </h2>

            </div>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Priority
                </span>

                <span>
                  {service.priority}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Status
                </span>

                <span>
                  {service.status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Created
                </span>

                <span>
                  {new Date(
                    service.created_at
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>
            {/* Bottom Section */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Documents */}

        <Card className="xl:col-span-1">

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Documents
              </h2>

              <Button size="sm">

                <Upload className="mr-2 h-4 w-4" />

                Upload

              </Button>

            </div>

            {documents && documents.length > 0 ? (

              <div className="space-y-4">

                {documents.map((document) => (

                  <div
                    key={document.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >

                    <div className="flex items-center gap-3">

                      <FileText className="h-5 w-5 text-[#1E88E5]" />

                      <div>

                        <p className="font-medium">
                          {document.file_name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            document.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                    >

                      <Download className="h-4 w-4" />

                    </Button>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-sm text-slate-500">
                No documents uploaded.
              </p>

            )}

          </CardContent>

        </Card>

        {/* Messages */}

        <Card className="xl:col-span-1">

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Messages
              </h2>

              <Button size="sm">
                New Message
              </Button>

            </div>

            {messages && messages.length > 0 ? (

              <div className="space-y-4">

                {messages.map((message) => (

                  <div
                    key={message.id}
                    className="rounded-xl border p-4"
                  >

                    <div className="flex items-center gap-2">

                      <MessageSquare className="h-4 w-4 text-[#1E88E5]" />

                      <p className="font-semibold">
                        {message.subject ?? 'Message'}
                      </p>

                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      {message.body}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(
                        message.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-sm text-slate-500">
                No messages yet.
              </p>

            )}

          </CardContent>

        </Card>

        {/* Activity */}

        <Card>

          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Activity
              </h2>

              <CheckCircle2 className="h-5 w-5 text-green-600" />

            </div>

            {activity && activity.length > 0 ? (

              <div className="space-y-4">

                {activity.map((item) => (

                  <div
                    key={item.id}
                    className="rounded-xl border p-4"
                  >

                    <p className="font-semibold">
                      {item.action}
                    </p>

                    {item.description && (

                      <p className="mt-2 text-sm text-slate-600">
                        {item.description}
                      </p>

                    )}

                    <p className="mt-3 text-xs text-slate-400">

                      {new Date(
                        item.created_at
                      ).toLocaleString()}

                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-sm text-slate-500">
                No activity yet.
              </p>

            )}

          </CardContent>

        </Card>

      </div>

      {/* Quick Actions */}

      <Card>

        <CardContent className="flex flex-wrap gap-4 p-6">

          <Button>
            Update Status
          </Button>

          <Button variant="outline">
            Upload Document
          </Button>

          <Button variant="outline">
            Message Client
          </Button>

          <Button variant="outline">
            Add Note
          </Button>

          <Button variant="default">
            Mark Complete
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}

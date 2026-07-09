import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function RequestDetailsPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()

  const { data: request } = await supabase
    .from('services')
    .select(`
      *,
      category:service_categories(
        id,
        name
      ),
      client:clients(
        id,
        profile:profiles(
          id,
          first_name,
          last_name,
          email,
          phone,
          company_name
        )
      ),
      assigned:profiles(
        id,
        first_name,
        last_name
      )
    `)
    .eq('id', id)
    .single()

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            {request.title}
          </h1>

          <p className="text-slate-500">
            {request.category?.name}
          </p>

        </div>

        <StatusBadge
          label={request.status}
          tone={
            request.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : request.status === 'Working On It'
              ? 'bg-orange-100 text-orange-700'
              : request.status === 'In Review'
              ? 'bg-purple-100 text-purple-700'
              : request.status === 'Awaiting Documents'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <Card>

          <CardContent className="space-y-4 p-6">

            <h2 className="text-lg font-semibold">
              Client
            </h2>

            <div>

              <p className="font-medium">
                {request.client?.profile?.company_name ||
                  `${request.client?.profile?.first_name} ${request.client?.profile?.last_name}`}
              </p>

              <p className="text-sm text-slate-500">
                {request.client?.profile?.email}
              </p>

              <p className="text-sm text-slate-500">
                {request.client?.profile?.phone}
              </p>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-4 p-6">

            <h2 className="text-lg font-semibold">
              Request Information
            </h2>

            <div className="space-y-2 text-sm">

              <p>

                <strong>Priority:</strong>{' '}
                {request.priority}

              </p>

              <p>

                <strong>Created:</strong>{' '}
                {new Date(request.created_at).toLocaleDateString()}

              </p>

              <p>

                <strong>Assigned To:</strong>{' '}

                {request.assigned
                  ? `${request.assigned.first_name} ${request.assigned.last_name}`
                  : 'Unassigned'}

              </p>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-4 p-6">

            <h2 className="text-lg font-semibold">
              Actions
            </h2>

            <Button className="w-full">
              Change Status
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              Upload Documents
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              Message Client
            </Button>

          </CardContent>

        </Card>

      </div>

      <Card>

        <CardContent className="p-6">

          <h2 className="mb-4 text-lg font-semibold">
            Description
          </h2>

          <p className="whitespace-pre-wrap">
            {request.description}
          </p>

        </CardContent>

      </Card>

      <Card>

        <CardContent className="p-6">

          <h2 className="mb-4 text-lg font-semibold">
            Documents
          </h2>

          <p className="text-slate-500">
            No documents uploaded yet.
          </p>

        </CardContent>

      </Card>

      <Card>

        <CardContent className="p-6">

          <h2 className="mb-4 text-lg font-semibold">
            Conversation
          </h2>

          <p className="text-slate-500">
            No messages yet.
          </p>

        </CardContent>

      </Card>

    </div>
  )
}
